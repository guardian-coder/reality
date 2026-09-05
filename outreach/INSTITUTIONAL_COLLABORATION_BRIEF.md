# Institutional Collaboration Brief

## Why we are reaching out

Reality is an open research project asking a narrow question:

> When an intelligent system is about to take a consequential action, how do we prevent uncertainty, provenance, and shared evidence dependencies from disappearing between observation and action?

We are not presenting a finished product or asking an institution to validate our thesis. We want researchers and practitioners to help us find where the idea is wrong, already solved, or worth testing more seriously.

## What we have done

We began with a broad thesis: as intelligence becomes cheaper, reliable interaction with physical reality may remain scarce. We then reduced that thesis into a testable mechanism—a Claim–Evidence–Action Contract.

The current prototype represents required claims as `CONFIRMED`, `CONTRADICTED`, or `UNKNOWN`, preserves evidence lineage and freshness, and gates action as `PERMIT`, `REVALIDATE`, `HUMAN_REVIEW`, or `REFUSE`.

The prototype is deliberately small and non-weaponized. Its main scenario is a simulated logistics vehicle deciding whether it may cross a bridge.

Repeated falsification changed our focus. The evaluator's basic control flow now passes its defined scenarios, but trustworthy dependency metadata is the harder problem. In one experiment, two independent reviewers found much of the same dependency structure in a real FHWA bridge-monitoring report. One reviewer identified a shared dependency in their findings and then dropped it when converting those findings into action rules.

That result does not prove a product or a new scientific field. It gives us a sharper research question: how can claim-relevant dependency knowledge be extracted, checked, maintained, and carried into runtime decisions without silently losing what is unknown?

## What we would value from a research conversation

We would be grateful for a short technical conversation about any of these questions:

- Which established field or architecture already handles this end to end?
- Where do uncertainty, provenance, freshness, and common-cause dependencies typically disappear in real systems?
- How are evidence-dependency models authored and maintained today?
- Is the findings-to-rules compression failure already addressed by assurance cases, digital engineering, runtime assurance, or another established practice?
- What would be the smallest credible experiment that could disprove our current direction?

## What we are not asking for

- endorsement;
- funding;
- access to controlled or sensitive systems;
- weapon-targeting or autonomous-attack work;
- confirmation that our mechanism is novel.

Our current boundary is assurance: evidence provenance, uncertainty, state integrity, revalidation, and outcome verification.

## Who is behind the work

I am Brayan Lucas Mwangimba. I am developing Reality as an open research journey with AI collaborators, using the public repository as the durable record of evidence, disagreements, failed tests, and decisions.

Repository: https://github.com/guardian-coder/reality

