# Contract and Schema Hardening: Written Rationale

- **Date:** 2026-09-04
- **Author lens:** Claude, optimistic builder
- **Status:** Proposed change to the frozen contract and schema, committed separately from evaluator code per `prototype/README.md`'s rule
- **Trigger:** Codex's adversarial falsifier review (`validation/2026-09-04_CODEX_FALSIFIER_REVIEW.md`), independently reproduced (5/5 vulnerabilities confirmed via `python prototype/run_adversarial_review.py` before this change)

## What changed and why

Two of the five adversarial gaps (A-01, A-02) cannot be fixed in evaluator code alone — the *contract itself* has no way to express "what value counts as confirming vs. contradicting" or "which entity this claim is actually about." Fixing them requires the contract to say more, not just the evaluator to check more.

### Schema (`schemas/cea.schema.json`)

- New `ValuePredicate` type: `{field: "value", operator: "equals"|"not_equals", value: <any>}`. Deliberately minimal — one field, two operators — because that's what the current five claims need, not a general expression language. Widening this later needs its own justification, not a reason to build it now.
- `EvidenceRule` gains optional `confirms_when` / `contradicts_when` (both `ValuePredicate`). When present, an evidence record's `value` must match `confirms_when` to count as supporting; a record matching `contradicts_when` counts as contradicting regardless of any producer-supplied `stance` label. When absent (unchanged for C-01/C-03/C-04's rules, where no clean equality check fits a structured or continuous value), behavior is exactly as before — this is additive, not a breaking change to claims that don't use it.
- `ClaimRequirement` gains optional `subject_entity_id` — which entity this claim is actually about. When present, only evidence whose `observed_entity_id` matches qualifies, for both support and contradiction.
- `ClaimRequirement` gains optional `contradiction_rules` (same shape as `evidence_rules`) — evidence types admissible as contradiction of a claim, each with its own freshness/integrity requirement, exactly mirroring how confirming evidence is already scoped. Fixes Codex's separately-named gap: *"any verified record tagged CONTRADICTS can currently override a claim"* regardless of type or freshness.

### Contract (`contracts/bridge-crossing.contract.json`)

- Every claim now declares `subject_entity_id`: C-01/C-02 → `bridge-alpha`, C-03 → `bridge-alpha-path` (the path is a related but distinct entity from the bridge itself, matching how the fixtures already modeled it), C-04/C-05 → `logistics-vehicle-01`. Fixes A-02: evidence describing `bridge-beta` can no longer satisfy a `bridge-alpha` claim.
- C-05's `STOP_REGISTER_SNAPSHOT` rule gains `confirms_when: value == "no_stop_active"` and `contradicts_when: value != "no_stop_active"`. Fixes A-01: a record with `value: "stop_active"` and no `stance` field can no longer be silently counted as support.
- C-02 gains a `contradiction_rules` entry for `STRUCTURAL_ALARM` (max age 15 minutes, `VERIFIED` integrity required) — a parameter choice worth stating plainly, not hidden in the diff: 15 minutes is longer than the 5-minute freshness required of the *confirming* `PHYSICAL_CONDITION_OBSERVATION` evidence, because a structural alarm is a persistent state change, not a point observation — it should stay actionable for longer than a routine visual check does. This is a judgment call, not a derived fact; revisit if a real structural-monitoring workflow suggests otherwise.

## What this does not fix

- A-03 (future observation), A-04 (integrity failure routes to the wrong disposition), and A-05 (unresolved ancestry counted as independent) are pure evaluator-logic gaps — no contract or schema change is needed for those, and none is proposed here. They belong in the evaluator-hardening commit that follows this one.
- Non-enum evidence types without a natural equality check (`PHYSICAL_CONDITION_OBSERVATION`'s own confirming value, `FULL_PATH_OBSERVATION`, `POSITION_OBSERVATION`) still rely on existence-of-fresh-verified-evidence rather than a value predicate for *confirmation* — Codex's broader point that contradiction/confirmation semantics are coarse for continuous or structured values is only partially addressed here (for C-02, via the new admissible `contradiction_rules` type), not resolved in general. A general solution (e.g., numeric thresholds, structured-value schemas per evidence type) is real future work, not attempted here — consistent with fixing the five reproduced counterexamples, not building a general value-interpretation framework speculatively.

## Discriminating test

`run_adversarial_review.py`'s A-01 and A-02 checks should flip from `EXPOSED` to blocked once the evaluator (next commit) is updated to use `confirms_when`/`contradicts_when` and `subject_entity_id`. If either still passes after that change, either this contract extension or the evaluator's use of it is wrong — re-open this file, don't patch around it in evaluator code.
