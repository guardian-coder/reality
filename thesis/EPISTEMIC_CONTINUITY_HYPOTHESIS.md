# Epistemic Continuity Hypothesis

## Status

Abductive hypothesis. Not established as novel, correct, valuable, or buildable.

## The surprising pattern

Several Project Reality findings share a shape even though they arose at different layers:

- historical systems acted after missing confirmation had silently become sufficient confirmation;
- apparently separate evidence sources shared one underlying failure mode;
- the evaluator behaved correctly only when dependency metadata was complete and trustworthy;
- a reviewer identified a dependency in findings and then omitted it while translating those findings into rules;
- a real failure changed form over time in a way the fixed vocabulary could not represent cleanly.

The common problem may not be poor truth estimation alone. It may be loss of action-relevant meaning when information crosses a representation boundary: observation to evidence record, evidence to state estimate, findings to rules, rules to action permission, or outcome back to the model.

## Abductive hypothesis

> Consequential systems need epistemic continuity: uncertainty, provenance, freshness, dependence, scope, and contradiction must remain attached to a claim as that claim is transformed and used to authorize action.

This suggests a candidate **Epistemic Conservation Rule**:

> A transformation must not increase action-relevant certainty unless it introduces new, authenticated, claim-relevant, and sufficiently independent evidence. If the required epistemic information cannot be preserved or verified, the downstream state must not be treated as more certain; for the affected decision it remains or returns to `UNKNOWN`.

This is not proposed as a law of probability or information theory. It is a candidate engineering invariant for decision pipelines.

## What the rule would forbid

- Converting “no contrary evidence” into positive confirmation.
- Counting two observations as independent when their relevant roots share a failure mode.
- Turning a probabilistic or qualified model output into an unqualified claim merely because a downstream interface cannot carry uncertainty.
- Dropping a known dependency when findings are compressed into executable rules.
- Treating absent, unauthenticated, or unrepresentable dependency information as proof of independence.

## What the rule would allow

Certainty may legitimately increase when a transformation adds evidence that is:

- relevant to the specified claim;
- sufficiently fresh for the specified decision;
- bound to the correct entity and predicate;
- traceable to resolved lineage;
- independent with respect to the failure property that matters;
- authenticated strongly enough for the decision's cost of error.

Ordinary inference may also improve an estimate without new observation. The open question is whether that improved estimate is sufficient to authorize a consequential action. The rule therefore concerns **action-relevant certainty**, not every mathematical update inside a model.

## Candidate mechanism

A possible mechanism is an **Epistemic Compiler**. It would translate a domain decision into:

> required claims → evidence contracts → dependency coverage → explicit epistemic states → enforceable action dispositions

Like a compiler, it would check whether meaning required at the source survives into the executable representation. It would not decide domain truth by itself. Domain experts would still define acceptable evidence, failure semantics, thresholds, and authority.

## Candidate first service

An **Epistemic Continuity Audit** could examine one consequential decision and identify where action-relevant meaning is weakened or lost across its pipeline. It would produce:

- the decision and required-claim map;
- evidence lineage and shared-dependency map;
- transformation-boundary coverage table;
- explicit unknown and contradiction states;
- false-permission and false-refusal tests;
- comparison with the existing process.

This is closely related to the proposed Decision Evidence Audit. The new name should replace the old one only if tests show the continuity framing is clearer and materially more useful.

## Discriminating tests

1. **Representation-boundary test:** Give one case to separate teams responsible for findings, rules, and action logic. Measure whether uncertainty and dependencies survive each handoff.
2. **No-new-evidence test:** Transform a qualified claim through several realistic formats. Fail the mechanism if its action-relevant certainty increases without new qualifying evidence.
3. **Legitimate-update test:** Add fresh independent evidence. Fail the mechanism if the rule prevents a justified increase in certainty.
4. **Existing-practice comparison:** Compare against safety cases, assurance cases, runtime assurance, data provenance, digital engineering, and conservative fusion. Kill any claim of a separate mechanism if established practice already preserves and enforces the same semantics end to end.
5. **Real-decision value test:** Run a bounded historical or simulated institutional case. Continue only if the method finds a material gap or prevents a meaningful error without unacceptable false refusal or authoring cost.

## Kill conditions

Narrow, rename, integrate, or abandon this hypothesis if:

- “epistemic continuity” merely renames a well-established end-to-end mechanism;
- the proposed rule cannot distinguish legitimate inference from unjustified certainty inflation;
- required metadata cannot be authored, authenticated, or maintained at acceptable cost;
- the audit adds no decision value beyond existing expert practice;
- false refusals outweigh the errors it prevents.

## Current conclusion

Project Reality has not discovered a finished solution. It has produced a stronger candidate explanation linking its prior evidence: **the bottleneck may be preventing action-relevant epistemic meaning from being lost across transformations**. The Epistemic Conservation Rule, Epistemic Compiler, and Epistemic Continuity Audit are names for testable possibilities, not claims of novelty.
