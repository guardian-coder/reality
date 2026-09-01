# The Candidate Primitive

## Working definition

> A repeatable, measurable process that transforms heterogeneous low-level evidence into a defensible claim about real-world state, with enough confidence, provenance, contradiction handling, and explicit uncertainty for a specified consequential decision.

In compact form:

> Signals → evidence → reconstructed state → confidence and contradictions → decision-grade claim

This chain contains three distinct capabilities:

1. **Information extraction:** finding relevant signals in large data flows.
2. **State estimation:** determining what is probably true about reality.
3. **Decision-grade verification:** establishing that the state claim is sufficiently defensible for a consequential action.

They are related but not interchangeable. The primitive is not merely information extraction; the open thesis is whether state estimation and especially decision-grade verification remain difficult as AI improves. See [INVARIANT_TESTS.md](INVARIANT_TESTS.md).

## Decision-relative sufficiency

Decision-Grade Truth is not absolute truth or a complete description of reality. It is evidence sufficient for a particular decision under that decision's cost of error and required standard.

The same evidence may be sufficient for a small, reversible decision and insufficient for a large, irreversible, or safety-critical one. The required evidence should rise with the consequence of error.

## Required outputs

- the claim about real-world state;
- the decision the claim is intended to support;
- the underlying evidence and provenance;
- how evidence was interpreted and reconciled;
- contradictions and missing evidence;
- confidence or probability, where defensible;
- the applicable decision threshold;
- what new evidence would change the conclusion.

## Repeatability

The result should not depend solely on one person's intuition, memory, or experience. A qualified reviewer should be able to inspect the evidence chain, understand why the claim was produced, and reproduce or challenge it.

Repeatability does not mean removing human judgment. It means making judgment structured, inspectable, testable, and improvable.

## SME as the first laboratory

SME finance is not the primitive. It is the first laboratory for testing whether this process can reconstruct a defensible economic state from fragmented evidence and improve a consequential decision such as working-capital credit.

If the primitive cannot be demonstrated in this bounded setting, there is little basis for assuming it works in harder domains.

## Cross-domain hypothesis

The same abstract problem may appear in:

- military/intelligence, where large data flows must become actionable intelligence about a potential real-world state or event;
- health, where observations must support a clinical state claim before intervention;
- insurance, where evidence must support a risk or loss claim;
- supply chains, where records and physical evidence support claims about inventory, delivery, provenance, or disruption;
- robotics and physical systems, where sensor evidence supports a sufficiently reliable state estimate before action.

These are possible expressions, not validated markets or product decisions. Each domain has different evidence standards, error costs, regulation, and authority requirements.

## Boundary with trusted execution

This primitive concerns whether a real-world state claim is sufficiently supported for a decision. Trusted Execution / Delegated Authority concerns whether an actor is permitted to act, under what constraints, and how execution and resulting state are proven.

Current working architecture:

> Decision-grade state claim → authorized decision → constrained execution → evidence of resulting state

Whether these form one protocol or separate layers remains unresolved.
