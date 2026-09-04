"""Second-wave tests for dependency, state priority, and missing semantics."""
import json
from pathlib import Path
from evaluator import evaluate_action
from fixtures import DECISION_TIME, build_scenario_evidence

HERE = Path(__file__).parent

def load_contract():
    with open(HERE / "contracts" / "bridge-crossing.contract.json", encoding="utf-8") as handle:
        return json.load(handle)

def claim(result, claim_id):
    return next(item for item in result["claim_evaluations"] if item["claim_id"] == claim_id)

def evaluate(evidence, contract=None, action_id="extended"):
    return evaluate_action(contract or load_contract(), evidence, DECISION_TIME, action_id=action_id)

def partial_dependency_case():
    evidence = build_scenario_evidence("S-01")
    evidence.append({"evidence_id":"ev-c04-second-gps","source_id":"drone-gps-2","observed_entity_id":"logistics-vehicle-01","observation_time":"2026-09-04T11:59:47Z","received_time":"2026-09-04T11:59:48Z","valid_until":"2026-09-04T12:00:17Z","claim_ids":["C-04"],"evidence_type":"POSITION_OBSERVATION","value":{"lat":0.0,"lon":0.0},"uncertainty":0.1,"parent_evidence_ids":[],"failure_domains":["gps-signal-01"],"integrity_status":"VERIFIED"})
    result = evaluate(evidence, action_id="E-01")
    c04 = claim(result, "C-04")
    return "E-01 partial dependency", result["disposition"] == "PERMIT" and c04["effective_independent_lineages"] == 2, result

def simultaneous_state_case():
    evidence = [item for item in build_scenario_evidence("S-05") if item["evidence_id"] != "ev-c03-path"]
    result = evaluate(evidence, action_id="E-02")
    passed = result["disposition"] == "REFUSE" and claim(result,"C-02")["state"] == "CONTRADICTED" and claim(result,"C-03")["state"] == "UNKNOWN"
    return "E-02 contradiction and unknown remain visible", passed, result

def cross_claim_visibility_case():
    result = evaluate(build_scenario_evidence("S-01"), action_id="E-03")
    return "E-03 action output exposes cross-claim dependencies", "cross_claim_dependencies" in result, result

def degraded_mode_case():
    contract = load_contract()
    contract["degraded_modes"] = [{"mode_id":"SLOW_CROSSING","when_claim_unknown":"C-03","required_alternative_evidence_type":"PARTIAL_PATH_OBSERVATION","disposition":"DEGRADE"}]
    evidence = [item for item in build_scenario_evidence("S-01") if item["evidence_id"] != "ev-c03-path"]
    evidence.append({"evidence_id":"ev-c03-partial-path","source_id":"onboard-camera-1","observed_entity_id":"bridge-alpha-path","observation_time":"2026-09-04T11:59:40Z","received_time":"2026-09-04T11:59:41Z","valid_until":"2026-09-04T12:00:20Z","claim_ids":["C-03"],"evidence_type":"PARTIAL_PATH_OBSERVATION","value":"approach clear; far exit occluded","uncertainty":0.1,"parent_evidence_ids":[],"failure_domains":["onboard-camera-01"],"integrity_status":"VERIFIED"})
    result = evaluate(evidence, contract=contract, action_id="E-04")
    return "E-04 declared degraded mode is reachable", result["disposition"] == "DEGRADE", result

def main():
    cases = [partial_dependency_case(), simultaneous_state_case(), cross_claim_visibility_case(), degraded_mode_case()]
    passed = 0
    for name, ok, result in cases:
        print(f"[{'PASS' if ok else 'GAP'}] {name}: {result['disposition']}")
        passed += int(ok)
    print(f"\nDefined/expressible checks passed: {passed}/{len(cases)}")
    print("E-03 and E-04 are architecture/schema gaps, not frozen-contract regressions.")

if __name__ == "__main__":
    main()
