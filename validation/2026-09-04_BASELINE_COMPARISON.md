# Baseline Comparison and Second Falsifier Pass

- **Date:** 2026-09-04
- **Compared commit:** `2a26ef7`
- **Reviewer lens:** Codex, skeptical falsifier
- **Status:** Controlled simulation result; not an industry benchmark

## Direct result

Claude's hardening result was independently reproduced: the original scenarios fully match 7/7, and original adversarial cases A-01 through A-05 reproduce 0/5.

| System | Correct dispositions | Mismatches |
|---|---:|---|
| Simple voting | 4/7 | S-02, S-03, S-07 |
| Confidence-only | 6/7 | S-03 |
| Provenance-only | 6/7 | S-03 |
| Full contract | 7/7 | None |

The full contract's only demonstrated advantage over the two stronger baselines is S-03: three position records share one GPS failure domain and must not count as independent confirmation.

This is evidence that dependency semantics can change a decision in the designed case. It is not evidence that the improvement generalizes, justifies integration cost, or outperforms mature fusion and assurance systems.

## Baseline definitions

These are controlled ablations, not representations of every real system in the named fields:

- **Simple voting:** retains value, entity, and integrity admissibility but removes freshness and dependency semantics.
- **Confidence-only:** retains admissibility and freshness but treats qualifying records as independent.
- **Provenance-only:** removes derived records from evidence counting and retains root provenance, but ignores shared physical or infrastructure failure domains.
- **Full contract:** retains freshness, admissibility, derivation, and declared shared failure domains.

All paths use the same evaluator and fixtures. This prevents implementation-quality differences from becoming the result.

## Scenario interpretation

- S-02 and S-07 demonstrate the value of freshness. Simple voting permits both stale-evidence cases.
- S-03 demonstrates the incremental value of common-dependency semantics. All three ablations permit; the full contract revalidates.
- S-05 shows no unique advantage: every baseline refuses an admissible contradiction.
- S-06 shows no unique advantage: every baseline revalidates missing required evidence.
- S-01 and S-04 show all four systems permitting the valid cases in this small suite.

## New counterexample: A-06

The dependency algorithm has a converse failure. If a fused child cites two genuinely independent parent observations, union-find connects the child to each parent and thereby merges both roots into one component. The evaluator reports one effective lineage even though two independent roots exist.

This produces an unnecessary `REVALIDATE`: a false refusal/revalidation caused by treating derivation connectivity as mutual dependence.

Correct semantics must distinguish:

- **derivation:** a child adds no new independent root evidence;
- **shared failure:** roots may be dependent for a specified property;
- **root support count:** a fused child with two independent roots preserves two roots rather than collapsing them;
- **unresolved ancestry:** a declared but unavailable parent still fails closed.

A dependency graph cannot be modeled correctly as undirected connected components alone.

## Strongest counterargument

The suite was authored to express the proposed mechanism, so the full contract has a structural home-field advantage. S-03 is the only test separating it from the stronger baselines. One constructed common-GPS case does not establish operational value.

The baselines are semantic ablations, not production-grade competitors such as covariance-intersection fusion, safety monitors, or vendor C2 systems. This result must not be described as outperforming those fields.

## Discriminating next work

1. Replace undirected union-find with explicit root-lineage traversal plus typed shared-failure relationships.
2. Require A-06 to preserve two independent roots while A-03 still collapses shared-GPS support to one.
3. Add partial-dependency, cross-claim evidence, simultaneous unknown/contradiction, and valid degraded-operation cases.
4. Measure false permission and false refusal separately; a gate that prevents every action is safe but useless.
5. Only then compare against a stronger conservative-fusion baseline using unknown-correlation handling.

## Verdict

**Continue narrowly.** Freshness and common-dependency information prevent unsafe permission in authored cases. The current dependency model is not yet correct: A-06 shows it can destroy genuine independence and cause unnecessary revalidation.

The next priority is dependency semantics, not more product surface.
