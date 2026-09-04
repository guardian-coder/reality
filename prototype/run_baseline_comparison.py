"""Compare the full gate with three controlled semantic ablations.

These are experiment baselines, not claims about every real implementation of
voting, confidence fusion, or provenance systems. All four paths reuse the
same hardened evaluator; each baseline removes only named capabilities.
"""

import copy
import json
from pathlib import Path

from evaluator import evaluate_action
from fixtures import DECISION_TIME, build_scenario_evidence


HERE = Path(__file__).parent


def load_json(path):
    with open(path, encoding="utf-8") as handle:
        return json.load(handle)


def simple_voting_inputs(contract, evidence):
    """Count admissible records, but ignore freshness and dependence."""
    contract = copy.deepcopy(contract)
    evidence = copy.deepcopy(evidence)
    for claim in contract["claims"]:
        claim["minimum_independent_lineages"] = max(
            rule["minimum_count"] for rule in claim["evidence_rules"]
        )
        for rule in claim["evidence_rules"] + claim.get("contradiction_rules", []):
            rule.pop("maximum_age_seconds", None)
    for record in evidence:
        record["parent_evidence_ids"] = []
        record["failure_domains"] = []
        # Voting has no expiry semantics in this controlled baseline.
        if record["valid_until"] < DECISION_TIME:
            record["valid_until"] = DECISION_TIME
    return contract, evidence


def confidence_only_inputs(contract, evidence):
    """Preserve admissibility/currentness, but treat records as independent."""
    contract = copy.deepcopy(contract)
    evidence = copy.deepcopy(evidence)
    for record in evidence:
        record["parent_evidence_ids"] = []
        record["failure_domains"] = []
    return contract, evidence


def provenance_only_inputs(contract, evidence):
    """Avoid counting derived records twice, but ignore common failure modes.

    Root observations remain distinct even when a fused child cites both. The
    derived child is removed from evidence counting because it is not a new
    observation. Shared physical/infrastructure failure domains are erased.
    """
    contract = copy.deepcopy(contract)
    evidence = [copy.deepcopy(record) for record in evidence if not record["parent_evidence_ids"]]
    for record in evidence:
        record["failure_domains"] = []
    return contract, evidence


SYSTEMS = {
    "simple_voting": simple_voting_inputs,
    "confidence_only": confidence_only_inputs,
    "provenance_only": provenance_only_inputs,
    "full_contract": lambda contract, evidence: (copy.deepcopy(contract), copy.deepcopy(evidence)),
}


def run():
    contract = load_json(HERE / "contracts" / "bridge-crossing.contract.json")
    suite = load_json(HERE / "scenarios" / "bridge-crossing.scenarios.json")
    results = {name: [] for name in SYSTEMS}

    for scenario in suite["scenarios"]:
        evidence = build_scenario_evidence(scenario["scenario_id"])
        for system_name, transform in SYSTEMS.items():
            transformed_contract, transformed_evidence = transform(contract, evidence)
            output = evaluate_action(
                transformed_contract,
                transformed_evidence,
                DECISION_TIME,
                action_id=f"{system_name}-{scenario['scenario_id']}",
            )
            expected = scenario["expected_disposition"]
            results[system_name].append({
                "scenario_id": scenario["scenario_id"],
                "expected": expected,
                "actual": output["disposition"],
                "match": output["disposition"] == expected,
            })

    print("Disposition comparison against seven frozen scenarios\n")
    print("system              matches   mismatches")
    print("------------------  --------  ----------------")
    for system_name, rows in results.items():
        failures = [row["scenario_id"] for row in rows if not row["match"]]
        matches = sum(row["match"] for row in rows)
        print(f"{system_name:18}  {matches}/7       {', '.join(failures) if failures else '-'}")

    print("\nSafety/availability error split")
    print("system              unsafe permits   false refusals")
    print("------------------  --------------   --------------")
    for system_name, rows in results.items():
        unsafe_permits = sum(row["actual"] == "PERMIT" and row["expected"] != "PERMIT" for row in rows)
        false_refusals = sum(row["actual"] != "PERMIT" and row["expected"] == "PERMIT" for row in rows)
        print(f"{system_name:18}  {unsafe_permits:<14}   {false_refusals}")

    print("\nPer-scenario dispositions")
    for index, scenario in enumerate(suite["scenarios"]):
        values = ", ".join(
            f"{name}={results[name][index]['actual']}" for name in SYSTEMS
        )
        print(f"{scenario['scenario_id']} expected={scenario['expected_disposition']}: {values}")

    return results


if __name__ == "__main__":
    run()
