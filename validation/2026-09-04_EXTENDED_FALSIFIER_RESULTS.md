# Extended Falsifier Results

- **Date:** 2026-09-04
- **Reviewed commit:** `6e90a55`
- **Status:** A-06 fixed; two second-wave cases pass; two architecture gaps remain

## Independent verification

- Frozen scenarios: 7/7 full matches.
- Adversarial A-01 through A-06: 0/6 reproduced.
- Baseline separation remains unchanged.

The A-06 fix is correct for the tested cases: derived evidence resolves to root observations, while shared failure domains—not mere derivation—collapse support.

## Error types measured separately

| System | Unsafe permits | False refusals on permit cases |
|---|---:|---:|
| Simple voting | 3 | 0 |
| Confidence-only | 1 | 0 |
| Provenance-only | 1 | 0 |
| Full contract | 0 | 0 |

These are counts across seven authored scenarios, not rates or general performance claims.

## Second-wave cases

### E-01 — Partial dependency: pass

Two GPS observations share one failure domain while a visual observation remains independent. The evaluator reports two effective lineages and permits: one GPS root group plus one visual root.

### E-02 — Simultaneous contradiction and unknown: pass

C-02 is contradicted while C-03 is unknown. The action is refused and both states remain visible. Contradiction priority does not erase missing-evidence state.

### E-03 — Cross-claim dependency visibility: gap

`onboard-camera-01` supports C-01, C-02, C-03, and C-04 in the baseline fixtures. Independence is evaluated within each claim, but `ActionDisposition` does not expose correlated support across claims.

This is not automatically a wrong disposition because the contract does not require independence between claims. It is an architecture gap: an action-level reviewer cannot see that several prerequisites share one physical failure domain.

### E-04 — Degraded operation: gap

A declared degraded mode has no effect; the evaluator returns `REVALIDATE`. `DEGRADE` exists in the vocabulary but has no contract schema or interpreter semantics.

A real degraded mode needs its own action limits, alternative evidence contract, expiry, and transition back to normal or refusal.

## Verdict

The root-lineage algorithm handles the tested full, shared, partial, unresolved, and derived cases. The next bottleneck has moved upward:

1. Is independence required only within claims, or across the full claim set authorizing an action?
2. How are degraded permissions prevented from silently widening into normal permission?
3. How are failure domains typed by affected property rather than string equality?

Do not expand the product until these questions have explicit contracts and counterexamples.
