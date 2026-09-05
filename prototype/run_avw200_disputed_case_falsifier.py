"""Mechanical test of the disputed AVW200 case from
validation/2026-09-05_INDEPENDENT_REVIEWER_COMPARISON.md.

That document inferred, but did not mechanically test, that encoding
Reviewer A's joint-claim rules (no AVW200-sharing rule) vs. Reviewer B's
(includes one) against identical evidence would produce different action
dispositions. This script builds a minimal, standalone contract modeling
the real disputed structure -- two shafts' load claims, each independently
confirmed by their own vibrating-wire (VW) gauge evidence, whose evidence
roots share a failure domain representing the AVW200 spectrum analyzer
that (per the source document, and per both Reviewer A's and Reviewer B's
independently-produced dependency lists) aggregates two MUXes' worth of
channels upstream of the logger -- and runs both rulesets through the real,
unmodified evaluator.

Does not touch evaluator.py, the frozen bridge-crossing contract, or the
frozen bridge-crossing scenarios. This is a new, separate contract for a
new, separate (real-system-derived) scenario, not a change to those.
"""
import copy
import json
from pathlib import Path

from evaluator import evaluate_action

DECISION_TIME = "2026-01-21T12:00:00Z"

BASE_CLAIMS = [
    {
        "claim_id": "C-S1-LOAD",
        "statement": "Shaft 1's load/strain state is confirmed within expected bounds.",
        "required_state": "CONFIRMED",
        "subject_entity_id": "shaft-1",
        "assessed_property": "load_magnitude",
        "evidence_rules": [
            {"evidence_type": "VW_STRAIN_READING", "minimum_count": 1,
             "maximum_age_seconds": 3600, "required_integrity_status": "VERIFIED"}
        ],
        "minimum_independent_lineages": 1,
        "contradiction_policy": "REFUSE",
    },
    {
        "claim_id": "C-S2-LOAD",
        "statement": "Shaft 2's load/strain state is confirmed within expected bounds.",
        "required_state": "CONFIRMED",
        "subject_entity_id": "shaft-2",
        "assessed_property": "load_magnitude",
        "evidence_rules": [
            {"evidence_type": "VW_STRAIN_READING", "minimum_count": 1,
             "maximum_age_seconds": 3600, "required_integrity_status": "VERIFIED"}
        ],
        "minimum_independent_lineages": 1,
        "contradiction_policy": "REFUSE",
    },
]

# Real structure per both reviewers: MUX2 (shaft 1) and MUX1 (shaft 2) are
# two distinct multiplexers, each with its own wiring -- but (per both
# reviewers, independently, and now Reviewer C too) both feed into the same
# AVW200 spectrum analyzer before reaching the logger.
EVIDENCE = [
    {
        "evidence_id": "ev-s1-vw", "source_id": "vw-gauge-shaft1-gl2",
        "observed_entity_id": "shaft-1",
        "observation_time": "2026-01-21T11:55:00Z", "received_time": "2026-01-21T11:55:05Z",
        "valid_until": "2026-01-21T13:00:00Z",
        "claim_ids": ["C-S1-LOAD"], "evidence_type": "VW_STRAIN_READING",
        "value": {"microstrain": 210}, "uncertainty": 0.02,
        "parent_evidence_ids": [],
        "failure_domains": [
            {"id": "mux2-wiring", "affected_properties": ["load_magnitude"], "failure_effect": "COMMON_BIAS"},
            {"id": "avw200-1", "affected_properties": ["load_magnitude"], "failure_effect": "COMMON_BIAS"},
        ],
        "integrity_status": "VERIFIED",
    },
    {
        "evidence_id": "ev-s2-vw", "source_id": "vw-gauge-shaft2-gl2",
        "observed_entity_id": "shaft-2",
        "observation_time": "2026-01-21T11:55:00Z", "received_time": "2026-01-21T11:55:05Z",
        "valid_until": "2026-01-21T13:00:00Z",
        "claim_ids": ["C-S2-LOAD"], "evidence_type": "VW_STRAIN_READING",
        "value": {"microstrain": 195}, "uncertainty": 0.02,
        "parent_evidence_ids": [],
        "failure_domains": [
            {"id": "mux1-wiring", "affected_properties": ["load_magnitude"], "failure_effect": "COMMON_BIAS"},
            {"id": "avw200-1", "affected_properties": ["load_magnitude"], "failure_effect": "COMMON_BIAS"},
        ],
        "integrity_status": "VERIFIED",
    },
]


def contract_a_style():
    """Reviewer A's ruleset as actually written: MUX-level (rule 2) and
    calibration-reference (rule 1) joint rules exist, but no rule names
    {C-S1-LOAD, C-S2-LOAD} as sharing a blocking dependency -- because A's
    findings named the AVW200 dependency (§2b) but that fact did not
    survive into A's own §5. We encode that exact absence: no joint rule
    with claim_ids covering this shaft-1/shaft-2 pair exists."""
    return {"claims": BASE_CLAIMS, "joint_claim_rules": []}


def contract_b_style():
    """Reviewer B's ruleset, and independently Reviewer C's Rule 2 (derived
    blind from A's findings alone, without seeing A's or B's actual rules):
    both explicitly cover the AVW200-shared MUX pair."""
    return {
        "claims": BASE_CLAIMS,
        "joint_claim_rules": [
            {"claim_ids": ["C-S1-LOAD", "C-S2-LOAD"],
             "forbidden_shared_effects": ["COMMON_BIAS"],
             "on_violation": "REVALIDATE"}
        ],
    }


def main():
    result_a = evaluate_action(contract_a_style(), EVIDENCE, DECISION_TIME, action_id="avw200-case-A-style")
    result_b = evaluate_action(contract_b_style(), EVIDENCE, DECISION_TIME, action_id="avw200-case-B-style")

    print("Same evidence, same underlying real-system structure (shaft-1 and shaft-2 VW")
    print("gauges sharing one AVW200 domain), two rulesets:\n")
    print(f"  A-style ruleset (no AVW200 joint rule, matching A's actual §5) -> {result_a['disposition']}")
    print(f"    reason_codes: {result_a['reason_codes']}")
    print(f"  B/C-style ruleset (AVW200 joint rule present)                  -> {result_b['disposition']}")
    print(f"    reason_codes: {result_b['reason_codes']}")

    different = result_a["disposition"] != result_b["disposition"]
    print(f"\nAction dispositions differ: {different}")
    if different:
        print("This confirms that the omitted rule changes output under the test's")
        print("hypothetical COMMON_BIAS model. FHWA does not establish that failure effect,")
        print("so this is not evidence of a real unsafe bridge decision.")
    else:
        print("UNEXPECTED: the two rulesets produced the same disposition. The claimed")
        print("action-difference does not hold for this encoding as constructed; investigate")
        print("before citing it as confirmed.")

    print("\ncross_claim_dependencies (A-style run):")
    print(json.dumps(result_a["cross_claim_dependencies"], indent=2))

    availability_evidence = copy.deepcopy(EVIDENCE)
    for item in availability_evidence:
        for domain in item["failure_domains"]:
            if domain["id"] == "avw200-1":
                domain["affected_properties"] = ["availability"]
                domain["failure_effect"] = "UNAVAILABLE"
    result_a_availability = evaluate_action(
        contract_a_style(), availability_evidence, DECISION_TIME,
        action_id="avw200-availability-A-style")
    result_b_availability = evaluate_action(
        contract_b_style(), availability_evidence, DECISION_TIME,
        action_id="avw200-availability-B-style")
    print("\nAvailability-only contrast (closer to the documented incident):")
    print(f"  A-style -> {result_a_availability['disposition']}")
    print(f"  B/C-style -> {result_b_availability['disposition']}")
    print("  The COMMON_BIAS-only joint rule does not separate these runs.")


if __name__ == "__main__":
    main()
