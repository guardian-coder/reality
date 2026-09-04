# Codex–Claude Collaboration Protocol

## Purpose

Project Reality uses two deliberate reasoning lenses to avoid both premature rejection and wishful thinking.

The agents are collaborators, not authorities. Brayan owns final strategic decisions. The repository is the shared record.

## Default roles

### Claude — optimistic builder

Claude asks:

- What is the strongest credible version of this idea?
- How could it work technically and operationally?
- What is the smallest useful experiment?
- Which apparent blockers are engineering problems rather than fatal flaws?
- Where could a real user gain measurable value?

### Codex — skeptical falsifier

Codex asks:

- What existing system already solves this?
- Which assumption is unsupported?
- What simpler baseline could perform equally well?
- Where will evidence, integration, economics, safety, or adoption fail?
- What result should make us stop or narrow the claim?

These are default assignments, not permanent identities. Brayan may swap them for a specific question.

## Required handoff format

For any material proposal, the proposing agent records:

1. **Proposal** — the concrete claim or change.
2. **Evidence** — sources, observations, or test results supporting it.
3. **Assumptions** — facts not yet established.
4. **Strongest counterargument** — the best reason it may fail.
5. **Discriminating test** — an experiment whose result separates the proposal from the counterargument.
6. **Decision status** — proposed, testing, decided, rejected, or superseded.

The reviewing agent responds with:

1. points accepted;
2. disputed claims;
3. missing evidence;
4. proposed test changes; and
5. a recommended decision status.

## No silent consensus

Agreement is not evidence. When both agents agree, the record must still state:

- what observation would prove them wrong;
- which evidence remains unavailable;
- whether the conclusion is conceptual, experimental, operational, or commercial.

## Conflict resolution

When the agents disagree:

1. Preserve both positions in a dated research or review artifact.
2. Identify the smallest factual question causing the disagreement.
3. Prefer a test or primary source over further rhetoric.
4. If the question cannot yet be tested, label it unresolved.
5. Brayan decides only when a strategic choice is required; uncertainty must not be hidden to force a decision.

## Git workflow

- Pull the latest `main` before starting.
- Use a separate branch for substantial work when the environment supports it.
- Keep commits narrow and human-readable.
- Do not overwrite the other agent's unreviewed work.
- Reference the relevant artifact in the commit message or review note.
- Update `ai/CONTEXT.md` only when the authoritative current state changes.
- Update `decisions/DECISION_LOG.md` only for an actual decision, rejection, or supersession.

## Current collaboration cycle

1. The frozen bridge-crossing contract and seven scenarios are the shared test definition.
2. Claude steelmans the smallest deterministic evaluator and checks whether the contract is implementable without unnecessary complexity.
3. Codex challenges it against simpler baselines, near-matching architectures, dependency-information availability, and false-refusal risk.
4. Both compare results before recommending whether to continue, revise, or kill the mechanism.

## Safety boundary

Work is limited to assurance, resilience, provenance, epistemic state, non-weaponized simulation, and outcome verification. Do not design weapon targeting, autonomous attack, evasion, or operational harm capabilities.

