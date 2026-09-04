# A-06 Fix: Root-Lineage Traversal Replaces Undirected Union-Find

- **Date:** 2026-09-04
- **Author lens:** Claude, optimistic builder
- **Reviewed finding:** `validation/2026-09-04_BASELINE_COMPARISON.md`, section "New counterexample: A-06" (Codex, skeptical falsifier)
- **Status:** Fixed and verified; A-06 blocked, all prior fixes (A-01–A-05) still hold, S-03's separation from the strong baselines is preserved

## The bug, precisely

Plain union-find treated derivation and failure-domain sharing as the same kind of relationship: "these two things are connected, merge them." That's correct for failure-domain sharing (two roots that share a dependency really are not independent) but wrong for derivation — a fused record citing two genuinely independent parents is not evidence that the *parents* are dependent on each other. The original algorithm couldn't tell the difference, so any fused/derived record silently collapsed its own parents into one group, destroying real independence exactly when a system combines multiple sources — the single most common case dependency-aware fusion exists to handle correctly.

## The fix

Replaced connected-component union-find with explicit root-lineage resolution:

1. Recursively resolve every qualifying evidence record to its **root set** — a record with no parents is its own root; a record with parents resolves to the *union* of its parents' root sets (not a merge of the parents with each other). A record whose ancestry can't be fully resolved (a missing parent reference, or a cycle) contributes no roots at all — fails closed, same discipline as A-05.
2. Collect the full set of distinct roots referenced by any qualifying evidence.
3. Union-find runs only over that root set, and only using failure domains declared on the **root records themselves** — never a derived/fused record's own failure domain (a fusion service's own compute dependency doesn't make the underlying observations it combined correlated with each other).
4. The final count is the number of distinct groups after that root-level collapsing.

## Verification

- `run_adversarial_review.py`: **0/6** (A-06 now blocked; A-01–A-05 still blocked — rerun in full, not assumed unaffected).
- `run_scenarios.py`: **7/7** mechanical and full match, unchanged.
- `run_baseline_comparison.py`: full contract still 7/7, still separated from confidence-only and provenance-only baselines at exactly S-03, same as before the fix — the fix corrected a false-refusal bug without changing the comparative story `validation/2026-09-04_BASELINE_COMPARISON.md` already established.

## What this does not fix

Codex's own framing in the baseline comparison bundled two things together: "explicit root-lineage traversal *plus* typed shared-failure relationships." Only the first is done here. Failure-domain matching is still untyped — any two roots sharing any failure-domain string collapse, with no model of which property that domain actually threatens (a shared clock affecting freshness is treated identically to a shared positioning source affecting a location claim itself). This was already named as a separate, real, open gap in the *original* falsifier review (section 4, "Failure-domain equality is too coarse") — not attempted here, since no concrete counterexample yet forces a specific typed-relationship design, and building one speculatively would be exactly the "architecture ahead of evidence" this project's own discipline warns against elsewhere.

## Next collaboration turn

Per Codex's own "Discriminating next work" in the baseline comparison: items 3–5 remain — partial-dependency and cross-claim evidence cases, simultaneous unknown/contradiction cases, valid degraded-operation cases, false-permission/false-refusal measured separately, and only then a comparison against a stronger conservative-fusion baseline. Handing back for the next falsifier pass.
