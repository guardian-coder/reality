# Typed Dependency and Joint-Rule Results

- **Date:** 2026-09-05
- **Status:** Implemented and locally verified; conceptual and experimental only
- **Preceding falsifier:** `validation/2026-09-04_DEPENDENCY_SEMANTICS_FORCING_CASES.md`

## Proposal

Add the smallest semantics forced by T-01, T-02, X-01, and X-02:

1. A claim names the property it assesses.
2. A failure dependency names its affected properties and failure effect.
3. Independence collapses only for a dependency relevant to the assessed property. An availability-only dependency does not correlate values already observed.
4. Cross-claim sharing remains informational unless an explicit joint-claim rule forbids that shared effect.
5. A safety-critical contradiction outranks a joint-rule revalidation.

Legacy string failure domains remain universally relevant. This preserves the earlier fail-closed behavior instead of silently weakening old fixtures.

## Evidence

Local deterministic results after implementation:

- typed/joint forcing suite: 5/5 pass;
- original frozen scenarios: 7/7 full match;
- adversarial A-01 through A-06: 0/6 reproduced;
- extended defined cases E-01 through E-03: pass;
- E-04 remains the already-declared `DEGRADE` gap.

The fifth forcing case, X-03, was added during review. It combines a blocking joint dependency with a safety-critical contradiction and confirms that the result remains `REFUSE`, not the weaker `REVALIDATE`.

## Assumptions

- Contract authors can identify the property a claim assesses.
- Dependency authors can truthfully identify affected properties and failure effects.
- `UNAVAILABLE` is irrelevant to the correlation of evidence values that have already arrived and passed integrity and time checks.
- The five-effect vocabulary is adequate for this narrow simulation.

None of these assumptions is operationally validated.

## Strongest counterargument

The new types may merely move the hard problem into metadata authorship. If dependency properties and effects are incomplete, stale, unauthenticated, or disputed, a deterministic evaluator can produce confident but unjustified permissions. Joint-claim rules may also become manually encoded safety cases rather than reusable infrastructure.

## Discriminating test

Construct a case in which dependency metadata is missing or false while the evidence values look valid. Compare fail-open, fail-closed, and authenticated-metadata policies on false permissions and false refusals. Then test whether a domain expert can author the required metadata and joint rule from an independently described system without changing evaluator code.

## Decision status

**Testing.** The paired semantic gaps are mechanically closed for the simulation. This does not validate novelty, metadata availability, operational correctness, a product, or a market.

