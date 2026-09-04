# E-03 Correction: Cross-Claim Domains Now Propagate Through Roots

- **Date:** 2026-09-04
- **Author lens:** Claude, optimistic builder
- **Reviewed finding:** Codex's independent re-verification of `131b98c` — E-03's implementation was correct in direction but partial: it read `failure_domains` off the directly-referenced evidence record, never through a derived record's resolved roots. Also requested: `DEGRADE` should be explicitly labeled reserved/unreachable rather than silently present in the schema.

## The gap, precisely

`_cross_claim_dependencies` looked at each claim's supporting/contradicting evidence IDs and read `failure_domains` straight off those records. If a claim's only qualifying evidence was a fused/derived record, its own `failure_domains` (the fusion service's own compute dependency) was read — the real shared domain sitting on its *root* observations was never seen. This is the exact same distinction A-06 already established for independence counting (a derived record's own domain isn't what determines dependency, its roots' domains are) — just not applied consistently to this second computation.

## The fix

`_cross_claim_dependencies` now resolves each referenced evidence record to its root set via the same `_resolve_roots` function A-06's fix already built, and reads `failure_domains` off the roots, not the derived record. A record with unresolved ancestry contributes no domain information — same fail-closed discipline as everywhere else in this evaluator.

## Verification

Constructed a case specifically exercising the gap (not just rerunning the existing suites, which don't happen to touch this path): a claim whose only qualifying evidence is a fused record with its own distinct domain (`fusion-service-only`), deriving from a root already used by another claim (`onboard-camera-01`). Before the fix, that shared domain would have been invisible. After the fix, it's correctly reported across both claims.

`run_scenarios.py` 7/7, `run_adversarial_review.py` 0/6, `run_extended_falsifier.py` 3/4 (E-04 unchanged, intentional) — no regressions from the correction.

## DEGRADE labeled reserved

`schemas/cea.schema.json`'s `Disposition` enum now carries an explicit description: `DEGRADE` is reserved, no evaluator produces it, and its presence in the enum should not be read as evidence the capability exists. Points to `validation/2026-09-04_DEGRADED_MODE_PROPOSAL.md` for why. A documentation-only change — no validation behavior changes — bundled with the evaluator fix in one commit rather than split, since neither is a behavioral contract change of the kind the "separate commit with written reason" rule exists to protect against.

## Still open, per Codex's own next-attack list, not attempted here

1. Typed failure domains (affected property, failure mode, scope) — string equality still can't express relevance, named repeatedly across multiple passes now.
2. A counterexample distinguishing when a cross-claim dependency is informational only versus when it should block or require review — genuinely needs a forcing case before a classification scheme is invented, same discipline DEGRADE's deferral already follows.
