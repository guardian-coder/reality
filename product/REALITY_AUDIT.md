# Reality Audit

## What it is

Reality Audit is the first buildable product experiment from Project Reality.

It audits one consequential action inside an IoT system. It asks what must be true before that action is allowed, what evidence supports each required claim, which evidence shares a hidden dependency, where uncertainty was lost, and whether the resulting action should be permitted, revalidated, reviewed by a person, or refused.

This is not yet a safety-certified product. It is a shadow-mode audit workspace for discovering whether the method catches important decision gaps without creating too many false refusals.

## The first seven phases

1. **Decision scope** — freeze the exact action, target asset, consequence, and decision boundary.
2. **Source intake** — register documents, records, sensors, timestamps, and provenance.
3. **Claim map** — state the claims that must hold before the action is justified.
4. **Dependency coverage** — trace evidence to root lineages and shared failure domains.
5. **Action rules** — connect claim states to permit, revalidate, human-review, or refuse outcomes.
6. **Attack lab** — inject stale, dependent, contradictory, missing, or misbound evidence.
7. **Decision report** — export the disposition, reasons, health state, and checkpoint memory.

## Built-in health sensors

- Grounding coverage
- Freshness
- Entity binding
- Lineage resolution
- Evidence independence
- Rule coverage

Each sensor points back to a phase and category. The purpose is diagnostic: when an audit fails, we should know where the meaning broke, not merely that the final answer changed.

## Current vertical slice

The web application now contains a public bridge-monitoring demonstration with four scenarios:

- healthy baseline → `PERMIT`
- stale inspection → `REVALIDATE`
- shared dependency → `HUMAN REVIEW`
- wrong asset identity → `REFUSE`

The visible action gate, claim states, integrity sensors, failure locator, and audit-memory ledger change together. The record can be exported as JSON. The same scenario journey is also exposed as structured browser actions for compatible AI clients.

## What is real and what is simulated

- **Real:** the product workflow, phase structure, health signals, state transitions, and inspectable memory.
- **Simulated:** the current decision contract and injected outcomes in the public bridge demonstration.
- **Not yet built:** document ingestion, automatic claim extraction, persistent multi-user storage, authentication, customer-specific rule authoring, and connection to live IoT systems.
- **Not yet proven:** that integrators will pay, that engineers can author the metadata reliably, or that the audit reduces unsafe permissions without unacceptable false refusals in practice.

## Next build threshold

Do not add breadth merely to make the interface look complete. The next meaningful increment is one real document-to-report journey in shadow mode, used by an independent engineer. Their corrections, time spent, missed dependencies, and final decision differences become the evidence for what to build next.
