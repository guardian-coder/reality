# Research Index

This index records evidence, not conclusions by repetition. Add one dated artifact per meaningful research effort and link it here.

## Available project evidence

No research files are currently synced into this workspace. The referenced conversation described prior web research and mentioned an attached report, but the repository does not yet contain its source material or a verified bibliography. Therefore those claims are not treated here as independently audited evidence.

## Repository research artifacts

- [2026-09-04 — Claim–Evidence–Action Contract: Novelty Falsification](2026-09-04_CLAIM_EVIDENCE_ACTION_NOVELTY.md) — Deep research finds every component established and one serious near-match, but no public evidence of a general deployed IoBT system combining claim prerequisites, evidence-dependency independence, explicit unknowns, and runtime action gating.
- [2026-09-01 — Invariant Falsification: The 100× AI Test](2026-09-01_INVARIANT_FALSIFICATION.md) — Cross-domain attack finds that missing observations, identity binding, adversarial evidence, and post-action state changes survive stronger inference, while market value and horizontal repeatability remain unproven.
- [2026-09-01 — Trace Reconstruction Falsification: Test Design](../validation/2026-09-01_TRACE_RECONSTRUCTION_DESIGN.md) — Primary-source desk research finds transaction-based SME scoring already demonstrated; reframes the test around incremental decision value from verified economic context.
- [2026-09-01 — Validation Participant Recruitment Shortlist](../validation/2026-09-01_RECRUITMENT_SHORTLIST.md) — Ranked public introduction routes for SMEs, lenders, and qualified accountants; first outreach wave sent.
- [Validation Outreach Log](../validation/OUTREACH_LOG.md) — Contact status and follow-up actions without personal contact details or private correspondence.

## Active prototype specifications

- [2026-09-04 — First Claim–Evidence–Action Contract](../validation/2026-09-04_FIRST_CLAIM_EVIDENCE_ACTION_CONTRACT.md) — Defines the first non-weaponized IoBT simulation decision, required claims, evidence independence rules, action dispositions, comparators, and falsification scenarios before code.
- [2026-09-04 — Codex Falsifier Review](../validation/2026-09-04_CODEX_FALSIFIER_REVIEW.md) — Independently reproduces the evaluator's authored-scenario results, then demonstrates five semantic counterexamples involving values, entity binding, time, integrity, and missing ancestry.
- [2026-09-04 — Evaluator Implementation Results](../validation/2026-09-04_EVALUATOR_IMPLEMENTATION_RESULTS.md) — Deterministic evaluator (`prototype/evaluator.py`) built against the frozen contract and scenarios: 7/7 mechanically correct (claim states, disposition, independent lineages), 5/7 fully correct including reason codes. Two reason-code mismatches (S-04, S-07) surfaced as an open spec question for Codex, not silently resolved. Also finds `DependencyGraph` may be unnecessary as a separate input — every field it would carry is already on each `EvidenceRecord`.
- [2026-09-04 — Contract Hardening Rationale](../validation/2026-09-04_CONTRACT_HARDENING_RATIONALE.md) — Schema/contract extension (value predicates, entity binding, admissible contradiction rules) fixing the two adversarial gaps that couldn't be closed in evaluator code alone, committed separately with written reason before evaluator changes per `prototype/README.md`.
- [2026-09-04 — Evaluator Hardening Results](../validation/2026-09-04_EVALUATOR_HARDENING_RESULTS.md) — All five Codex-identified counterexamples now blocked (0/5 reproduced); original seven scenarios fully match including reason codes (7/7, up from 5/7). Documents a real bug in the first A-05 fix attempt (unresolved-ancestry evidence still counted as its own independent lineage) caught by rerunning the adversarial suite, not assumed fixed. Explicitly lists what remains open: dependency-metadata authentication, typed failure-domain semantics, runtime schema validation.
- [2026-09-04 — Baseline Comparison and Second Falsifier Pass](../validation/2026-09-04_BASELINE_COMPARISON.md) — Full contract scores 7/7 versus 6/7 for confidence-only and provenance-only and 4/7 for simple voting, but A-06 shows the dependency algorithm can collapse genuinely independent roots and cause false revalidation.
- [2026-09-04 — A-06 Fix: Root-Lineage Traversal](../validation/2026-09-04_LINEAGE_ALGORITHM_FIX.md) — Replaced undirected union-find with explicit root-lineage resolution (a fused child unions its parents' root sets rather than merging the parents themselves). 0/6 adversarial cases reproduced, 7/7 scenarios unchanged, S-03's separation from the strong baselines preserved. Typed failure-domain relevance remains a separate, still-open gap.

## Claims carried forward for validation

| Claim | Status | Required evidence |
|---|---|---|
| SMEs face access-to-finance problems | Reported in prior conversation; sources not imported | Primary surveys and current market data |
| Digital economic traces are increasing | Reported in prior conversation; sources not imported | Payment-system and platform primary data |
| Traces are fragmented and semantically ambiguous | Working hypothesis | Sample datasets, workflow mapping, expert assessment |
| Better truth changes lending or other decisions | Unproven | Decision-maker experiments and commitments |
| Incumbents cannot reconstruct the same truth | Under pressure: incumbents and fintechs already use multi-source transaction data for risk scoring; full economic-state reconstruction remains unproven | Capability comparison and reconstruction benchmark |

## Next research artifact

Document the first completed four-stage SME evidence experiment, including the lender's actual decision threshold, blinded outputs, expert reference, costs, and disconfirming evidence.
