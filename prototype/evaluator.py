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


def _effective_independent_lineages(evidence_ids, evidence_by_id):
    """Union-find over evidence_ids. Two records merge into one
    effective lineage if one derives from the other or they share a
    failure domain.

    Fix for A-05, corrected on first attempt: an initial version merged
    every record with unresolvable ancestry into one shared bucket, but
    a single such record still formed its own distinct group and still
    counted toward independence - exactly the bug it was meant to
    close, just relocated. If a record declares a parent that is NOT
    among the evidence being evaluated, its ancestry cannot be verified
    at all, so it must contribute ZERO lineages on its own: a group
    counts as a legitimate independent lineage only if at least one of
    its members has fully resolved (or absent) ancestry. A group made
    entirely of unresolved-ancestry records - even several of them,
    even sharing no failure domain with anything - proves nothing and
    counts as nothing. This is the same "absence of disconfirming
    information silently read as confirmation" failure shape documented
    in docs/28 of the sibling real-life-gaming-platform repo's IoBT
    Reality-Failure Atlas - this evaluator reproduced that exact
    pattern itself (twice) before being hardened against it."""
    parent = {eid: eid for eid in evidence_ids}

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(a, b):
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[ra] = rb

    ids_set = set(evidence_ids)
    unresolved_ids = set()

    for eid in evidence_ids:
        for parent_id in evidence_by_id[eid].get("parent_evidence_ids", []):
            if parent_id in ids_set:
                union(eid, parent_id)
            else:
                unresolved_ids.add(eid)

    domain_to_ids = {}
    for eid in evidence_ids:
        for domain in evidence_by_id[eid].get("failure_domains", []):
            domain_to_ids.setdefault(domain, []).append(eid)
    for ids in domain_to_ids.values():
        for i in range(1, len(ids)):
            union(ids[0], ids[i])

    members_by_group = {}
    for eid in evidence_ids:
        members_by_group.setdefault(find(eid), []).append(eid)

    legitimate_groups = sum(
        1 for members in members_by_group.values()
        if any(m not in unresolved_ids for m in members)
    )
    return legitimate_groups


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
        claim_evaluations = [
            evaluate_claim(claim, [e for e in evidence_records if e["integrity_status"] != "FAILED"], decision_time)
            for claim in contract["claims"]
        ]
        return {
            "action_id": action_id,
            "disposition": "REFUSE",
            "claim_evaluations": claim_evaluations,
            "reason_codes": [REASON_INTEGRITY_FAILURE],
        }

    claim_evaluations = [
        evaluate_claim(claim, evidence_records, decision_time) for claim in contract["claims"]
    ]
    claim_by_id = {c["claim_id"]: c for c in contract["claims"]}

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
            }

    if all(ce["state"] == "CONFIRMED" for ce in claim_evaluations):
        return {
            "action_id": action_id,
            "disposition": "PERMIT",
            "claim_evaluations": claim_evaluations,
            "reason_codes": [REASON_ALL_CONFIRMED],
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
    }
