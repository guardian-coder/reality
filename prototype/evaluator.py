"""
Claim-Evidence-Action Contract — deterministic evaluator.

Built 2026-09-04 per COLLABORATION.md's current collaboration cycle
step 2. Hardened same day after Codex's adversarial falsifier review
(validation/2026-09-04_CODEX_FALSIFIER_REVIEW.md) reproduced five real
gaps (A-01 through A-05) - independently confirmed 5/5 before this
rewrite. Full record of what changed and why:
validation/2026-09-04_CONTRACT_HARDENING_RATIONALE.md (schema/contract
change) and this file's own docstrings (evaluator-logic changes).

Deliberate simplification, unchanged from the first version and still
worth flagging back to Codex rather than silently assuming: the schema
defines a separate DependencyGraph type. Every EvidenceRecord already
self-declares `parent_evidence_ids` and `failure_domains`. This
evaluator derives lineage-sharing and failure-domain-sharing entirely
from those per-record fields.

Stdlib only, no dependencies.
"""

import datetime


# ---- reason-code vocabulary --------------------------------------------

REASON_ALL_CONFIRMED = "ALL_REQUIRED_CLAIMS_CONFIRMED"
REASON_EVIDENCE_MISSING = "REQUIRED_POSITIVE_EVIDENCE_MISSING"
REASON_EVIDENCE_STALE = "REQUIRED_POSITIVE_EVIDENCE_STALE"
REASON_INSUFFICIENT_INDEPENDENCE = "INSUFFICIENT_INDEPENDENT_CONFIRMATION"
REASON_CONTRADICTION_REFUSE = "SAFETY_CRITICAL_CONTRADICTION"
REASON_CONTRADICTION_REVIEW = "UNRESOLVED_CONFLICT"
REASON_INTEGRITY_FAILURE = "INTEGRITY_FAILURE"
CLAIM_SPECIFIC_MISSING_REASON = {
    "C-05": "STOP_CONDITION_STATE_UNKNOWN",
}

def _parse_dt(s):
    return datetime.datetime.fromisoformat(s.replace("Z", "+00:00"))


def _value_matches(evidence, predicate):
    if predicate is None:
        return None  # no predicate defined - caller decides the default
    actual = evidence.get(predicate["field"])
    if predicate["operator"] == "equals":
        return actual == predicate["value"]
    if predicate["operator"] == "not_equals":
        return actual != predicate["value"]
    raise ValueError(f"Unknown predicate operator: {predicate['operator']}")


def _passes_temporal_ordering(ev, decision_time):
    """Fix for A-03: reality must be observed before it's received, and
    received before or at the moment a decision about it is made. A
    record whose observation_time is after decision_time describes
    something that, from the decision's own vantage point, hasn't
    happened yet - it cannot justify an earlier decision no matter how
    fresh it otherwise looks."""
    obs_time = _parse_dt(ev["observation_time"])
    received_time = _parse_dt(ev["received_time"])
    if obs_time > received_time:
        return False
    if received_time > decision_time:
        return False
    if obs_time > decision_time:
        return False
    return True


def _entity_matches(ev, claim):
    subject = claim.get("subject_entity_id")
    if subject is None:
        return True  # claim doesn't declare a subject - no binding check applies
    return ev["observed_entity_id"] == subject


def _rule_admits(ev, rule, claim, decision_time):
    """Type, freshness, integrity, temporal ordering, and entity binding
    - the full set of checks an evidence record must pass to even be
    considered for a given rule, confirming or contradicting."""
    if ev["evidence_type"] != rule["evidence_type"]:
        return False
    if not _entity_matches(ev, claim):
        return False
    required_integrity = rule.get("required_integrity_status")
    if required_integrity and ev["integrity_status"] != required_integrity:
        return False
    if not _passes_temporal_ordering(ev, decision_time):
        return False
    valid_until = _parse_dt(ev["valid_until"])
    if decision_time > valid_until:
        return False
    max_age = rule.get("maximum_age_seconds")
    if max_age is not None:
        age_seconds = (decision_time - _parse_dt(ev["observation_time"])).total_seconds()
        if age_seconds > max_age:
            return False
    return True


def _resolve_roots(evidence_id, evidence_by_id, ids_set, memo, visiting):
    """Returns the frozenset of root evidence_ids that evidence_id
    ultimately derives from, or None if ancestry cannot be fully
    resolved (a declared parent is missing from the evaluated set, or
    a cycle was detected) - fails closed, same discipline as A-05.

    A record with no parents IS a root (resolves to itself). A record
    with parents resolves to the UNION of its parents' root sets - not
    a merge of the parents WITH EACH OTHER. This is the fix for A-06:
    plain union-find treated "child derives from A and B" as "A and B
    are now the same thing," which silently destroys genuine
    independence the moment two independent sources get fused into one
    record. A fused record correctly contributes evidence for BOTH of
    its roots without making those roots dependent on one another."""
    if evidence_id in memo:
        return memo[evidence_id]
    if evidence_id in visiting:
        memo[evidence_id] = None  # cycle - fail closed, same as unresolved ancestry
        return None
    parent_ids = evidence_by_id[evidence_id].get("parent_evidence_ids", [])
    if not parent_ids:
        result = frozenset([evidence_id])
        memo[evidence_id] = result
        return result
    visiting.add(evidence_id)
    roots = set()
    for parent_id in parent_ids:
        if parent_id not in ids_set:
            visiting.discard(evidence_id)
            memo[evidence_id] = None
            return None
        parent_roots = _resolve_roots(parent_id, evidence_by_id, ids_set, memo, visiting)
        if parent_roots is None:
            visiting.discard(evidence_id)
            memo[evidence_id] = None
            return None
        roots |= parent_roots
    visiting.discard(evidence_id)
    result = frozenset(roots)
    memo[evidence_id] = result
    return result


def _effective_independent_lineages(evidence_ids, evidence_by_id):
    """Resolves every qualifying record to its root set (see
    _resolve_roots), then groups only the ROOTS that share a declared
    failure domain - read from the root records' own `failure_domains`,
    never from a derived/fused record's own domain (a fusion service's
    own compute dependency doesn't make the underlying observations it
    fused correlated). A record whose ancestry can't be fully resolved
    contributes no roots at all - fails closed, same as before.

    Still explicitly untyped: any two roots sharing any failure-domain
    STRING collapse, with no notion of which property that domain
    actually threatens (a shared clock affecting freshness is treated
    the same as a shared positioning source affecting a location claim
    itself). Codex named this as a real, separate open gap in the
    original falsifier review, section 4 - not fixed here, not claimed
    fixed here."""
    ids_set = set(evidence_ids)
    memo = {}
    all_roots = set()
    for eid in evidence_ids:
        roots = _resolve_roots(eid, evidence_by_id, ids_set, memo, set())
        if roots is not None:
            all_roots |= roots

    parent = {r: r for r in all_roots}

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(a, b):
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[ra] = rb

    domain_to_roots = {}
    for r in all_roots:
        for domain in evidence_by_id[r].get("failure_domains", []):
            domain_to_roots.setdefault(domain, []).append(r)
    for roots in domain_to_roots.values():
        for i in range(1, len(roots)):
            union(roots[0], roots[i])

    return len({find(r) for r in all_roots})


def _find_contradictions(claim, evidence_records, decision_time):
    """Fix for the "contradiction bypasses contract rules" gap: a
    record only counts as contradicting a claim if it is admissible
    under an explicit rule - either a dedicated contradiction_rules
    entry (e.g. a structural alarm for C-02), or a confirms_when/
    contradicts_when value predicate on one of the claim's own
    evidence_rules (e.g. C-05's stop register). A bare `stance:
    CONTRADICTS` label is no longer trusted by itself - it must also
    pass one of these two real admissibility checks."""
    found = []
    for rule in claim.get("contradiction_rules", []):
        for ev in evidence_records:
            if claim["claim_id"] not in ev["claim_ids"]:
                continue
            if _rule_admits(ev, rule, claim, decision_time):
                found.append(ev)
    for rule in claim["evidence_rules"]:
        contradicts_when = rule.get("contradicts_when")
        if contradicts_when is None:
            continue
        for ev in evidence_records:
            if claim["claim_id"] not in ev["claim_ids"]:
                continue
            if _rule_admits(ev, rule, claim, decision_time) and _value_matches(ev, contradicts_when):
                found.append(ev)
    return found


def evaluate_claim(claim, evidence_records, decision_time):
    """Returns a ClaimEvaluation dict matching cea.schema.json's shape."""
    contradicting = _find_contradictions(claim, evidence_records, decision_time)
    if contradicting:
        return {
            "claim_id": claim["claim_id"],
            "state": "CONTRADICTED",
            "effective_independent_lineages": 0,
            "supporting_evidence_ids": [],
            "contradicting_evidence_ids": sorted({e["evidence_id"] for e in contradicting}),
            "reasons": [f"Admissible contradicting evidence present: "
                        f"{sorted({e['evidence_id'] for e in contradicting})}"],
        }

    relevant = [e for e in evidence_records if claim["claim_id"] in e["claim_ids"]]
    evidence_by_id = {e["evidence_id"]: e for e in relevant}

    unmet_rules = []
    all_qualifying_ids = []
    for rule in claim["evidence_rules"]:
        admissible = [e for e in relevant if _rule_admits(e, rule, claim, decision_time)]
        confirms_when = rule.get("confirms_when")
        if confirms_when is not None:
            qualifying = [e for e in admissible if _value_matches(e, confirms_when)]
        else:
            qualifying = admissible
        all_qualifying_ids.extend(e["evidence_id"] for e in qualifying)
        if len(qualifying) < rule["minimum_count"]:
            candidates_of_type = [e for e in relevant if e["evidence_type"] == rule["evidence_type"]]
            if not candidates_of_type:
                unmet_rules.append((rule, "missing"))
            else:
                unmet_rules.append((rule, "stale_unverified_unbound_or_wrong_value"))

    if unmet_rules:
        reasons = []
        for rule, why in unmet_rules:
            if why == "missing":
                reasons.append(f"No evidence of type {rule['evidence_type']} found for {claim['claim_id']}")
            else:
                reasons.append(
                    f"Evidence of type {rule['evidence_type']} exists for {claim['claim_id']} "
                    f"but none is fresh, verified, correctly bound, and correctly valued as of decision time"
                )
        return {
            "claim_id": claim["claim_id"],
            "state": "UNKNOWN",
            "effective_independent_lineages": 0,
            "supporting_evidence_ids": sorted(set(all_qualifying_ids)),
            "contradicting_evidence_ids": [],
            "reasons": reasons,
        }

    unique_ids = sorted(set(all_qualifying_ids))
    lineages = _effective_independent_lineages(unique_ids, evidence_by_id)
    required_lineages = claim["minimum_independent_lineages"]
    if lineages < required_lineages:
        return {
            "claim_id": claim["claim_id"],
            "state": "UNKNOWN",
            "effective_independent_lineages": lineages,
            "supporting_evidence_ids": unique_ids,
            "contradicting_evidence_ids": [],
            "reasons": [
                f"{claim['claim_id']} has {lineages} effective independent lineage(s), "
                f"requires {required_lineages}"
            ],
        }

    return {
        "claim_id": claim["claim_id"],
        "state": "CONFIRMED",
        "effective_independent_lineages": lineages,
        "supporting_evidence_ids": unique_ids,
        "contradicting_evidence_ids": [],
        "reasons": [f"{claim['claim_id']} met all evidence rules with {lineages} independent lineage(s)"],
    }


def _cross_claim_dependencies(claim_evaluations, evidence_records):
    """Fix for E-03: independence is checked within each claim, but
    nothing previously surfaced when several prerequisites secretly
    share one physical dependency (e.g. one camera behind the identity
    cue, the condition observation, and the position fix at once) -
    each claim can look independently confirmed while the action as a
    whole rests on fewer real sources than it appears to. This reports
    the fact; it does not gate or change any disposition - the contract
    does not currently require cross-claim independence, and deciding
    whether it should is a separate, real design question, not
    something to fold into a visibility fix.

    Corrected same day (Codex's re-review of the first version): the
    first pass only read failure_domains off the directly-referenced
    evidence record, not its resolved roots. A claim whose only
    qualifying evidence is a fused/derived record would have reported
    that record's OWN domain (e.g. a fusion service's compute
    dependency) while missing the real shared domain sitting on its
    root observations - the same "derived record's own domain isn't
    what matters, its roots' domains are" distinction A-06 already
    established for independence counting, now applied consistently
    here too. A record with unresolved ancestry contributes no domain
    information, same fail-closed discipline as everywhere else."""
    evidence_by_id = {e["evidence_id"]: e for e in evidence_records}
    ids_set = set(evidence_by_id.keys())
    memo = {}
    domain_to_claims = {}
    for ce in claim_evaluations:
        referenced_ids = set(ce["supporting_evidence_ids"]) | set(ce["contradicting_evidence_ids"])
        domains_in_claim = set()
        for eid in referenced_ids:
            if eid not in evidence_by_id:
                continue
            roots = _resolve_roots(eid, evidence_by_id, ids_set, memo, set())
            if roots is None:
                continue
            for root_id in roots:
                domains_in_claim.update(evidence_by_id[root_id].get("failure_domains", []))
        for domain in domains_in_claim:
            domain_to_claims.setdefault(domain, set()).add(ce["claim_id"])

    return [
        {"failure_domain": domain, "claim_ids": sorted(claim_ids)}
        for domain, claim_ids in sorted(domain_to_claims.items())
        if len(claim_ids) >= 2
    ]


def evaluate_action(contract, evidence_records, decision_time_str, action_id="action-eval-1"):
    """Returns an ActionDisposition dict matching cea.schema.json's shape."""
    decision_time = _parse_dt(decision_time_str)

    # Fix for A-04: integrity failure is a distinct, safety-relevant
    # signal, not just "insufficient evidence." A record that failed
    # its own integrity check existing anywhere in the evidence set for
    # this action is a red flag about the channel or source itself, not
    # merely a gap to fill by waiting - route straight to REFUSE per
    # the contract's own disposition_policy.integrity_failure, before
    # any claim-level evaluation runs.
    failed_integrity = [e for e in evidence_records if e["integrity_status"] == "FAILED"]
    if failed_integrity:
        remaining_evidence = [e for e in evidence_records if e["integrity_status"] != "FAILED"]
        claim_evaluations = [
            evaluate_claim(claim, remaining_evidence, decision_time)
            for claim in contract["claims"]
        ]
        return {
            "action_id": action_id,
            "disposition": "REFUSE",
            "claim_evaluations": claim_evaluations,
            "reason_codes": [REASON_INTEGRITY_FAILURE],
            "cross_claim_dependencies": _cross_claim_dependencies(claim_evaluations, remaining_evidence),
        }

    claim_evaluations = [
        evaluate_claim(claim, evidence_records, decision_time) for claim in contract["claims"]
    ]
    claim_by_id = {c["claim_id"]: c for c in contract["claims"]}
    cross_claim_deps = _cross_claim_dependencies(claim_evaluations, evidence_records)

    for ce in claim_evaluations:
        if ce["state"] == "CONTRADICTED":
            policy = claim_by_id[ce["claim_id"]]["contradiction_policy"]
            disposition = "REFUSE" if policy == "REFUSE" else "HUMAN_REVIEW"
            reason = REASON_CONTRADICTION_REFUSE if policy == "REFUSE" else REASON_CONTRADICTION_REVIEW
            return {
                "action_id": action_id,
                "disposition": disposition,
                "claim_evaluations": claim_evaluations,
                "reason_codes": [reason],
                "cross_claim_dependencies": cross_claim_deps,
            }

    if all(ce["state"] == "CONFIRMED" for ce in claim_evaluations):
        return {
            "action_id": action_id,
            "disposition": "PERMIT",
            "claim_evaluations": claim_evaluations,
            "reason_codes": [REASON_ALL_CONFIRMED],
            "cross_claim_dependencies": cross_claim_deps,
        }

    reason_codes = []
    for ce in claim_evaluations:
        if ce["state"] != "UNKNOWN":
            continue
        claim_id = ce["claim_id"]
        if not ce["supporting_evidence_ids"] and any("No evidence" in r for r in ce["reasons"]):
            code = CLAIM_SPECIFIC_MISSING_REASON.get(claim_id, REASON_EVIDENCE_MISSING)
        elif any("independent lineage" in r for r in ce["reasons"]):
            code = REASON_INSUFFICIENT_INDEPENDENCE
        else:
            code = REASON_EVIDENCE_STALE
        if code not in reason_codes:
            reason_codes.append(code)

    return {
        "action_id": action_id,
        "disposition": "REVALIDATE",
        "claim_evaluations": claim_evaluations,
        "reason_codes": reason_codes,
        "cross_claim_dependencies": cross_claim_deps,
    }
