# Codex Falsifier Review — First Evaluator

- **Date:** 2026-09-04
- **Reviewed commit:** `a07b5e4`
- **Reviewer lens:** Codex, skeptical falsifier
- **Status:** Mechanism implemented; evaluator not yet a valid safety or claim-evaluation boundary

## 1. Points accepted

- The implementation is small, deterministic, standard-library-only, and inspectable.
- It preserves the frozen contract and scenario expectations instead of changing them to force a pass.
- Independent execution reproduced Claude's result: 7/7 claim-state, disposition, and declared-lineage checks; 5/7 exact reason-code matches.
- Union-find is a reasonable minimal mechanism for grouping evidence records with explicitly declared shared lineage or failure domains.
- The two reason-code mismatches are genuine specification questions, not evidence that the core evaluator crashed.

## 2. Main finding

The evaluator currently evaluates **metadata availability**, not the truth conditions of claims.

It treats every relevant record without `stance: CONTRADICTS` as supporting evidence. It does not interpret or validate `value`, check that `observed_entity_id` matches the claim subject, verify that observation and receipt occurred before the decision, or enforce the contract's integrity-failure disposition.

Therefore 7/7 authored-scenario success is evidence that the control-flow skeleton is implementable. It is not yet evidence that a Claim–Evidence–Action Contract prevents unsupported action.

## 3. Reproduced counterexamples

`python prototype/run_adversarial_review.py` reproduces five gaps:

| ID | Counterexample | Current result | Required behavior |
|---|---|---|---|
| A-01 | C-05 evidence value is changed from `no_stop_active` to `stop_active`, with no `stance` field | `CONFIRMED`; `PERMIT` | The evidence adapter or claim predicate must interpret the value and produce `CONTRADICTED`; `REFUSE` |
| A-02 | Physical-condition evidence describes `bridge-beta`, not `bridge-alpha` | C-02 `CONFIRMED`; `PERMIT` | Reject evidence not bound to the contract subject or explicitly allowed related entity |
| A-03 | Full-path observation occurs ten minutes after the decision time | C-03 `CONFIRMED`; `PERMIT` | Future observation/receipt cannot justify an earlier decision |
| A-04 | Required path evidence has `integrity_status: FAILED` | `REVALIDATE` | Enforce `integrity_failure: REFUSE` when failed evidence is presented for a required claim |
| A-05 | An apparent independent position record derives from a parent outside the evaluated claim set | C-04 `CONFIRMED`; `PERMIT` | Unresolved ancestry must not create independence; require the dependency graph or fail closed |

These fixtures do not model adversarial spoofing sophistication. They show ordinary semantic omissions sufficient to produce unsafe permission.

## 4. Additional design gaps

### Failure-domain equality is too coarse

Any shared string merges two sources completely. Real independence is claim- and failure-mode-specific. Sharing a clock may correlate freshness but not necessarily a visual identity classification; sharing power may create simultaneous absence but not identical false values. A future model needs typed dependency edges with the affected property and failure semantics.

### Contradiction handling bypasses contract rules

Contradicting records are checked using `valid_until`, but not the claim rule's permitted evidence type or maximum age. Any verified record tagged `CONTRADICTS` can currently override a claim. The mechanism needs explicit contradiction predicates and admissibility rules, not trust in a producer-supplied stance label.

### Contract fields are partly decorative

`required_state` and `disposition_policy` are present in JSON but the evaluator hard-codes the current behavior. `DEGRADE` is unreachable. `HUMAN_REVIEW` is reachable only for a contradiction policy, and no current claim uses that policy. The result is not yet a general interpreter of the contract.

### No schema validation occurs at runtime

Malformed contract or evidence objects fail unpredictably or are accepted where optional fields change semantics. The evaluator should validate inputs—or define a separately enforced trusted-adapter boundary—before evaluation.

### Declared dependency metadata is untrusted

A source can omit its parent or failure domains and be rewarded with apparent independence. This is not solvable by evaluator logic alone. The architecture must say who assigns dependency metadata, how it is authenticated, and what happens when dependency information is incomplete.

## 5. Resolution of the reason-code questions

### S-04

Reject the proposed “tightest-margin claim” inference. In the baseline, several claims meet exactly their minimum lineage count, so the evaluator cannot uniquely infer that C-04 is the narrative focus. `POSITION_INDEPENDENTLY_CONFIRMED` belongs in scenario metadata or claim-evaluation reasons, not as the sole action-level reason.

Recommended specification change: preserve `ALL_REQUIRED_CLAIMS_CONFIRMED` as the runtime action reason and add a separate `scenario_focus` or expected claim-level reason for C-04.

### S-07

Claude's diagnosis is correct: a stateless current-state evaluation cannot distinguish first-time staleness from invalidation of a prior permit. But an optional previous-disposition string is insufficient; invalidation must bind to the exact prior permit, contract version, evidence snapshot, issue time, and validity conditions.

Recommended specification change: introduce a `PermitRecord` or `PriorEvaluation` object. Until then, S-07 tests stale evidence, not permit invalidation, and its generic runtime reason should be `REQUIRED_POSITIVE_EVIDENCE_STALE`.

## 6. Missing evidence

- No actual JSON Schema validation of contract, evidence, or output has been run.
- No tests cover entity binding, claim predicates, future timestamps, receipt time, failed integrity, missing ancestry, multiple simultaneous unknowns, or conflicting disposition priorities.
- No baseline implementations exist yet, so the full mechanism has not demonstrated improvement over simple voting, confidence-only fusion, or provenance-only evaluation.
- No measurement of false refusal, latency, dependency-metadata availability, or integration cost exists.

## 7. Discriminating next test

Before adding more positive scenarios:

1. convert A-01 through A-05 into required regression tests;
2. define trusted claim predicates and entity-binding rules;
3. make unresolved dependency ancestry fail closed;
4. enforce temporal ordering and integrity policy;
5. then compare the corrected evaluator against the three promised simpler baselines.

The mechanism survives as an implementation hypothesis only if it blocks these counterexamples without making representative valid cases unusably restrictive.

## 8. Recommended decision status

**Continue, but do not call the evaluator mechanically correct without qualification.** It is mechanically consistent with the seven authored happy/failure narratives. The adversarial review shows the current boundary can still permit action from semantically contradicting, incorrectly bound, temporally impossible, or lineage-incomplete evidence.

The appropriate next work is evaluator hardening and baseline comparison, not a larger architecture.

