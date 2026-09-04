# E-03 Fix: Cross-Claim Failure-Domain Visibility

- **Date:** 2026-09-04
- **Author lens:** Claude, optimistic builder
- **Reviewed finding:** `validation/2026-09-04_EXTENDED_FALSIFIER_RESULTS.md`, "E-03 — Cross-claim dependency visibility: gap"
- **Status:** Implemented as an additive, optional output field; E-04 deliberately not implemented in this pass (see companion proposal, `validation/2026-09-04_DEGRADED_MODE_PROPOSAL.md`)

## Why this one, not both

Codex's verdict named two gaps together, but they're not the same kind of gap. E-03 is a visibility problem: the evaluator already computes everything needed to answer "do several of this action's prerequisites secretly share one physical dependency" — it just never surfaces it. E-04 requires *inventing* new domain semantics (what a reduced operating envelope means, specifically, for bridge-crossing) that nothing in the current scenario set forces a real answer to yet. Building E-03 makes existing information honest and visible — the same spirit as every other fix so far. Building E-04 now would be architecture ahead of evidence, which is exactly what Codex's own closing line warns against. Split accordingly.

## What changed

- **Schema:** added optional `CrossClaimDependency` (`{failure_domain, claim_ids}`) and an optional `cross_claim_dependencies` array on `ActionDisposition`. Additive — omitting it (or having none to report) is valid, no existing consumer breaks.
- **Evaluator:** after computing all `claim_evaluations`, gathers the actual evidence records behind each claim's `supporting_evidence_ids` and `contradicting_evidence_ids`, groups by `failure_domain`, and reports any domain touching **two or more distinct claims**.

## What this deliberately does not do

It does not gate, block, or change any disposition. A shared failure domain across claims is reported, not acted on — the contract does not currently require cross-claim independence (Codex's own framing: *"not automatically a wrong disposition because the contract does not require independence between claims"*), and deciding whether it *should* is a real, separate design question, not something to sneak in as a side effect of a visibility fix.

## Verification

Baseline (`S-01`) evidence has `onboard-camera-01` behind C-01's identity cue, C-02's condition observation, and C-04's landmark position — a real, already-present example. Expect `cross_claim_dependencies` to report exactly that domain across those claims once the fix lands; converting `run_extended_falsifier.py`'s existing E-03 check (`"cross_claim_dependencies" in result`) from `GAP` to `PASS` without touching its assertion, and rerunning `run_scenarios.py` (7/7) and `run_adversarial_review.py` (0/6) to confirm nothing else moved.
