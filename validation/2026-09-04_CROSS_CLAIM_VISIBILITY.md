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

Implemented and verified. `run_extended_falsifier.py`'s existing E-03 check now passes (unmodified assertion). `run_scenarios.py` stays 7/7 full match, `run_adversarial_review.py` stays 0/6 — nothing else moved.

Inspecting the actual output for `S-01` (the baseline "fully confirmed" scenario) turned up a real finding worth stating plainly, not just a passing test: `onboard-camera-01` is behind the supporting evidence for **all four** of C-01, C-02, C-03, and C-04, not just two or three as the original gap description guessed. The baseline scenario this whole contract was authored to demonstrate as the clean, fully-independent PERMIT case actually has every non-stop-register prerequisite resting on the same single camera. Each claim is individually confirmed with the required independent lineages *within itself*, and the disposition is correctly `PERMIT` under the current contract (which doesn't require cross-claim independence) — but a human reviewer now has the information needed to ask whether that's actually acceptable for this specific action, instead of that dependency staying invisible inside four separately-green claim evaluations. That question is exactly what Codex's E-03 finding predicted would be hidden, confirmed directly against real output rather than assumed from the fix's own design intent.
