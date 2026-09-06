# Project Reality

## Proposal for collaborative validation of evidence-based action assurance

**Status:** Draft for review. Not yet sent to any institution.

**Intended audience:** An engineering or assurance research partner working with an infrastructure operator.

**Proposed starting format:** A bounded pilot using historical, simulated, or otherwise non-operational material.

## Why this project began

Project Reality did not begin inside a laboratory or from a predetermined product idea. It began with a personal question from Brayan Lucas Mwangimba, a Tanzanian Medical Laboratory Technologist exploring how one person could build a meaningful company during the rise of artificial intelligence:

> If AI becomes one of the most powerful and widely accessible technologies in the world, what important capability underneath it will remain difficult?

The first instinct was to search for a “holy grail” business that one person could execute. That constraint was deliberately removed as the research became more serious. The question changed from *what can one person build now?* to *what infrastructure may become more important as intelligence becomes more capable?*

This led to a broad hypothesis: intelligence can analyse, infer, plan and act through software, but consequential decisions still depend on whether a system’s internal representation corresponds to current reality. The early name for this gap was a **missing protocol between intelligence and reality**. Later work called the broader problem **Reality Coupling**.

Those phrases were useful directions, but they were too broad to constitute a mechanism or a company. The project therefore adopted a falsification-first approach: assume AI becomes dramatically more capable and examine what uncertainty survives.

## The path from a broad idea to a testable problem

The first practical wedge was **Decision-Grade Financial Truth for small and medium enterprises**. It exposed a useful distinction: a transaction proves that money moved, but does not by itself establish why it moved or what it means about the economic state of a business. That work remains relevant, but it risked reducing the larger problem to ordinary financial analysis.

The project then ran a “100× AI” thought experiment across unrelated domains. If AI could analyse every available digital record extremely well, what consequential decisions would still require evidence from outside those records? Healthcare still requires measurements of a patient’s present biological state. Logistics still requires evidence that particular goods arrived in the stated quantity and condition. Infrastructure still requires evidence that physical assets exist, operate and remain within safe limits. Stronger inference cannot create an observation that was never made.

Connected battlefield systems—the Internet of Battlefield Things—were selected as the first demanding research environment because they combine heterogeneous sensors, changing physical conditions, disrupted communication, adversarial evidence and high costs of error. The project’s safety boundary has remained assurance, resilience, provenance and uncertainty. It does not cover weapon targeting or autonomous attack capability.

An atlas of nine documented failures across aviation, spacecraft, navigation, medical devices, autonomous vehicles and defence revealed two recurring patterns:

1. **Absence of confirmation can be treated as confirmation instead of remaining explicitly unknown.**
2. **Several agreeing sources do not provide independent confirmation when they share the same power, calibration, communication, physical or administrative failure mode.**

The deeper hypothesis became more precise:

> A system can become more certain than its evidence permits because uncertainty, provenance, freshness and dependence are weakened or discarded as information moves from observation to decision and action.

In plain language, a system may say “act” before it has established “this is true,” because the state “I do not know” disappeared along the way.

## The candidate mechanism

The current candidate is a **Claim–Evidence–Action Contract**.

A consequential action names the claims that must be established before it may proceed. Each claim is evaluated using evidence whose provenance, freshness, transformations, lineage and shared dependencies remain visible. The claim retains one of three explicit states:

- `CONFIRMED`
- `CONTRADICTED`
- `UNKNOWN`

The action gate then produces a disposition such as:

- `PERMIT`
- `REVALIDATE`
- `HUMAN REVIEW`
- `DEGRADE`
- `REFUSE`

The contract is not intended to replace domain engineering or decide what is true by itself. It asks a narrower question:

> Has the evidence required for this particular action actually been satisfied, and what uncertainty must remain visible if it has not?

## Why the problem matters

This project is not the first to recognise uncertainty, provenance, common-cause failure or runtime assurance. These are established areas of engineering and research:

- [DARPA Assured Autonomy](https://www.darpa.mil/research/programs/assured-autonomy) treats assurance as something that must be monitored and updated during operation.
- [NASA R2U2](https://www.nasa.gov/directorates/stmd/space-tech-research-grants/multi-platform-multi-architecture-runtime-verification-of-autonomous-space-systems/) monitors sensors, software and hardware for failures and rule violations in autonomous systems.
- The [NIST Cyber-Physical Systems Framework](https://www.nist.gov/publications/framework-cyber-physical-systems-volume-1-overview) addresses trustworthiness and interacting concerns across cyber-physical systems.
- The [NATO Data Quality Framework](https://www.nato.int/en/about-us/official-texts-and-resources/official-texts/2025/08/29/data-quality-framework-for-the-alliance) requires provenance, lineage and fitness-for-purpose information throughout the data lifecycle.
- [U.S. Army IoBT research](https://www.army.mil/article-amp/249169/ai_research_strengthens_certainty_in_battlefield_decision_making) addresses uncertainty, compromised sensors, disrupted communication and explainability in battlefield fusion.
- [Barycenter Systems](https://barycentersystems.com/runtime) publicly describes a commercial runtime with provenance, uncertainty, explicit unknowns, independent assurance and execution permits. It is the project’s strongest identified near-match.

This body of work establishes the importance of the surrounding problem. It does not establish that Project Reality’s proposed contract is new. Most of its components already exist. The open question is whether a reusable mechanism preserves claim-specific evidence requirements, evidence independence and explicit unknown state all the way into runtime action permission—or whether existing assurance practice already solves this adequately.

To challenge that question externally, Project Reality contacted Edward R. Griffor of the U.S. National Institute of Standards and Technology. His published work on cyber-physical-system trustworthiness and formal reasoning about dependencies closely overlaps the project’s unresolved specification-to-rule problem. The message invited correction and prior art; it did not ask for endorsement, funding or access to sensitive systems.

## What our experiments have established

Project Reality has built a small deterministic evaluator against a frozen machine-readable contract and scenario set. Successive adversarial reviews found both false-permission and false-refusal paths. The evaluator was corrected and rerun rather than judged only on favourable examples.

The strongest finding is also the strongest limitation.

When dependency metadata is missing, mislabeled, fabricated or unauthenticated, a logically correct evaluator can still issue an unjustified permission or refusal. A freely writable `VERIFIED` label does not authenticate the statement it describes.

A separate experiment asked independent reviewers to extract dependency rules from a real Federal Highway Administration bridge-monitoring report. The reviewers substantially agreed on the system’s dependency structure. However, one reviewer explicitly identified a shared dependency in the findings and then omitted it when translating those findings into actionable rules. This is direct evidence that meaning known during analysis can disappear during representation change.

The project has therefore moved beyond asking whether uncertainty exists. It is now asking whether evidence sufficiency for action can be represented, authored and enforced reliably enough to be useful.

## What has not been established

We do not yet claim that:

- the Claim–Evidence–Action Contract is a new infrastructure category;
- the current evaluator is a deployable safety system;
- the method improves a real institution’s decision process;
- dependency metadata can be produced and authenticated at an acceptable cost;
- a customer will pay for the work;
- the mechanism generalises across industries.

These are the questions a real collaboration should test.

## Proposed collaboration

We propose a bounded **Decision Evidence Audit** around one existing consequential decision. A suitable first setting is bridge inspection or maintenance, but the method can be evaluated in another non-weapon infrastructure domain where the partner has stronger access and expertise.

The pilot would use historical, simulated, published or otherwise non-operational material. It would not control a live system or replace the responsible engineer’s judgement.

Together, we would:

1. Select one clearly defined decision and identify the cost of a false permission and a false refusal.
2. Identify the real-world claims that must hold before that decision is justified.
3. Map the evidence used for each claim, including provenance, freshness, transformations and known shared dependencies.
4. Translate those findings into explicit action rules.
5. Construct failure cases that test missing, stale, contradictory, dependent and misleading evidence.
6. Compare the proposed contract with the partner’s existing process.
7. Record where the contract helps, where it adds unnecessary friction, and where it fails.

## What we are asking from a partner

We are seeking:

- one domain expert who understands the selected decision;
- one bounded historical or simulated decision case;
- permission to model the case without exposing sensitive operational information;
- critical review of our claim, evidence and dependency mapping;
- an honest comparison with existing assurance, inspection or audit practice.

We are not asking the partner to accept the thesis in advance. A result showing that the method adds no value, duplicates existing practice or creates unacceptable false refusals would be a useful outcome.

## What Project Reality brings

Project Reality brings:

- a documented research trail from the original thesis to the current mechanism;
- an open Claim–Evidence–Action schema and deterministic evaluator;
- frozen scenarios and adversarial falsifiers;
- a dependency-mapping method;
- a decision-to-rule coverage approach under active testing;
- explicit kill criteria and a commitment to record contrary evidence.

The partner brings the domain knowledge, real constraints and accountability that a general research project cannot invent.

## Pilot outputs

The collaboration would produce:

- a decision and claim map;
- an evidence-lineage and dependency map;
- an explicit record of unknown, contradictory and insufficient states;
- a small set of executable or mechanically checkable action rules;
- false-permission and false-refusal test results;
- a comparison with the existing decision process;
- a short report stating what survived, what failed and what should happen next.

Any public output would be agreed with the partner and stripped of sensitive operational information.

## Decision rule

The pilot supports continued work only if the method identifies a material decision risk or preserves important uncertainty that the existing process loses, while avoiding an unacceptable level of unnecessary refusal.

If established practice already captures the same information and enforces it reliably, Project Reality should narrow, integrate with that practice or stop claiming a separate mechanism.

## Why collaborate now

The project is mature enough to present a specific, testable mechanism and its known weaknesses. It is not mature enough to validate itself.

The most useful next step is therefore not broader promotion. It is a small collaboration in which domain experts can examine the method against a decision they understand and tell us where it is correct, incomplete or unnecessary.

Project repository: [github.com/guardian-coder/reality](https://github.com/guardian-coder/reality)

Public research journal: [reality-open-research.lub72009.chatgpt.site](https://reality-open-research.lub72009.chatgpt.site)

---

**Founder:** Brayan Lucas Mwangimba

**Project:** Reality

**Location:** Tanzania
