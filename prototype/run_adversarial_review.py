"""Adversarial falsifier checks for the first deterministic evaluator.

These checks intentionally document unsafe permissions or semantic gaps in
the current implementation. Exit 1 means at least one known vulnerability was
reproduced; it does not mean the runner malfunctioned.
"""

import copy
import json
import sys
from pathlib import Path

from evaluator import evaluate_action
from fixtures import DECISION_TIME, build_scenario_evidence


HERE = Path(__file__).parent


def load_contract():
    with open(HERE / "contracts" / "bridge-crossing.contract.json", encoding="utf-8") as f:
        return json.load(f)


def evaluate(evidence, *, decision_time=DECISION_TIME):
    return evaluate_action(load_contract(), evidence, decision_time, action_id="adversarial-review")


def claim_state(result, claim_id):
    return next(item["state"] for item in result["claim_evaluations"] if item["claim_id"] == claim_id)


def replace(evidence, evidence_id, **changes):
    result = copy.deepcopy(evidence)
    record = next(item for item in result if item["evidence_id"] == evidence_id)
    record.update(changes)
    return result


def main():
    baseline = build_scenario_evidence("S-01")
    checks = []

    # A value contradicting the claim is treated as support unless an upstream
    # producer supplies the optional stance label correctly.
    evidence = replace(baseline, "ev-c05-stop", value="stop_active")
    result = evaluate(evidence)
    checks.append((
        "A-01 contradictory value accepted as support",
        result["disposition"] == "PERMIT" and claim_state(result, "C-05") == "CONFIRMED",
        result,
    ))

    # Entity binding is carried in the record but never checked by the evaluator.
    evidence = replace(baseline, "ev-c02-cond", observed_entity_id="bridge-beta")
    result = evaluate(evidence)
    checks.append((
        "A-02 wrong-bridge evidence satisfies bridge-alpha claim",
        result["disposition"] == "PERMIT" and claim_state(result, "C-02") == "CONFIRMED",
        result,
    ))

    # Evidence from the future has negative age and passes the maximum-age test.
    evidence = replace(
        baseline,
        "ev-c03-path",
        observation_time="2026-09-04T12:10:00Z",
        received_time="2026-09-04T12:10:01Z",
        valid_until="2026-09-04T12:11:00Z",
    )
    result = evaluate(evidence)
    checks.append((
        "A-03 future observation is accepted at an earlier decision time",
        result["disposition"] == "PERMIT" and claim_state(result, "C-03") == "CONFIRMED",
        result,
    ))

    # Integrity failure is filtered out and becomes REVALIDATE, even though the
    # frozen disposition policy says integrity_failure = REFUSE.
    evidence = replace(baseline, "ev-c03-path", integrity_status="FAILED")
    result = evaluate(evidence)
    checks.append((
        "A-04 integrity failure does not enforce REFUSE policy",
        result["disposition"] != "REFUSE",
        result,
    ))

    # A derived record whose declared parent is outside the relevant evidence
    # set is counted as independent. The evaluator cannot traverse that parent.
    evidence = replace(
        baseline,
        "ev-c04-landmark",
        parent_evidence_ids=["upstream-gps-track-not-in-claim-set"],
        failure_domains=[],
    )
    result = evaluate(evidence)
    checks.append((
        "A-05 unavailable parent lineage is counted as independent",
        result["disposition"] == "PERMIT" and claim_state(result, "C-04") == "CONFIRMED",
        result,
    ))

    reproduced = 0
    for name, exposed, result in checks:
        status = "EXPOSED" if exposed else "NOT REPRODUCED"
        print(f"[{status}] {name}: {result['disposition']}")
        if exposed:
            reproduced += 1

    print(f"\nKnown vulnerabilities reproduced: {reproduced}/{len(checks)}")
    return 1 if reproduced else 0


if __name__ == "__main__":
    sys.exit(main())

