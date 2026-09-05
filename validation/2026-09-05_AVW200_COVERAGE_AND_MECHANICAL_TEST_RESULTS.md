# Coverage-Table Reviewer and Mechanical AVW200 Test — Results

- **Date:** 2026-09-05
- **Status:** Both parts run once; conceptual and experimental only. No evaluator, contract, or scenario file was changed.
- **Author:** Claude, optimistic-builder lens.
- **Answers:** the precise next experiment specified after `validation/2026-09-05_INDEPENDENT_REVIEWER_COMPARISON.md` was reviewed, corrected, and committed as `2175375` — give a third isolated reviewer only Reviewer A's findings, require a dependency-to-rule coverage table, then encode the disputed AVW200 case so the action difference becomes mechanically testable.
- **Raw material:** `research/2026-09-05_REVIEWER_A_findings_only_1-4.md` (A's §1–4 only, stripped of §5/§6 — what Reviewer C was given), `research/2026-09-05_REVIEWER_C_report.md` (full verbatim output), `prototype/run_avw200_disputed_case_falsifier.py` (the mechanical test, runnable against the real evaluator).

## Proposal

Two corrections were recorded against the prior document: (1) the predicted false permission from A's dropped AVW200 rule was an inference, not a mechanically tested result; (2) both raw reviewer reports mislabeled some background material's chapter, itself another instance of provenance degrading during synthesis. This experiment addresses both directly:

1. Give a third, isolated reviewer (Reviewer C) *only* Reviewer A's §1–4 findings — explicitly withholding A's own §5 (rules) and §6 (self-assessment) — and require two deliverables: independently-derived joint-claim rules, and a dependency-to-rule coverage table mapping every named dependency to whichever rule covers it, or "NOT COVERED" with a stated reason.
2. Encode the disputed AVW200 case as an actual contract against the real, unmodified `evaluator.py`, run twice — once with a ruleset matching A's actual (as-written) rules, once with a ruleset matching B's/C's — and report the real dispositions, not an inference about what they'd probably be.

## Evidence

### Part 1 — Reviewer C, blind to A's rules, with a coverage-table requirement

Reviewer C derived 11 joint-claim rules from A's findings alone and produced a full coverage table against all 12 of A's named dependencies (a)–(l).

**Result: Reviewer C did not reproduce Reviewer A's specific omission.** C's Rule 2 explicitly covers the AVW200-level pairing — the exact dependency A's own findings named (§2b) but A's own §5 dropped. C arrived at this independently, having never seen A's rules or self-assessment, working only from A's findings text.

**Result: C found a different, smaller, self-flagged gap of its own.** C's coverage table marks dependency (e) — shared environmental enclosure per system — as **NOT COVERED**, with a stated reason (the source-groupings a dedicated enclosure rule would imply are already produced by C's Rules 3 and 4 together) and an explicit hedge that this is "arguably overlooked... a borderline call," not confidently settled. C was instructed not to pad the table to avoid a "NOT COVERED" row, and used that permission — the table has a real, disclosed gap in it rather than a suspiciously clean 12-for-12.

**Interpretation.** In this one trial, requiring a coverage table as a mandatory deliverable — not just asking for rules — prevented the recurrence of the exact compression failure the prior experiment found in A. That is one data point in favor of "cross-check findings against rules" as a real mitigation, not proof it generalizes. It is not evidence that coverage tables eliminate this failure mode: C still produced one gap, on a different dependency, and disclosed it rather than hiding it — which may be the more realistic bar to expect from this method (gaps become visible and contestable, not eliminated) rather than a claim that any single review pass, however structured, converges to zero omissions.

**A scope limit worth stating plainly:** this method audits *consistency between a stated findings list and a stated rules list*. It does not, and cannot by itself, verify that the findings list is complete or honest in the first place. A reporter who simply left dependency (b) out of their findings section entirely — rather than naming it and then dropping it at the rules stage, as A did — would produce a coverage table with nothing to flag, because there would be no findings-table row for the missing dependency to fail to cover. The coverage-table check catches *lossy compression of known facts*; it does not catch *incomplete fact-gathering upstream of it*. Both are real failure modes this line of work has now separately demonstrated (the metadata falsifier's M-01 tested the latter directly), and they need different mitigations.

### Part 2 — Mechanical test of the disputed AVW200 case

`run_avw200_disputed_case_falsifier.py` builds a minimal standalone contract (two claims, C-S1-LOAD and C-S2-LOAD, modeling shaft-1 and shaft-2 load confirmation) and evidence modeling the real structure both reviewers described: shaft-1's and shaft-2's VW gauge evidence each carry their own MUX-specific failure domain, plus a shared `avw200-1` domain with `failure_effect: COMMON_BIAS`. Run against the real, unmodified `evaluator.py`:

| Ruleset | joint_claim_rules | Disposition | reason_codes |
|---|---|---|---|
| A-style (as A's §5 actually reads — no rule names this claim pair) | `[]` | **PERMIT** | `ALL_REQUIRED_CLAIMS_CONFIRMED` |
| B/C-style (explicit AVW200 rule, matching both B's §5 and C's independently-derived Rule 2) | one rule, `claim_ids: [C-S1-LOAD, C-S2-LOAD]`, `forbidden_shared_effects: [COMMON_BIAS]` | **REVALIDATE** | `FORBIDDEN_JOINT_CLAIM_DEPENDENCY` |

The two rulesets produce different evaluator dispositions on identical constructed evidence under the chosen `COMMON_BIAS` model. This confirms that the omitted rule can change output under that assumption. It does **not** establish a real unsafe bridge decision: the source documents a MUX-to-AVW200 wire producing unintelligible data and then total loss, but does not establish that a shared AVW200 produces common bias. The exact pairing of the two MUXes to one AVW200 is also inferred rather than stated.

Codex added an availability-only contrast, closer to the documented incident. With the AVW200 dependency typed as `UNAVAILABLE`/availability rather than `COMMON_BIAS`/load magnitude, both A-style and B/C-style contracts return `PERMIT`; the common-bias-only joint rule does not separate them. The mechanical action-difference claim therefore remains conditional on failure-effect modeling.

## Assumptions

- The mechanical test's contract and evidence are a minimal standalone model built to isolate this one disputed mechanism (the AVW200 pairing), not a full encoding of the I-35W system or an extension of the frozen bridge-crossing contract. It deliberately does not model MUX-level rules, calibration-reference rules, or any of the other 9 dependencies C and the reviewers named — those would each need their own claims/evidence to test in isolation the same way, and were out of scope for this specific, precise follow-up.
- `avw200-1`'s `failure_effect` was set to `COMMON_BIAS` for this test. The real document does not settle what the AVW200's actual failure mode would be if it degraded (only the MUX-to-AVW200 wire's failure is documented, as a garbled-then-total loss, arguably closer to availability than bias) — this is a modeling choice made to exercise the joint-claim mechanism clearly, not a claim about the real AVW200's true failure character.
- The claims say load is “within expected bounds,” but their evidence rules contain no value predicate or numerical bound. Consequently, the evaluator does not test whether 210 or 195 microstrain is acceptable. This fixture tests dependency-rule routing only, not structural safety.
- The standalone contract omits schema-required top-level fields and uses claim IDs outside the current schema pattern. The evaluator accepts it because runtime schema validation remains unimplemented. This does not invalidate the black-box routing comparison, but it prevents treating the fixture as a valid production contract.
- Reviewer C is one trial. Whether the coverage-table requirement reliably prevents this class of omission, or happened to succeed here for reasons specific to this case (e.g., a shorter, more focused task than A's combined six-part original prompt), is untested. A stronger test would run the coverage-table method multiple times, or against A's own original combined findings+rules task with the coverage table required from the start, to see if A itself would have caught its own gap under that discipline.

## Strongest counterargument

Reviewer C's success could be an artifact of task design rather than of the coverage-table discipline specifically: C was given a narrower, single-purpose task (derive rules, then audit them) whereas A was asked to do six things in one pass, ending with self-assessment as an afterthought. It's possible any reviewer doing rules-derivation as a dedicated, later, second pass — coverage table or not — would have caught what A's single combined pass missed, simply from added attention and reduced task-switching load. This experiment does not separate "the coverage table caught it" from "doing it as a separate, focused pass caught it." Disentangling those needs a fourth condition: a reviewer doing a dedicated rules-only pass with no coverage-table requirement, to see if the table specifically adds anything over just splitting the task.

## Discriminating test

The counterargument above names its own test directly: run a fourth reviewer on A's findings, asking only for joint-claim rules (Part 1's task) with no coverage-table requirement (no Part 2). If that reviewer also independently covers the AVW200 dependency, the coverage-table requirement isn't what's doing the work here — task decomposition is, and the real mitigation worth carrying forward is "always do rules-derivation as its own dedicated pass," not "require a coverage table" specifically. If that reviewer reproduces something closer to A's original omission, the coverage-table requirement itself is the load-bearing part.

## Decision status

**Testing.** Reviewer C did not reproduce A's AVW200 omission, and the coverage table made its own uncovered dependency visible. The evaluator comparison proves that a joint rule changes routing under a hypothetical common-bias model, while the availability-only contrast does not. A real unsafe action difference remains unproven. The task-decomposition confound is still the next test before crediting the coverage table specifically.

## Codex review before commit

Accepted: the isolated Reviewer C procedure, its explicit coverage table, its recovery of the AVW200 row, and the observed `PERMIT`/`REVALIDATE` evaluator difference under the authored common-bias fixture.

Disputed: describing that difference as a mechanically confirmed real unsafe permission. It depends on an inferred topology and unsupported `COMMON_BIAS` effect, does not evaluate the claimed load bound, and bypasses schema validation. The added availability-only paired run makes this dependency explicit.

## Note on repository access

Same access situation as the prior two documents in this thread — produced from the Claude Code session bound to a different repo, files written to disk only, no git operations attempted from this session. Reviewed/corrected/committed history for prior documents in this thread suggests someone with real write access (Codex, or Brayan directly) has been picking these up from disk; this document and its accompanying files (`research/2026-09-05_REVIEWER_A_findings_only_1-4.md`, `research/2026-09-05_REVIEWER_C_report.md`, `prototype/run_avw200_disputed_case_falsifier.py`) are new and follow the same pattern.
