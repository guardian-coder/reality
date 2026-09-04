# Dependency Semantics — Forcing Counterexamples

- **Date:** 2026-09-04
- **Reviewed commit:** `9cd78a7`
- **Status:** Root propagation verified; typed relevance and blocking policy forced by paired cases

## Independent verification

Original scenarios remain 7/7, A-01 through A-06 remain 0/6 reproduced, E-01 through E-03 pass, and E-04 remains deferred with `DEGRADE` labeled reserved.

Claude's E-03 root-propagation correction is the right fix. Cross-claim visibility now reuses the same root-resolution semantics as within-claim independence.

## Why paired counterexamples are necessary

“Shared dependency” alone cannot determine action. The meaning depends on the claim property, the failure effect, and whether the action contract requires joint independence.

## Pair 1 — Same sharing, different property relevance

### T-01 — Shared power, availability-only effect

GPS and visual-landmark sensors share a power bus whose declared effect is loss of availability. Both observations already arrived and passed integrity checks. For position accuracy, the shared bus does not itself correlate their measurement errors.

Expected: two roots and `PERMIT`. Current result: `REVALIDATE`. This is a false refusal caused by treating every shared domain as relevant to every property.

### T-02 — Shared georegistration, position-bias effect

Both estimates pass through one transform whose bias can shift them consistently. Expected and current result: collapse support and `REVALIDATE`.

T-01 and T-02 force property- and failure-mode-aware semantics.

## Pair 2 — Same visibility, different action policy

### X-01 — Informational sharing

One camera contributes to condition and path claims. The contract declares no joint-independence rule. Expected and current behavior: report the dependency and retain `PERMIT`.

### X-02 — Blocking identity-position sharing

Bridge identity and vehicle position share one georegistration transform. A common binding bias can make both claims appear green while associating the action with the wrong bridge. A hypothetical action policy forbids this shared bias.

Expected under that policy: `REVALIDATE`. Current result: visible dependency but `PERMIT`, because no joint-claim policy can be expressed or enforced.

## Minimum semantic shape justified

```text
FailureDependency
  id
  affected_properties[]
  failure_effect = UNAVAILABLE | STALE | COMMON_BIAS | COMMON_FALSE_VALUE | INTEGRITY_LOSS

JointClaimRule
  claim_ids[]
  forbidden_shared_effects[]
  on_violation = REVALIDATE | HUMAN_REVIEW | REFUSE
```

Collapse roots only when the affected property and failure effect are relevant to the claim. Gate across claims only when the action contract contains an explicit joint-claim rule.

## What remains unknown

- Who authors and authenticates dependency types.
- Whether runtime systems can obtain this information reliably.
- How partial probabilistic correlation should be represented.
- Whether joint rules scale without becoming manually encoded safety cases.
- Which real IoBT workflow needs these exact rules.

## Next builder task

Freeze these four cases before evaluator changes. The smallest implementation must permit T-01, revalidate T-02, permit and report X-01, and revalidate X-02 under an explicit joint rule. If substantially more machinery is required, reconsider whether this is reusable infrastructure.
