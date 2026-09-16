---
name: reality-product-standard
description: Apply the standing Reality product, design, engineering, and evidence standard whenever building, changing, reviewing, debugging, or declaring completion of the Reality control plane, website, workflows, integrations, or user experience. Use it for product and architecture decisions that affect what a user can actually do; skip it for unrelated repository maintenance or pure research that does not change the product.
---

# Reality Product Standard

Build the best credible version of Reality: sophisticated inside, simple outside, grounded in reality, and honest about what remains unknown.

## Read the current state first

Before material product work, read these repository files in order:

1. `../../../ai/CONTEXT.md`
2. `../../../ai/OPERATING_CONSTITUTION.md`
3. `../../../product/REALITY_CONTROL_PLANE.md`

Treat them as authoritative. If implementation, copy, or an older prototype conflicts with them, do not preserve the conflict for visual or historical consistency.

## Protect the product identity

- Build one Reality Control Plane with two visible pillars: **Reality Data** and **Agent Economics**.
- Preserve the shared chain: `claim -> evidence -> source -> action -> outcome -> economic consequence`.
- Keep Reality Audit inside the workflow as verification logic. Do not expose it as a separate public product or navigation destination.
- Keep the working product at the public entry point. Keep Discovery Story secondary and optional.
- Treat Palantir and other strong products as architectural or interaction references, never as identities to copy or claims of equivalence.
- Do not collapse Reality into a generic dashboard, generic SaaS wrapper, static report, or marketing page.

## Require a real functional loop

Every primary workflow must complete this loop:

```text
real input
-> running process
-> visible state
-> persisted output
-> clear next action
```

For each workflow, identify:

- the accountable user;
- the decision or job they are trying to complete;
- the real input or integration;
- the state transitions;
- the evidence required before action;
- the output and where it persists;
- the failure modes and recovery path;
- the next useful action.

Do not present sample data, a prefilled simulation, an endpoint list, or a compiled screen as proof that the product works. If a required external integration is unavailable, build the honest boundary, label the experience `SANDBOX`, `SIMULATED`, or `NOT CONNECTED`, and state exactly what remains missing.

## Make the interface professional

- Make the first screen answer three questions quickly: what this is, what the user can do now, and what happens next.
- Use strong hierarchy, restrained color, deliberate typography, consistent spacing, meaningful empty states, and clear system status.
- Keep advanced reasoning, policy, provenance, and diagnostics inspectable without placing all complexity on the first screen.
- Prefer progressive disclosure and guided actions over long explanatory copy.
- Use motion only to communicate state, direction, feedback, or personality. Respect reduced-motion settings.
- Make desktop and mobile layouts intentional. Preserve keyboard use, readable contrast, focus states, semantic labels, and useful error messages.
- An original robotic pet may guide contextually, but it must never cover controls, repeat page copy, or substitute for a working journey.
- Blend proven interaction principles from strong products; do not copy their brand, layout wholesale, text, or proprietary visual identity.

## Preserve epistemic integrity

- Distinguish `EVIDENCE`, `INFERENCE`, `HYPOTHESIS`, `DECISION`, and `UNKNOWN` in data and interface language.
- Never turn missing confirmation into confirmation.
- Preserve source, time, freshness, relevance, provenance, dependencies, contradictions, and uncertainty as information moves toward action.
- Do not accept a caller-provided `VERIFIED` label as proof.
- Do not invent customers, integrations, outcomes, savings, validation, or production readiness.
- Ensure public claims describe what the current system demonstrably does, not the intended future architecture.

## Instrument each phase

Divide material workflows into named phases. Each phase must leave a durable checkpoint containing the relevant:

- input and output;
- state and timestamp;
- evidence and assumptions;
- health signal;
- failure reason;
- retry or escalation path.

When something fails, the operator should be able to locate where the failure entered, how it propagated, and why it was or was not caught. Persist important product and architecture decisions in the repository rather than relying on chat history.

## Build in this order

1. **Orient** — confirm the current architecture, evidence, constraints, and unresolved question.
2. **Define the job** — name the user, decision, input, consequence, and completion event.
3. **Choose the smallest real slice** — select one end-to-end workflow that can change a real decision.
4. **Model states and failure** — define transitions, unknown states, checkpoints, and recovery before polishing UI.
5. **Implement the full loop** — connect input, processing, persistence, output, and next action.
6. **Design the experience** — make the working loop calm, legible, responsive, and guided.
7. **Attack it** — test missing evidence, stale evidence, denied authorization, execution failure, malformed input, retry, and refresh/reload persistence.
8. **Verify visually** — inspect the actual rendered product on desktop and mobile, including empty, loading, error, success, and reduced-motion states.
9. **Record the truth** — update authoritative context or decisions when architecture, capability, or evidence changed.

## Definition of done

Do not call a feature, phase, or V1 complete until all relevant statements are true:

- A new user can identify the first action without verbal help.
- The workflow accepts a real user-controlled input or clearly labeled sandbox input.
- A real process runs and exposes its current state.
- The result is persisted and survives refresh where persistence is part of the promise.
- The interface gives the next action, not a dead end.
- Failures are visible, localized, and recoverable or explicitly terminal.
- Evidence and uncertainty remain attached to the decision and outcome.
- Primary navigation has no dead, stale, or misleading destinations.
- The feature works on the supported desktop and mobile layouts.
- Relevant automated checks pass, and the rendered experience has been inspected.
- Capability and validation claims match current evidence.

If any required statement is false, report the exact boundary: `ENGINE ONLY`, `PARTIAL WORKFLOW`, `SANDBOX`, `UNVALIDATED`, or another precise status. Then continue with the highest-leverage missing step instead of decorating the incomplete surface.

## Review output

When reviewing Reality work, lead with the observed user outcome. Then report:

1. what works end to end;
2. what only appears to work;
3. the highest-risk break in the evidence or action chain;
4. the smallest next change that closes that break;
5. the verification performed and the remaining unknowns.

Prefer one working, inspectable journey over many impressive but disconnected surfaces.
