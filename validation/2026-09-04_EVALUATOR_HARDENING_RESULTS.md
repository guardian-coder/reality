# Evaluator Hardening: Results

- **Date:** 2026-09-04
- **Author lens:** Claude, optimistic builder
- **Reviewed finding:** `validation/2026-09-04_CODEX_FALSIFIER_REVIEW.md` (5/5 vulnerabilities independently reproduced before this work began)
- **Status:** All five reproduced counterexamples now blocked; original seven scenarios fully match including reason codes

## What changed

1. **Contract/schema** (`validation/2026-09-04_CONTRACT_HARDENING_RATIONALE.md`, committed separately first): `confirms_when`/`contradicts_when` value predicates, `subject_entity_id` entity binding, `contradiction_rules` for admissible contradiction evidence types — fixes A-01 and A-02, which cannot be fixed in evaluator code alone.
2. **Evaluator** (`prototype/evaluator.py`):
   - Temporal ordering check (`observation_time <= received_time <= decision_time`) — fixes A-03.
   - Top-level integrity-failure scan before per-claim evaluation, routing straight to `REFUSE` per the contract's own `disposition_policy.integrity_failure` — fixes A-04.
   - Independent-lineage counting now requires at least one member of a group to have fully resolved (or absent) ancestry before that group counts toward independence at all — fixes A-05.
   - Contradiction detection rewritten to require admissibility (a `contradiction_rules` type match or a `contradicts_when` value match) rather than trusting a bare `stance: CONTRADICTS` label — closes the related gap Codex named in section 4 ("Contradiction handling bypasses contract rules").
3. **Scenario file** (`prototype/scenarios/bridge-crossing.scenarios.json`): applied Codex's own recommended resolution for the two open reason-code questions from the first evaluator pass — S-04 reverted to the generic `ALL_REQUIRED_CLAIMS_CONFIRMED` (with a new documentation-only `focus` field explaining what the scenario demonstrates, not mechanically asserted), S-07 changed to `REQUIRED_POSITIVE_EVIDENCE_STALE` pending a real `PermitRecord` design. This is a scenario-file change, called out and justified here rather than bundled silently into the evaluator commit.

## One real bug caught while implementing the fix, not just applying it

The first attempt at fixing A-05 merged all unresolved-ancestry records into one shared bucket, intending that no single unresolvable record could count as its own independent lineage. It didn't work: a *lone* unresolved-ancestry record still formed its own distinct group (of one), and that group still counted toward the independence total — the exact bug relocated, not fixed. `run_adversarial_review.py` caught this immediately (A-05 stayed `EXPOSED` after the first attempt, all four others cleared). Corrected: a group only counts as a legitimate independent lineage if at least one of its members has ancestry that is fully resolved or entirely absent; a group composed entirely of unresolved-ancestry evidence contributes zero, regardless of how many records are in it. Worth recording because it's a second, independent instance of the exact same failure shape (absence of verifiable information silently treated as sufficient) inside a system that was *built specifically to prevent that failure shape* — the evaluator's own construction reproduced the class of bug in `docs/28`'s IoBT Reality-Failure Atlas (the sibling repository), caught this time by a regression test that existed precisely because Codex insisted on adversarial fixtures instead of accepting the happy-path result.

## Results

`python prototype/run_scenarios.py`: 7/7 mechanical match, **7/7 full match including exact reason codes** (up from 5/7 before this pass).

`python prototype/run_adversarial_review.py`: **0/5 known vulnerabilities reproduced** (down from 5/5).

## What is explicitly still open, not claimed as solved

Everything Codex named in section 4 of the falsifier review that this pass didn't touch remains open:

- Failure-domain equality is still coarse (any shared string fully merges two sources; typed dependency edges with per-property failure semantics are real future work, not attempted).
- No runtime JSON Schema validation of contract or evidence inputs exists yet.
- Declared dependency metadata (`parent_evidence_ids`, `failure_domains`) is still untrusted at the source — a producer can omit them and be rewarded with apparent independence. This is explicitly named in the original review as "not solvable by evaluator logic alone," and it still isn't; that's an architecture/authentication question, not something this hardening pass could close.
- `DEGRADE` is still unreachable; `HUMAN_REVIEW` still only reachable via a contradiction policy no current claim uses.
- No baseline comparison (simple voting, confidence-only fusion, provenance-only) has been run. That is Codex's stated next step, not this one.

A hardened evaluator that blocks five known adversarial patterns and matches seven authored scenarios exactly is still only evidence that this specific mechanism, against these specific tests, behaves as specified. It is not evidence of general robustness against adversaries who don't already appear in this test suite, and not evidence of operational suitability, safety certification, or product/market validation — same standing caveat as every other artifact in this repository.

## Next collaboration turn

Per the agreed cycle: Codex compares this hardened evaluator against the three promised simpler baselines (simple voting, confidence-only fusion, provenance-only), and continues probing for further adversarial gaps this pass didn't anticipate.
