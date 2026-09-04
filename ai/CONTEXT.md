# AI Context — Read First

## Instruction to AI collaborators

This file is the entry point for every AI agent working on Reality. Read it before proposing strategy, research, documents, or code.

Codex and Claude use the two-lens review protocol in `COLLABORATION.md`. By default, Claude steelmans the opportunity as the optimistic builder and Codex attacks assumptions as the skeptical falsifier. Neither role may hide contrary evidence or convert agreement into validation.

Then read, in order:

1. `company/FOUNDING_MEMO.md`
2. `thesis/MASTER_THESIS.md`
3. `thesis/PRIMITIVE.md`
4. `thesis/INVARIANT_TESTS.md`
5. `thesis/ASSUMPTIONS.md`
6. `thesis/KILL_CRITERIA.md`
7. `decisions/DECISION_LOG.md`
8. `validation/VALIDATION_PLAN.md`
9. `research/RESEARCH_INDEX.md`

## Authoritative current state

- **Umbrella vision:** infrastructure that lets intelligent systems interact with reality reliably.
- **Candidate primitive:** a repeatable, measurable process that transforms heterogeneous signals into an evidence-backed real-world state claim sufficient for a specified consequential decision, with provenance, contradictions, confidence, and uncertainty exposed. Read `thesis/PRIMITIVE.md`.
- **Critical distinction:** information extraction, state estimation, and decision-grade verification are different. The project is not claiming extraction as the scarce primitive; it is testing whether estimation and especially defensible verification remain scarce as AI improves.
- **Epistemic status:** “defensible reality for consequential decisions” is a candidate invariant, not a fact. Seek counterexamples and conditions under which it disappears.
- **First industry:** Internet of Battlefield Things / connected battlefield systems. This is a decided industry direction, not merely a test environment.
- **Industry problem:** maintain trustworthy correspondence between changing/adversarial physical reality and the world-state used by intelligent systems to decide and act.
- **Candidate IoBT primitive:** Reality Coupling / evidence-to-state-to-action-to-outcome assurance. This is a problem formulation, not a validated product category.
- **Narrow runtime candidate:** a Claim–Evidence–Action Contract that preserves provenance, freshness, dependencies, evidence independence, and `CONFIRMED / CONTRADICTED / UNKNOWN` semantics into runtime action disposition. Deep research found all components established and Barycenter Systems as a serious near-match; novelty survives only weakly to moderately. Read `research/2026-09-04_CLAIM_EVIDENCE_ACTION_NOVELTY.md`.
- **Safety boundary:** work on assurance, resilience, provenance, uncertainty, state integrity, revalidation, and outcome verification—not weapon targeting or autonomous attack capability.
- **Prior SME work:** Decision-Grade Financial Truth for SMEs remains relevant falsification evidence and may continue as a parallel experiment, but it is no longer the primary industry direction.
- **100× AI test:** cross-domain desk research provisionally finds that stronger inference does not create missing observations or prove post-action state change. The surviving candidate concerns fit-for-purpose, provenance-bearing observation in dynamic, physical, identity-sensitive, or adversarial settings. Market value and horizontal repeatability remain unproven; read `research/2026-09-01_INVARIANT_FALSIFICATION.md`.
- **Architecture-level fork:** Decision-Grade Truth versus Trusted Execution / Delegated Authority. Their relationship is unresolved.
- **Cross-domain hypothesis:** the primitive may later apply to health, insurance, supply chains, robotics, and other domains. This is unproven and must not distract from the chosen IoBT industry.
- **Constraint:** do not optimize the thesis around solo execution, current skills, current capital, Tanzania, or any other assumed geography. These may inform entry only after structural importance is assessed.
- **Product status:** no exact IoBT layer, product, customer, payer, procurement path, business model, or geography is selected.
- **Implementation status:** substantial product code is premature.
- **GitHub status:** published as the public repository `guardian-coder/reality`.

## Epistemic rules

- Clearly label `evidence`, `inference`, `hypothesis`, `decision`, and `unknown`.
- Do not turn a repeated claim into a fact.
- Do not invent interviews, customers, datasets, metrics, sources, or validation.
- Do not treat access-to-finance evidence as proof that missing financial truth is the cause.
- Do not silently promote the SME wedge into the permanent company definition.
- Do not resolve the truth-versus-authority fork without explicit evidence and a logged decision.
- Use primary sources where possible and add durable research artifacts with citations.

## Repository update protocol

- New evidence → add a dated research or validation artifact and update the index.
- New decision → append to `decisions/DECISION_LOG.md` with status and rationale.
- Changed thesis → update the relevant thesis file, assumptions, kill criteria, and this context.
- Disconfirmed assumption → record the evidence and consequence; do not preserve the old narrative for consistency.
- Code request → first verify that the requested implementation follows an explicit validated decision.

## Current next actions

1. Treat the machine-readable contract and scenarios under `prototype/` as frozen test inputs, now including the contract/schema hardening (`validation/2026-09-04_CONTRACT_HARDENING_RATIONALE.md`) and the S-04/S-07 reason-code corrections applied per Codex's own recommendation (`validation/2026-09-04_EVALUATOR_HARDENING_RESULTS.md`).
2. The evaluator now blocks all five counterexamples from `validation/2026-09-04_CODEX_FALSIFIER_REVIEW.md` (`python prototype/run_adversarial_review.py` → 0/5 reproduced) and fully matches all seven original scenarios including reason codes (`python prototype/run_scenarios.py` → 7/7). It is still not a general trusted claim-evaluation boundary — see "What is explicitly still open" in `validation/2026-09-04_EVALUATOR_HARDENING_RESULTS.md`: dependency-metadata authentication, typed failure-domain semantics, runtime schema validation, `DEGRADE`/`HUMAN_REVIEW` reachability all remain unaddressed.
3. Controlled ablations score 4/7 for simple voting, 6/7 for confidence-only and provenance-only, and 7/7 for the full contract. Fix A-06 from `validation/2026-09-04_BASELINE_COMPARISON.md`: preserve independent root lineages through a fused child while still collapsing roots with a relevant shared failure domain. Expand false-permission and false-refusal tests before any larger build.
