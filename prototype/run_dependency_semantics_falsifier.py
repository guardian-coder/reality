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
    availability_domain = {"id": "shared-power-bus", "affected_properties": ["availability"], "failure_effect": "UNAVAILABLE"}
    record(evidence,"ev-c04-gps")["failure_domains"] = [availability_domain]
    record(evidence,"ev-c04-landmark")["failure_domains"] = [availability_domain]
    result = run_case("T-01", evidence)
    cases.append(("T-01 irrelevant shared domain", "PERMIT", result["disposition"], "GAP" if result["disposition"] != "PERMIT" else "PASS"))

    evidence = copy.deepcopy(build_scenario_evidence("S-01"))
    position_domain = {"id": "shared-georegistration", "affected_properties": ["position_accuracy"], "failure_effect": "COMMON_BIAS"}
    record(evidence,"ev-c04-gps")["failure_domains"] = [position_domain]
    record(evidence,"ev-c04-landmark")["failure_domains"] = [position_domain]
    result = run_case("T-02", evidence)
    cases.append(("T-02 relevant shared domain", "REVALIDATE", result["disposition"], "PASS" if result["disposition"] == "REVALIDATE" else "GAP"))

    evidence = copy.deepcopy(build_scenario_evidence("S-01"))
    result = run_case("X-01", evidence)
    visible = any(item["failure_domain"] == "onboard-camera-01" and {"C-02","C-03"}.issubset(set(item["claim_ids"])) for item in result.get("cross_claim_dependencies",[]))
    actual = f"{result['disposition']}+{'VISIBLE' if visible else 'HIDDEN'}"
    cases.append(("X-01 informational cross-claim dependency", "PERMIT+VISIBLE", actual, "PASS" if actual == "PERMIT+VISIBLE" else "GAP"))

    evidence = copy.deepcopy(build_scenario_evidence("S-01"))
    binding_domain = {"id": "shared-georegistration-binding", "affected_properties": ["identity_binding", "position_accuracy"], "failure_effect": "COMMON_BIAS"}
    record(evidence,"ev-c01-cue")["failure_domains"] = [binding_domain]
    record(evidence,"ev-c04-landmark")["failure_domains"] = [binding_domain]
    contract = load_contract()
    contract["joint_claim_rules"] = [{"claim_ids": ["C-01", "C-04"], "forbidden_shared_effects": ["COMMON_BIAS"], "on_violation": "REVALIDATE"}]
    result = evaluate_action(contract, evidence, DECISION_TIME, action_id="X-02")
    cases.append(("X-02 blocking identity-position dependency", "REVALIDATE", result["disposition"], "GAP" if result["disposition"] == "PERMIT" else "PASS"))

    evidence = copy.deepcopy(evidence)
    alarm = copy.deepcopy(record(evidence, "ev-c02-cond"))
    alarm.update({"evidence_id": "ev-c02-alarm-joint", "evidence_type": "STRUCTURAL_ALARM", "value": "critical", "stance": "CONTRADICTS"})
    evidence.append(alarm)
    result = evaluate_action(contract, evidence, DECISION_TIME, action_id="X-03")
    cases.append(("X-03 contradiction outranks joint revalidation", "REFUSE", result["disposition"], "PASS" if result["disposition"] == "REFUSE" else "GAP"))

    for name, expected, actual, status in cases:
        print(f"[{status}] {name}: expected={expected} actual={actual}")
    print(f"\nForcing gaps exposed: {sum(status == 'GAP' for *_, status in cases)}/{len(cases)}")
    print("T-01 and X-02 require new contract semantics; X-03 fixes their precedence.")

if __name__ == "__main__":
    main()
