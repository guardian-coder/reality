# Can More Capable AI Eliminate the Reality Bottleneck?

## A falsification request from Project Reality

Project Reality is an open investigation into a question that became more important as our work progressed:

> When AI becomes substantially more capable, does reliable action in the physical world still require an external evidence and control layer, or does the model absorb that function too?

We are not asking for endorsement or claiming that we have discovered a new field. We are asking for the strongest technical argument against our current direction.

## How we arrived here

The project began with a one-person-business question: what could one person build as AI becomes increasingly powerful and broadly accessible?

We stopped optimizing around what would be easy for one person to execute. Instead, we looked for a constraint that stronger intelligence would not automatically remove.

Across safety incidents in unrelated cyber-physical systems, we found a recurring failure shape: missing confirmation was allowed to become implied confirmation, or several apparently independent evidence sources shared the same hidden dependency. As information moved from sensing to interpretation to decision and action, uncertainty, provenance, freshness, or dependence could disappear.

This produced a working hypothesis we call **Epistemic Continuity**:

> A transformation should not increase action-relevant certainty unless new authenticated, claim-relevant, sufficiently independent evidence has entered the system. If required epistemic information cannot be preserved or verified, the affected state should remain or return to `UNKNOWN`.

## What we built

We reduced the hypothesis to a small experimental mechanism: a **Claim–Evidence–Action Contract**.

For one consequential action, the contract represents:

- the claims that must be true;
- the evidence supporting or contradicting each claim;
- source lineage, freshness, and common dependencies;
- explicit `CONFIRMED`, `CONTRADICTED`, and `UNKNOWN` states; and
- an action disposition such as `PERMIT`, `REVALIDATE`, `HUMAN_REVIEW`, or `REFUSE`.

We built a deterministic evaluator and attacked it with adversarial cases. Those tests corrected several control-flow and lineage errors, but they exposed a deeper problem: the evaluator is only as trustworthy as its dependency metadata.

Missing, mislabeled, or fabricated metadata produced both false permissions and false denials. A writable `VERIFIED` marker could itself be forged. In a separate real-document experiment, one careful reviewer identified a shared dependency in their findings and then dropped it while translating those findings into action rules. The fact existed; the transformation lost it.

Our first product-validation slice, **Reality Audit**, now tests whether those losses can be made visible in a shadow-mode review of an IoT decision. It is still a curated prototype, not a validated product.

## The strongest objection

A more capable model may be able to reconstruct claims, dependencies, uncertainty, and action rules directly from raw records. If so, Reality Audit may become a temporary feature rather than durable infrastructure.

We currently distinguish two kinds of uncertainty:

1. **Inferential uncertainty:** uncertainty caused by limited reasoning over information that already exists. More capable AI may reduce or eliminate this.
2. **Reality uncertainty:** uncertainty caused by missing observations, unauthenticated evidence, stale measurements, identity ambiguity, common-cause dependencies, or absence of post-action verification. Intelligence alone may not remove this without acquiring new evidence from outside the model.

That distinction is plausible, but it is not yet established.

## The question we want you to attack

Assume a frontier model is far more capable than today's systems, can inspect every available digital record, can reason across long dependency chains, and can author its own assurance logic.

> What part of the proposed evidence-to-action boundary still has to exist outside the model, if any?

We would especially value criticism of these possibilities:

- the model can absorb the entire function, making the proposed layer unnecessary;
- existing agent infrastructure or assurance architectures already solve the problem end to end;
- authenticated evidence acquisition remains external, but action gating does not;
- the mechanism merely relocates the hard problem into metadata authorship and trust;
- the cost of maintaining evidence and dependency semantics exceeds the value of fewer decision errors; or
- a different framing better describes the real invariant.

## What would change our direction

We would narrow or abandon the thesis if sufficiently capable AI can reliably infer every action-relevant dependency from ordinary available data, detect missing or falsified evidence without an independent trust boundary, and verify real-world outcomes without requiring new observation.

We would continue if external evidence acquisition, authentication, independence, action authorization, or outcome verification remains necessary even after reasoning capability is no longer the bottleneck—and if that need can be made repeatable and economically useful.

## Current limits

- No live operational system has been connected.
- No customer, payer, or procurement path has been validated.
- The public bridge example is historical and simulated; it does not certify a real bridge decision.
- Metadata authenticity and completeness remain unsolved.
- Novelty survives only weakly to moderately because many components already exist in safety engineering, provenance, sensor fusion, runtime assurance, and related systems.

## Public material

- Research repository: https://github.com/guardian-coder/reality
- Public discovery story and prototype: https://reality-open-research.lub72009.chatgpt.site

Project Reality is led by Brayan Lucas Mwangimba as an open research effort with AI collaborators. We welcome a direct answer that the idea is already solved, wrongly framed, or unlikely to matter.
