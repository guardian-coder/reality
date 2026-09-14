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

## Product boundary

Agent Economics must not become generic or vertical SaaS that a stronger model can recreate. Its position is a cross-cutting control plane: as agent runs, model calls, tools, APIs, and autonomous workflows multiply, the need to connect resource consumption to externally evidenced outcomes grows with them.

The V1 therefore integrates with the customer's runtime and outcome systems. It does not ask a human to retype execution data into a dashboard.

## V1 contract

```text
TASK
→ RESOURCE ENVELOPE
→ PRE-ACTION AUTHORIZATION
→ EXECUTION TRACE
→ OUTCOME EVIDENCE
→ ACCEPTANCE GATE
→ ECONOMIC RECORD
```

The first functional slice freezes the task contract for each run, evaluates proposed paid actions against the remaining resource envelope, and issues a permit or refusal before execution. A permit is bound to one action identity, cost ceiling, task, and run; it cannot be consumed twice. The system then accepts permitted resource events and separately accepts outcome evidence. Shared task and run identifiers preserve the economic chain, and the engine persists a policy-versioned economic record. An outcome is not accepted when required evidence is missing or contradicted.

## Current implementation

The integration console is available under `site/app/economics/`. It creates a persistent workspace, issues a one-time integration key stored only as a hash, exposes pre-action authorization plus execution and outcome ingress, records incoming events, and persists a policy-versioned economic record. The interface opens on the connection workflow rather than a prefilled result.

## Explicit limits

- The generic HTTP connector is real, but no provider-specific adapter is built yet.
- Outcome value is a contract input, not independently verified.
- Evidence identity and authenticity are not cryptographically verified.
- A bearer token authenticates ingestion, but the external source behind an event is not yet attested.
- The resource gate accounts for consumed and reserved permits, but strict concurrent reservation serialization has not been proven under production load.
- Policy versioning is present, but automatic policy learning and controlled self-correction are not implemented.
- There is persistence and owner-gated workspace access, but no team authorization model.
- There is no proven buyer or willingness to pay.
- “Cost per verified accepted outcome” is a candidate control metric, not a validated universal measure of agent value.

## Next validation threshold

Connect one real agent run and one real business-system outcome webhook. Require the agent to request authorization before every paid action. Test whether the operator can define success criteria without the project inventing those semantics, whether the gate safely refuses an over-budget action, and whether the resulting economic record changes a real stop, reroute, or scaling decision.
