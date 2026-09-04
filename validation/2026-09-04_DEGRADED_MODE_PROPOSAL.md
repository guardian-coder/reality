# E-04: Degraded Mode — Proposal to Defer, Not a Fix

- **Date:** 2026-09-04
- **Author lens:** Claude, optimistic builder
- **Reviewed finding:** `validation/2026-09-04_EXTENDED_FALSIFIER_RESULTS.md`, "E-04 — Degraded operation: gap"
- **Status:** Proposed (recommend: defer), not implemented — using the `COLLABORATION.md` handoff format since this is a real design decision, not an obviously-correct patch

## 1. Proposal

Do not build `DEGRADE` semantics now. Leave it exactly as it is — present in the `Disposition` vocabulary, unreachable, honestly documented as unreachable — until a real recurring case forces a specific design, the same threshold every other deferred item in this repository has been held to.

## 2. Evidence

`DEGRADE` has existed unused in the schema's `Disposition` enum since the very first frozen contract (`0a89980`, before any evaluator existed). No scenario, adversarial case, or baseline comparison run so far has needed it to demonstrate anything — it was defined speculatively, alongside four dispositions that *did* turn out to be needed (`PERMIT`, `REVALIDATE`, `HUMAN_REVIEW`, `REFUSE`), and it's the one that's sat unreachable through every hardening pass since.

## 3. Assumptions

- A degraded mode invented for the toy bridge-crossing scenario (Codex's own example fixture: `SLOW_CROSSING` triggered by a partial rather than full path observation) would need its exact shape — reduced speed, load, or route limits; which claims may substitute a lesser evidence standard and which may not; expiry; how a degraded permit transitions back to normal operation or escalates to refusal — invented without a real operational case to design against.
- `ai/CONTEXT.md`'s own standing line, unchanged through every prior hardening pass: *"substantial product code is premature."* A full degraded-mode subsystem is exactly that: substantial, speculative, product-shaped code, not a bug fix to something already specified.

## 4. Strongest counterargument

`DEGRADE` sitting unreachable in the schema is itself a small honesty problem — a disposition a caller might reasonably expect to receive, that in practice never will, is a minor form of the same "schema says more than the system actually does" issue A-01 and A-02 were about. There's a case for at least making the *vocabulary* honest, if not the full mechanism: either mark it clearly as reserved/unimplemented in the schema's own description, or remove it until it's real.

## 5. Discriminating test

If Codex or Brayan want `DEGRADE` built now anyway, the concrete next step is a *second* frozen scenario suite — not a retrofit onto bridge-crossing's existing seven — authored the same way the first one was: expected inputs and outputs specified and agreed before any evaluator code changes, forcing the exact shape of "reduced operating envelope" to be a real, reviewable decision rather than something invented inline while writing the evaluator.

If instead the decision is to defer (my own recommendation), the discriminating action is smaller: either annotate the schema's `Disposition` enum to say `DEGRADE` is reserved and currently unreachable by design, or leave `ai/CONTEXT.md`'s own gap list as the record of this, and revisit only when a real case names a specific degraded envelope.

## 6. Decision status

**Proposed.** Recommendation is defer, but this is Brayan's or Codex's call to confirm, not mine to decide unilaterally — same discipline as the S-04/S-07 reason-code questions earlier in this thread, which were proposed and then resolved by Codex's own review rather than built ahead of agreement.
