# Agent Economics V1

## Decision status

This is the selected first product direction as of 2026-09-13. It is a build-and-validation decision, not evidence of market demand.

## Product claim

Agent Economics V1 tests whether every resource consumed by an AI agent can be linked to an accepted outcome supported by inspectable evidence.

It does not ask only, “How much did the agent spend?” It asks:

> What accepted result did the agent produce, what evidence supports that result, and what resources did it consume?

## Relationship to Project Reality

The Reality work becomes the evidence substrate. Claims, provenance, freshness, dependencies, contradictions, and uncertainty support the determination that an outcome is accepted. Agent Economics is the economic control layer above it.

Palantir is an architectural analogy only: connect fragmented operational records into meaningful objects and relationships, then build governed operational workflows above them. Reality must not imitate Palantir's product, design, customer claims, or proprietary implementation.

## V1 contract

```text
TASK
→ RESOURCE ENVELOPE
→ EXECUTION TRACE
→ OUTCOME EVIDENCE
→ ACCEPTANCE GATE
→ ECONOMIC RECORD
```

The first slice uses one simulated digital invoice-dispute workflow. The task contract and success criteria exist before execution. Model, tool, and API costs are metered. An outcome is not accepted when the resource envelope is exceeded, required evidence is missing, or evidence is contradicted.

## Current implementation

The interactive slice is available under `site/app/economics/` and uses a deterministic economic evaluator in `site/lib/economic-engine.ts`. A user can change the resource envelope, remove or restore evidence, evaluate the outcome, inspect phase-local failure signals, and export the machine-readable economic record.

## Explicit limits

- The workflow and costs are simulated.
- Outcome value is a contract input, not independently verified.
- Evidence identity and authenticity are not cryptographically verified.
- There is no live OpenAI, Anthropic, billing, CRM, or customer integration.
- There is no persistence, multi-user control, or proven buyer.
- “Cost per verified accepted outcome” is a candidate control metric, not a validated universal measure of agent value.

## Next validation threshold

The next build must not add broad dashboard features. First test whether an operator can define one real digital task, its success criteria, its evidence, and its resource envelope without the project inventing those semantics for them. Then compare the resulting record with the operator's current way of deciding whether the agent produced value.
