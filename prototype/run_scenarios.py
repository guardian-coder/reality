"""
Runs the deterministic evaluator against all seven frozen bridge-crossing
scenarios and reports results honestly - including partial matches.
Does not modify the frozen contract or scenario file. Run directly:
python run_scenarios.py
"""

import json
import sys
from pathlib import Path

from evaluator import evaluate_action
from fixtures import DECISION_TIME, build_scenario_evidence

HERE = Path(__file__).parent


def load_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def run():
    contract = load_json(HERE / "contracts" / "bridge-crossing.contract.json")
    suite = load_json(HERE / "scenarios" / "bridge-crossing.scenarios.json")
    assert suite["decision_time"] == DECISION_TIME, "fixtures.DECISION_TIME must match the frozen suite"

    total = len(suite["scenarios"])
    fully_matched = 0
    mechanically_matched = 0  # claim states + disposition match; reason_codes may differ

    for scenario in suite["scenarios"]:
        sid = scenario["scenario_id"]
        evidence = build_scenario_evidence(sid)
        result = evaluate_action(contract, evidence, DECISION_TIME, action_id=f"eval-{sid}")

        actual_states = {ce["claim_id"]: ce["state"] for ce in result["claim_evaluations"]}
        expected_states = scenario["expected_claim_states"]
        states_match = all(actual_states.get(cid) == state for cid, state in expected_states.items())

        disposition_match = result["disposition"] == scenario["expected_disposition"]

        lineage_ok = True
        if "expected_effective_independent_lineages" in scenario:
            actual_lineages = {ce["claim_id"]: ce["effective_independent_lineages"] for ce in result["claim_evaluations"]}
            for cid, expected_n in scenario["expected_effective_independent_lineages"].items():
                if actual_lineages.get(cid) != expected_n:
                    lineage_ok = False

        reason_match = set(result["reason_codes"]) == set(scenario["expected_reason_codes"])

        mechanical_ok = states_match and disposition_match and lineage_ok
        full_ok = mechanical_ok and reason_match

        if mechanical_ok:
            mechanically_matched += 1
        if full_ok:
            fully_matched += 1

        status = "FULL MATCH" if full_ok else ("MECHANICAL MATCH, REASON CODE DIFFERS" if mechanical_ok else "MISMATCH")
        print(f"[{sid}] {scenario['name']}: {status}")
        print(f"    expected: disposition={scenario['expected_disposition']} states={expected_states} "
              f"reasons={scenario['expected_reason_codes']}")
        print(f"    actual:   disposition={result['disposition']} states={actual_states} "
              f"reasons={result['reason_codes']}")
        if not mechanical_ok:
            for ce in result["claim_evaluations"]:
                if expected_states.get(ce["claim_id"]) and expected_states[ce["claim_id"]] != ce["state"]:
                    print(f"    -> {ce['claim_id']} reasons: {ce['reasons']}")
        print()

    print(f"Mechanical match (claim states + disposition + lineages): {mechanically_matched}/{total}")
    print(f"Full match (including exact reason_codes): {fully_matched}/{total}")
    return mechanically_matched, fully_matched, total


if __name__ == "__main__":
    mechanically_matched, fully_matched, total = run()
    sys.exit(0 if mechanically_matched == total else 1)
