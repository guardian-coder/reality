"""Forcing cases for typed failure relevance and cross-claim gating."""
import copy
import json
from pathlib import Path
from evaluator import evaluate_action
from fixtures import DECISION_TIME, build_scenario_evidence

HERE = Path(__file__).parent

def load_contract():
    with open(HERE / "contracts" / "bridge-crossing.contract.json", encoding="utf-8") as handle:
        return json.load(handle)

def record(evidence, evidence_id):
    return next(item for item in evidence if item["evidence_id"] == evidence_id)

def run_case(case_id, evidence):
    return evaluate_action(load_contract(), evidence, DECISION_TIME, action_id=case_id)

def main():
    cases = []

    evidence = copy.deepcopy(build_scenario_evidence("S-01"))
    record(evidence,"ev-c04-gps")["failure_domains"] = ["shared-power-bus-availability-only"]
    record(evidence,"ev-c04-landmark")["failure_domains"] = ["shared-power-bus-availability-only"]
    result = run_case("T-01", evidence)
    cases.append(("T-01 irrelevant shared domain", "PERMIT", result["disposition"], "GAP" if result["disposition"] != "PERMIT" else "PASS"))

    evidence = copy.deepcopy(build_scenario_evidence("S-01"))
    record(evidence,"ev-c04-gps")["failure_domains"] = ["shared-georegistration-position-bias"]
    record(evidence,"ev-c04-landmark")["failure_domains"] = ["shared-georegistration-position-bias"]
    result = run_case("T-02", evidence)
    cases.append(("T-02 relevant shared domain", "REVALIDATE", result["disposition"], "PASS" if result["disposition"] == "REVALIDATE" else "GAP"))

    evidence = copy.deepcopy(build_scenario_evidence("S-01"))
    result = run_case("X-01", evidence)
    visible = any(item["failure_domain"] == "onboard-camera-01" and {"C-02","C-03"}.issubset(set(item["claim_ids"])) for item in result.get("cross_claim_dependencies",[]))
    actual = f"{result['disposition']}+{'VISIBLE' if visible else 'HIDDEN'}"
    cases.append(("X-01 informational cross-claim dependency", "PERMIT+VISIBLE", actual, "PASS" if actual == "PERMIT+VISIBLE" else "GAP"))

    evidence = copy.deepcopy(build_scenario_evidence("S-01"))
    record(evidence,"ev-c01-cue")["failure_domains"] = ["shared-georegistration-binding-bias"]
    record(evidence,"ev-c04-landmark")["failure_domains"] = ["shared-georegistration-binding-bias"]
    result = run_case("X-02", evidence)
    cases.append(("X-02 blocking identity-position dependency", "REVALIDATE", result["disposition"], "GAP" if result["disposition"] == "PERMIT" else "PASS"))

    for name, expected, actual, status in cases:
        print(f"[{status}] {name}: expected={expected} actual={actual}")
    print(f"\nForcing gaps exposed: {sum(status == 'GAP' for *_, status in cases)}/{len(cases)}")
    print("T-01 and X-02 require new contract semantics; they are not frozen-contract regressions.")

if __name__ == "__main__":
    main()
