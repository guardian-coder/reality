# Reality Control Plane

## Product direction

Reality is now being built as one working control plane with two visible pillars:

1. **Reality Data** — acquire fresh, specific, machine-readable claims about the world together with their sources and evidence.
2. **Agent Economics** — authorize resource use before an agent acts, record what it consumed, and connect that cost to an accepted outcome.

These are not two unrelated products. They share one evidence foundation:

```text
CLAIM
→ EVIDENCE
→ SOURCE
→ ACTION
→ OUTCOME
→ ECONOMIC CONSEQUENCE
```

The interface may use separate pages or workflows when that makes the work clearer. The architecture, identity, and records must remain connected.

## Internal verification

Reality Audit is no longer a destination in the product. It is the internal verification process used throughout the control plane.

When evidence enters the system, the process must inspect its source, time, freshness, relevance, provenance, dependencies, contradictions, and unresolved uncertainty. A caller cannot make an outcome true merely by labeling its evidence `VERIFIED`. The resulting claim must remain `UNKNOWN` when the required evidence is absent or cannot be trusted.

The intended working flow is:

```text
Need a current fact
→ acquire evidence
→ verify the claim
→ request permission to spend
→ execute the action
→ verify the outcome
→ record cost against the accepted outcome
```

## Product completion rule

The product is not complete when it only describes this flow or displays example records. Every primary surface must perform work:

```text
real input
→ running process
→ visible state
→ persisted output
→ clear next action
```

We must be able to connect a real agent or paid API, set a budget and policy, authorize or refuse its paid actions, log execution, receive outcome evidence, run the internal evidence checks, and inspect the resulting economic record. Prefilled demonstrations can support testing, but they cannot be presented as the working product.

## Public product structure

- The public entry point opens the working control plane.
- Reality Data and Agent Economics must both be visible and functional.
- Reality Audit must not appear as a standalone navigation destination.
- Discovery Story is the only research/history destination in the product navigation.
- An original robotic pet may provide contextual guidance. It must be its own character, not a renamed or visually recycled version of the former guide, and it must never substitute for a working interface.

## Discovery Story rule

Discovery Story must read as one clear journey, not a library or a long dashboard.

Each part should begin with what was actually known at that time. A question leads to an investigation; the next discovery answers that question and creates the next one. The final product direction must not be revealed as though it was known at the beginning. Use plain, understandable English, remove repeated navigation and duplicated summaries, and preserve the real uncertainty and changes of direction.

The story may feel adventurous, but it must not invent events, certainty, customers, or validation.

## Current boundary

The current Agent Economics engine supports credentials, pre-action authorization, execution ingestion, outcome ingestion, and persisted economic records.

Reality Data now has a first real acquisition boundary: an owner can register a named source category, choose a freshness window, receive a one-time source key, and send authenticated evidence through a generic HTTPS webhook. Reality derives the source lineage and freshness bound, evaluates the claim, persists the source, evidence, and claim, and exposes `WAITING / TESTED / LIVE` source states. A controlled in-product test is explicitly labeled as a connection test rather than proof of an external production integration.

This is a **partial workflow**, not universal plug-and-play integration. It works only for systems that can send the documented webhook contract. Provider-specific OAuth adapters, field mapping, secret rotation and revocation, signed provider attestations, multiple-source claim policies, and an independently operated production evidence source remain unimplemented or unvalidated. A real external agent, paid API, and independent outcome source have not yet been connected and validated together.
