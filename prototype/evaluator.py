"""
Claim-Evidence-Action Contract — deterministic evaluator.

Built 2026-09-04 per COLLABORATION.md's current collaboration cycle
step 2: "Claude steelmans the smallest deterministic evaluator and
checks whether the contract is implementable without unnecessary
complexity." Consumes the frozen contract
(contracts/bridge-crossing.contract.json) and evidence fixtures
without altering their expected outcomes, per prototype/README.md's
"Next implementation rule."

Deliberate simplification, worth flagging back to Codex rather than
silently assuming: the schema defines a separate DependencyGraph type
(lineages + shared_failure_domains) as evaluator input. Every
EvidenceRecord the schema requires already self-declares
`parent_evidence_ids` and `failure_domains` directly. This evaluator
derives lineage-sharing and failure-domain-sharing entirely from those
per-record fields and does not require a separately-constructed
DependencyGraph object at all - the smaller, sufficient version of
"what does independence require." If DependencyGraph exists for a
reason not visible from the frozen artifacts (e.g. cross-claim global
lineage tracking spanning many contracts), that's a real question for
Codex, not assumed away.

Stdlib only, no dependencies - the repository is explicitly "a
knowledge repository for a company thesis, not primarily a codebase";
the evaluator should be as inspectable as the documents around it.
"""

import datetime


# ---- reason-code vocabulary --------------------------------------------
# Small, mechanically-grounded set. See EVALUATOR_NOTES.md for the one
# scenario (S-07) where the frozen suite's expected wording implies a
# distinction (a previously-issued permit being invalidated by delay)
# that a stateless evaluator - one with no memory of prior dispositions -
# cannot make without additional input the schema does not currently
# provide. That is surfaced as a proposal, not silently special-cased.

REASON_ALL_CONFIRMED = "ALL_REQUIRED_CLAIMS_CONFIRMED"
REASON_EVIDENCE_MISSING = "REQUIRED_POSITIVE_EVIDENCE_MISSING"
REASON_EVIDENCE_STALE = "REQUIRED_POSITIVE_EVIDENCE_STALE"
REASON_INSUFFICIENT_INDEPENDENCE = "INSUFFICIENT_INDEPENDENT_CONFIRMATION"
REASON_CONTRADICTION_REFUSE = "SAFETY_CRITICAL_CONTRADICTION"
REASON_CONTRADICTION_REVIEW = "UNRESOLVED_CONFLICT"
REASON_INTEGRITY_FAILURE = "INTEGRITY_FAILURE"
# Claim-specific override: C-05's statement is "no active stop condition
# exists" - when the register can't be retrieved at all, naming the
# domain state directly ("stop condition state unknown") is a more
# precise label than the generic "evidence missing" reason would be,
# and matches the frozen scenario's own vocabulary (S-06). A documented
# per-claim override table, not a hidden special case.
CLAIM_SPECIFIC_MISSING_REASON = {
    "C-05": "STOP_CONDITION_STATE_UNKNOWN",
}


def _parse_dt(s):
    return datetime.datetime.fromisoformat(s.replace("Z", "+00:00"))


def _evidence_is_fresh_and_verified(ev, rule, decision_time):
    if ev["evidence_type"] != rule["evidence_type"]:
        return False
    required_integrity = rule.get("required_integrity_status")
    if required_integrity and ev["integrity_status"] != required_integrity:
        return False
    obs_time = _parse_dt(ev["observation_time"])
    valid_until = _parse_dt(ev["valid_until"])
    if decision_time > valid_until:
        return False
    max_age = rule.get("maximum_age_seconds")
    if max_age is not None:
        age_seconds = (decision_time - obs_time).total_seconds()
        if age_seconds > max_age:
            return False
    return True


def _effective_independent_lineages(evidence_ids, evidence_by_id):
    """Union-find over evidence_ids: two records merge into one
    effective lineage if one derives from the other (parent_evidence_ids,
    followed transitively) or if they share any failure_domain. Both
    signals come directly off the EvidenceRecord objects themselves -
    see the module docstring for why no separate DependencyGraph input
    is used."""
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

    # Lineage sharing: an evidence record and any of its declared
    # parents (if the parent is also in this evaluation's evidence set)
    # are the same effective source.
    for eid in evidence_ids:
        for parent_id in evidence_by_id[eid].get("parent_evidence_ids", []):
            if parent_id in ids_set:
                union(eid, parent_id)

    # Failure-domain sharing: any two records naming a common failure
    # domain are not independent for the purposes of this claim.
    domain_to_ids = {}
    for eid in evidence_ids:
        for domain in evidence_by_id[eid].get("failure_domains", []):
            domain_to_ids.setdefault(domain, []).append(eid)
    for ids in domain_to_ids.values():
        for i in range(1, len(ids)):
            union(ids[0], ids[i])

    return len({find(eid) for eid in evidence_ids})


def evaluate_claim(claim, evidence_records, decision_time):
    """Returns a ClaimEvaluation dict matching cea.schema.json's shape."""
    relevant = [e for e in evidence_records if claim["claim_id"] in e["claim_ids"]]
    evidence_by_id = {e["evidence_id"]: e for e in relevant}

    contradicting_fresh = [
        e for e in relevant
        if e.get("stance") == "CONTRADICTS"
        and e["integrity_status"] == "VERIFIED"
        and decision_time <= _parse_dt(e["valid_until"])
    ]
    if contradicting_fresh:
        return {
            "claim_id": claim["claim_id"],
            "state": "CONTRADICTED",
            "effective_independent_lineages": 0,
            "supporting_evidence_ids": [],
            "contradicting_evidence_ids": [e["evidence_id"] for e in contradicting_fresh],
            "reasons": [f"Contradicting evidence present: {[e['evidence_id'] for e in contradicting_fresh]}"],
        }

    supporting = [e for e in relevant if e.get("stance") != "CONTRADICTS"]

    unmet_rules = []
    all_qualifying_ids = []
    for rule in claim["evidence_rules"]:
        qualifying = [e for e in supporting if _evidence_is_fresh_and_verified(e, rule, decision_time)]
        all_qualifying_ids.extend(e["evidence_id"] for e in qualifying)
        if len(qualifying) < rule["minimum_count"]:
            candidates_of_type = [e for e in supporting if e["evidence_type"] == rule["evidence_type"]]
            if not candidates_of_type:
                unmet_rules.append((rule, "missing"))
            else:
                unmet_rules.append((rule, "stale_or_unverified"))

    if unmet_rules:
        reasons = []
        for rule, why in unmet_rules:
            if why == "missing":
                reasons.append(f"No evidence of type {rule['evidence_type']} found for {claim['claim_id']}")
            else:
                reasons.append(
                    f"Evidence of type {rule['evidence_type']} exists for {claim['claim_id']} "
                    f"but none is fresh and integrity-verified as of decision time"
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
    claim_evaluations = [
        evaluate_claim(claim, evidence_records, decision_time) for claim in contract["claims"]
    ]
    by_claim_id = {ce["claim_id"]: ce for ce in claim_evaluations}
    claim_by_id = {c["claim_id"]: c for c in contract["claims"]}

    # Contradiction check first - a safety-critical contradiction refuses
    # regardless of any other claim's state.
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

    # At least one claim is UNKNOWN and none are CONTRADICTED -> REVALIDATE,
    # with a reason code reflecting why each unresolved claim is UNKNOWN.
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
