"""Falsifier for dependency-metadata trust.

Written per validation/2026-09-05_TYPED_DEPENDENCY_AND_JOINT_RULE_RESULTS.md's
"Discriminating test": construct cases where failure-domain metadata is
missing or false while the evidence values themselves look valid, compare
fail-open, fail-closed, and authenticated-metadata policies on false
permissions and false refusals, and test whether the required metadata and a
joint rule can be authored by a domain expert without changing evaluator
code.

Does not modify evaluator.py, the frozen contract, or the frozen scenarios.
The two alternate policies (fail-closed-on-missing, authenticated-only) are
implemented here as evidence-level preprocessing, run against the unmodified
evaluate_action, so this stays black-box against the real evaluator rather
than patching its internals.
"""
import copy
import json
from pathlib import Path

from evaluator import evaluate_action
from fixtures import DECISION_TIME, build_scenario_evidence

HERE = Path(__file__).parent
UNDECLARED = "UNDECLARED-DEPENDENCY"


def load_contract():
    with open(HERE / "contracts" / "bridge-crossing.contract.json", encoding="utf-8") as handle:
        return json.load(handle)


def record(evidence, evidence_id):
    return next(item for item in evidence if item["evidence_id"] == evidence_id)


def run_case(case_id, evidence, contract=None):
    return evaluate_action(contract or load_contract(), evidence, DECISION_TIME, action_id=case_id)


# ---- alternate policies, applied to evidence before the real evaluator runs ----

def fail_open(evidence):
    """Today's implicit policy: a missing `failure_domains` key means the
    record contributes no dependency information at all."""
    return copy.deepcopy(evidence)


def fail_closed_missing(evidence):
    """A root record with no `failure_domains` key is folded into one
    shared `UNDECLARED-DEPENDENCY` bucket per claim, instead of being
    treated as dependency-free."""
    ev = copy.deepcopy(evidence)
    for e in ev:
        if "failure_domains" not in e:
            e["failure_domains"] = [UNDECLARED]
    return ev


def verified_marker_only(evidence):
    """A typed failure-domain entry is trusted at face value (including a
    legitimate UNAVAILABLE downgrade) only if it carries
    `metadata_integrity_status: VERIFIED` -- a field that does not exist in
    today's schema; this simulates what adding one would buy. Legacy string
    domains pass through unchanged since they are already universally
    relevant. Any record whose typed domains are unattested, or which
    declares no domains at all, also gets the UNDECLARED-DEPENDENCY
    sentinel, so it still fails closed rather than fails open."""
    ev = copy.deepcopy(evidence)
    for e in ev:
        domains = e.get("failure_domains", [])
        kept = []
        untrusted_or_missing = not domains
        for d in domains:
            if isinstance(d, str):
                kept.append(d)
            elif d.get("metadata_integrity_status") == "VERIFIED":
                kept.append(d)
            else:
                untrusted_or_missing = True
        if untrusted_or_missing:
            kept.append(UNDECLARED)
        e["failure_domains"] = kept
    return ev


POLICIES = [("fail-open (current)", fail_open),
            ("fail-closed-missing", fail_closed_missing),
            ("verified-marker-only", verified_marker_only)]


def main():
    cases = []

    # M-01: missing failure_domains key on one of two genuinely-shared root
    # records. Honest metadata (both declare the same domain) forces
    # REVALIDATE; dropping the key on just one root hides the correlation
    # from the evaluator entirely.
    evidence = copy.deepcopy(build_scenario_evidence("S-01"))
    shared = {"id": "shared-chipset-bug", "affected_properties": ["position_accuracy"], "failure_effect": "COMMON_BIAS"}
    record(evidence, "ev-c04-gps")["failure_domains"] = [shared]
    del record(evidence, "ev-c04-landmark")["failure_domains"]
    m01_evidence = evidence
    result = run_case("M-01", fail_open(m01_evidence))
    cases.append(("M-01 missing failure_domains key hides real shared dependency",
                   "REVALIDATE (if declared)", result["disposition"],
                   "GAP" if result["disposition"] == "PERMIT" else "PASS"))

    # M-02: both roots declare the shared domain, but affected_properties is
    # mislabeled to exclude the property it actually threatens.
    evidence = copy.deepcopy(build_scenario_evidence("S-01"))
    mislabeled = {"id": "shared-chipset-bug", "affected_properties": ["identity_binding"], "failure_effect": "COMMON_BIAS"}
    record(evidence, "ev-c04-gps")["failure_domains"] = [mislabeled]
    record(evidence, "ev-c04-landmark")["failure_domains"] = [mislabeled]
    result = run_case("M-02", evidence)
    cases.append(("M-02 false affected_properties hides real shared dependency",
                   "REVALIDATE (if honestly scoped)", result["disposition"],
                   "GAP" if result["disposition"] == "PERMIT" else "PASS"))

    # M-03: both roots declare the shared domain with the correct property,
    # but failure_effect is mislabeled UNAVAILABLE -- the one effect the
    # evaluator already treats as non-correlating -- instead of the true
    # COMMON_BIAS.
    evidence = copy.deepcopy(build_scenario_evidence("S-01"))
    mislabeled_effect = {"id": "shared-chipset-bug", "affected_properties": ["position_accuracy"], "failure_effect": "UNAVAILABLE"}
    record(evidence, "ev-c04-gps")["failure_domains"] = [mislabeled_effect]
    record(evidence, "ev-c04-landmark")["failure_domains"] = [mislabeled_effect]
    result = run_case("M-03", evidence)
    cases.append(("M-03 false failure_effect (COMMON_BIAS mislabeled UNAVAILABLE)",
                   "REVALIDATE (if honestly labeled)", result["disposition"],
                   "GAP" if result["disposition"] == "PERMIT" else "PASS"))

    # M-04: the mirror-image attack. A fabricated shared domain injected
    # onto two genuinely independent roots forces an unwarranted
    # REVALIDATE -- an operational denial -- on an action that should be
    # confirmable. Missing authentication cuts both ways.
    evidence = copy.deepcopy(build_scenario_evidence("S-01"))
    fabricated = {"id": "phantom-shared-source", "affected_properties": ["position_accuracy"], "failure_effect": "COMMON_BIAS"}
    record(evidence, "ev-c04-gps")["failure_domains"] = [fabricated]
    record(evidence, "ev-c04-landmark")["failure_domains"] = [fabricated]
    result = run_case("M-04", evidence)
    cases.append(("M-04 fabricated shared domain forces false denial",
                   "PERMIT (genuinely independent)", result["disposition"],
                   "GAP" if result["disposition"] != "PERMIT" else "PASS"))

    # M-05: the same missing-metadata vector defeats a joint_claim_rule, not
    # just single-claim independence counting (built on the existing X-02
    # falsifier's setup).
    evidence = copy.deepcopy(build_scenario_evidence("S-01"))
    binding_domain = {"id": "shared-georegistration-binding",
                       "affected_properties": ["identity_binding", "position_accuracy"],
                       "failure_effect": "COMMON_BIAS"}
    record(evidence, "ev-c01-cue")["failure_domains"] = [binding_domain]
    del record(evidence, "ev-c04-landmark")["failure_domains"]
    contract = load_contract()
    contract["joint_claim_rules"] = [{"claim_ids": ["C-01", "C-04"], "forbidden_shared_effects": ["COMMON_BIAS"], "on_violation": "REVALIDATE"}]
    result = run_case("M-05", evidence, contract)
    cases.append(("M-05 missing metadata defeats joint_claim_rule (cf. X-02)",
                   "REVALIDATE (if declared)", result["disposition"],
                   "GAP" if result["disposition"] == "PERMIT" else "PASS"))

    # M-06: domain-expert authorability. A plausible new failure_effect a
    # non-programmer domain expert might invent -- "LATENCY_ONLY", meaning
    # "this shared dependency can delay both records but never bias their
    # values" -- expresses the same underlying intent as the one effect the
    # evaluator already special-cases (UNAVAILABLE). Test whether that
    # intent survives through contract/evidence JSON alone.
    evidence = copy.deepcopy(build_scenario_evidence("S-01"))
    latency_only = {"id": "shared-relay-link", "affected_properties": ["position_accuracy"], "failure_effect": "LATENCY_ONLY"}
    record(evidence, "ev-c04-gps")["failure_domains"] = [latency_only]
    record(evidence, "ev-c04-landmark")["failure_domains"] = [latency_only]
    result = run_case("M-06", evidence)
    cases.append(("M-06 domain expert invents new non-correlating effect name",
                   "PERMIT (expert's own stated intent)", result["disposition"],
                   "GAP" if result["disposition"] != "PERMIT" else "PASS"))

    # M-07: the illustrative marker is not authentication. A dishonest
    # producer can attach VERIFIED to false-but-schema-shaped metadata, and
    # the preprocessing policy has no cryptographic identity or authority
    # registry with which to reject it.
    evidence = copy.deepcopy(build_scenario_evidence("S-01"))
    forged = {"id": "shared-chipset-bug", "affected_properties": ["identity_binding"],
              "failure_effect": "COMMON_BIAS", "metadata_integrity_status": "VERIFIED"}
    record(evidence, "ev-c04-gps")["failure_domains"] = [forged]
    record(evidence, "ev-c04-landmark")["failure_domains"] = [forged]
    result = run_case("M-07", verified_marker_only(evidence))
    cases.append(("M-07 forged VERIFIED marker blesses false metadata",
                   "REVALIDATE (if metadata were authentic)", result["disposition"],
                   "GAP" if result["disposition"] == "PERMIT" else "PASS"))

    for name, expected, actual, status in cases:
        print(f"[{status}] {name}: expected={expected} actual={actual}")
    print(f"\nMetadata-trust gaps exposed: {sum(status == 'GAP' for *_, status in cases)}/{len(cases)}")

    # M-01b: the symmetric case -- BOTH roots omit failure_domains, instead
    # of just one. Distinguishes "fold every missing-metadata record into
    # one shared bucket" from a genuine fix: that policy only catches a
    # correlation if every side of it is missing metadata the same way.
    evidence = copy.deepcopy(build_scenario_evidence("S-01"))
    del record(evidence, "ev-c04-gps")["failure_domains"]
    del record(evidence, "ev-c04-landmark")["failure_domains"]
    m01b_evidence = evidence

    # --- Policy comparison under all three policies ---
    print("\n--- Policy comparison (same underlying evidence per row) ---")
    comparison_cases = {
        "M-01 one root missing, one root declares the real domain": m01_evidence,
        "M-01b both roots missing (symmetric)": m01b_evidence,
    }
    for label, base_evidence in comparison_cases.items():
        print(f"\n{label}:")
        for policy_name, policy_fn in POLICIES:
            result = run_case(f"cmp-{policy_name}", policy_fn(base_evidence))
            print(f"  {policy_name:<24} -> {result['disposition']}")

    print(
        "\nfail-open lets both M-01 and M-01b through as PERMIT (false "
        "permission either way). fail-closed-missing only catches M-01b "
        "(both sides fold into the same UNDECLARED-DEPENDENCY bucket); it "
        "does NOT catch M-01, because the one root that DID declare a real "
        "domain keeps its own domain id, which never collides with the "
        "sentinel the other root gets folded into -- 'assume missing "
        "declarations share a bucket with each other' silently stops "
        "working the moment only one side of a real correlation is "
        "missing metadata. verified-marker-only catches both, because it does not "
        "single out 'missing' as the trigger -- it discards ANY domain "
        "claim (present or absent) that isn't itself attested, so an "
        "honestly-declared-but-unattested domain and a silently-omitted "
        "one collapse to the same untrusted state. That is also its cost: "
        "it forces REVALIDATE on every claim resting on any domain "
        "declaration that lacks attestation, honest declarations included, "
        "until a real attestation mechanism exists to earn trust back. M-07 "
        "also shows that the marker itself is not authentication and can be forged."
    )


if __name__ == "__main__":
    main()
