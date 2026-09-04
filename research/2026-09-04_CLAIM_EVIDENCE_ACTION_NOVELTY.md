# Claim–Evidence–Action Contract: Novelty Falsification

- **Date:** 2026-09-04
- **Audience:** Project Reality
- **Decision:** Whether to treat a cross-layer runtime contract as a candidate first IoBT capability
- **Status:** Deep-research finding; public-source evidence only; no product or market validation

## Direct answer

The candidate **survives weakly to moderately**, not strongly.

The individual mechanisms are established prior art. Safety engineering has fail-safe states, interlocks, independence analysis, and common-cause analysis. Information fusion represents uncertainty and can fuse conservatively when correlations are unknown. Provenance standards preserve lineage. Runtime Assurance monitors properties and switches or restricts control. Command and authorization systems gate actions.

Public evidence also contains at least one **near-complete commercial architecture**: Barycenter Systems describes a provenance-aware, uncertainty-bearing world model, explicit unknown and contradiction states, an independent assurance function, execution permits, action mediation, outcome recording, and cross-component semantics. It reports a working reference implementation in private beta for space missions. This is a serious novelty constraint, although the claim is first-party, its deployment is not independently verified here, and its public description does not show claim-specific positive-confirmation contracts or a runtime graph of evidence independence/common dependencies.

The remaining candidate gap is narrower:

> A reusable runtime mechanism that binds each consequential action to explicit real-world claims; evaluates each claim from freshness-bearing provenance and modeled evidence dependencies; preserves `CONFIRMED`, `CONTRADICTED`, and `UNKNOWN` end-to-end; and enforces `PERMIT`, `DEGRADE`, `REVALIDATE`, `HUMAN_REVIEW`, or `REFUSE` before execution.

No publicly documented, general, deployed IoBT architecture meeting **all** those conditions was found. That is not proof that none exists, especially in classified or proprietary systems.

## Strict kill test

The candidate is killed as novel architecture if an existing system can demonstrate all of the following:

1. actions declare the real-world claims they require;
2. claims distinguish positive confirmation, contradiction, and absence of confirmation;
3. evidence retains source, transformation lineage, time, identity binding, and validity scope;
4. common dependencies and non-independent failure modes affect effective confirmation;
5. those semantics survive across heterogeneous sensing, fusion, decision, and execution boundaries;
6. a separate runtime mechanism enforces action disposition from the current contract state;
7. the mechanism is reusable rather than manually rebuilt for one vehicle or mission; and
8. the architecture is demonstrated in representative operation, not only described conceptually.

No public source reviewed satisfied all eight.

## Capability comparison

| Field | What already exists | What it usually gates or represents | Publicly visible gap relative to the contract |
|---|---|---|---|
| Safety engineering | Fail-safe behavior, interlocks, fault trees, redundancy, independence and common-cause analysis | Hazards and component/system failure conditions | Common-cause reasoning is commonly design-time; it is not generally exposed as a live claim-evidence dependency graph governing each action |
| Sensor/data fusion | Bayesian methods, Dempster–Shafer evidence, track confidence, covariance intersection for unknown correlation | Estimated state and mathematical uncertainty | Estimator consistency does not by itself bind a decision prerequisite to provenance, positive-confirmation rules, authority, or execution permission |
| Provenance | W3C PROV entities, activities, agents, derivation and interchange across heterogeneous systems | Where information came from and how it changed | Provenance supports trust judgments but does not define epistemic sufficiency or authorize/refuse physical action |
| Runtime Assurance | Monitors safety properties; Simplex architectures switch from an advanced controller to an assured fallback | Whether a safety property/envelope is being violated | Monitors commonly consume a system state; public frameworks do not generally establish whether the state itself has sufficient independent evidence for a claim |
| C2/data-centric architecture | Data quality metadata, provenance, lineage, confidence, interoperability, access control and command authority | Data usability, sharing, situational awareness, authorization | Public NATO material calls for downstream quality awareness but does not document a generic claim-level evidence contract directly controlling action permission |
| Emerging autonomy runtimes | World models under uncertainty, provenance, independent assurance kernels, permits, execution mediation and audit | Joint constraints on autonomous action | Barycenter approaches the proposed architecture closely; evidence-independence and required positive confirmation are not apparent in its public description |

## Where epistemic state is lost

The recurring problem is not necessarily failure to calculate uncertainty. It is **semantic attenuation across interfaces**.

### 1. Observation becomes estimate

A sensor can expose measurement error, time, operating conditions, and source health. A fusion component may output a compact estimate or track. If downstream schemas carry only the estimate, uncertainty structure and source dependencies disappear.

### 2. Estimate becomes object

Tracking or perception may produce “object likely present.” A display, message format, API, or planner can convert this into an object record without preserving the distinction between existence probability, identity confidence, location confidence, and freshness.

### 3. No contradiction becomes confirmation

If a system has only Boolean predicates, a missing positive observation may become `false`, a default value, or continued reliance on the last known state. The contract requires open-world semantics: lack of disconfirmation is not confirmation.

### 4. Source count becomes independence

Three messages can descend from one sensor, one GPS constellation, one upstream fused track, or one model. Without derivation and dependency semantics, downstream systems can count repeated evidence as corroboration.

### 5. Safety envelope becomes evidence sufficiency

A Runtime Assurance monitor may correctly conclude that a proposed trajectory is inside its certified envelope, while relying on an environmental state whose evidence is stale or correlated. The property monitor and the epistemic validity of its inputs are different assurance questions.

### 6. Authorization becomes justified permission

Command systems can establish that an actor has authority to issue an action. That does not establish that the factual prerequisites for the action are confirmed. Identity/role authorization and epistemic authorization are complementary gates.

## Evidence by research lane

### Safety engineering

U.S. rail safety guidance explicitly warns that redundancy cannot be treated as independent when common-mode failure exists and says independence must be ensured when one element checks another. FAA guidance likewise calls for sensor-input verification and analysis of failure detection, redundancy management, independence, and isolation. These findings strongly establish that evidence independence is not a new idea. [49 CFR Part 229, Appendix F](https://www.law.cornell.edu/cfr/text/49/appendix-F_to_part_229), [FAA AC 25-11A](https://www.faa.gov/documentLibrary/media/Advisory_Circular/AC_25-11A.pdf)

**Gap:** these are safety-development and system-analysis practices, not evidence of a general runtime contract connecting changing claim support to action permission across heterogeneous systems.

### Sensor and data fusion

Dempster–Shafer methods can explicitly represent mass assigned to an unknown state. Covariance Intersection and related methods conservatively fuse estimates when cross-correlation is unknown rather than pretending independence. A review of distributed fusion organizes approaches around decorrelation, modeling correlation, and conservative bounding. [Distributed multisensor fusion under unknown correlation](https://pmc.ncbi.nlm.nih.gov/articles/PMC5713506/), [Covariance Intersection with partial correlation knowledge](https://doi.org/10.1016/j.automatica.2022.110168)

**Gap:** these methods solve estimation problems. They do not automatically preserve full derivation lineage, encode which claims an action requires, or enforce action permission.

### Provenance

W3C PROV provides a generic, interoperable model of entities, activities, agents, and derivations so heterogeneous systems can exchange provenance and make quality or trust judgments. [W3C PROV overview](https://www.w3.org/TR/prov-overview/), [PROV data model](https://www.w3.org/TR/prov-dm/)

**Gap:** PROV describes lineage; it deliberately does not decide whether evidence is sufficient for a domain claim or whether an action may execute.

### Runtime assurance and autonomy

NASA describes Simplex Runtime Assurance as a monitor checking a property and transferring control to a trusted controller when the property is violated. NASA's R2U2 work proposes real-time monitoring of sensors, software, and hardware for failures and rule violations across autonomous spacecraft and aircraft. DARPA defines continual assurance as safety and correctness assurance that is monitored, updated, and evaluated during operation. [NASA UAS Runtime Assurance framework](https://shemesh.larc.nasa.gov/fm/papers/DASC2024-SWDMC-draft.pdf), [NASA R2U2](https://www.nasa.gov/directorates/stmd/space-tech-research-grants/multi-platform-multi-architecture-runtime-verification-of-autonomous-space-systems/), [DARPA Assured Autonomy](https://www.darpa.mil/research/programs/assured-autonomy)

**Gap:** these sources establish runtime property enforcement, but their public descriptions do not show a general mechanism that proves the evidentiary independence and positive confirmation of every world-state claim used by the monitored property.

### Military C2 and IoBT

NATO's Data Quality Framework requires lifecycle evaluation, provenance, lineage, and interoperable quality metadata so downstream decision-makers can judge fitness for a task. NATO's smart-object strategy says heterogeneous sensing requires attention to provenance, reliability, accuracy, accountable automation, and resilience. U.S. Army IoBT research explicitly addresses uncertainty, disrupted communication, infiltrated sensors, and the difficulty of showing operators why fusion systems reach conclusions. [NATO Data Quality Framework](https://www.nato.int/en/about-us/official-texts-and-resources/official-texts/2025/08/29/data-quality-framework-for-the-alliance), [NCIA Technology Strategy](https://www.ncia.nato.int/resources/site1/General/newsroom/publications/Public_NCIA_Technology%20Strategy_external_v6%20-%20digital.pdf), [Army IoBT uncertainty research](https://www.army.mil/article-amp/249169/ai_research_strengthens_certainty_in_battlefield_decision_making)

**Gap:** the public material recognizes the ingredients and the cross-layer risk. It does not document an operationally general contract that carries all of those semantics into execution authorization.

## Strongest near-kill: Barycenter Systems

Barycenter publicly describes almost the same architectural shape for autonomous space missions:

- a world model that preserves uncertainty, provenance, unknowns, and contradictions;
- formalized intent and constraints;
- an independent assurance kernel issuing execution permits;
- action mediation and observed-outcome recording;
- common semantics across ground, onboard, and disconnected operation.

It reports a working reference implementation and a private beta with design partners. [Barycenter runtime](https://barycentersystems.com/runtime)

This prevents Project Reality from claiming that “provenance-aware belief plus independent action permits” is novel.

The public description leaves four material questions unanswered:

1. Does each action declare specific required external-state claims, including required positive confirmation?
2. Does the runtime distinguish independent evidence from multiple descendants of a common source or failure mode?
3. Can evidence contracts span heterogeneous vendor systems and changing mission graphs?
4. Is the reported beta operationally demonstrated, and at what assurance level?

Until those questions are answered, Barycenter is a **near-kill and potential comparable**, not proof that the exact candidate is already solved.

## Novelty verdict

### What is not novel

- explicit unknown or uncertain state;
- provenance and lineage;
- common-cause and independence analysis;
- runtime safety monitors;
- fail-safe or fallback behavior;
- action authorization;
- uncertainty-aware world models;
- independent execution-permit kernels.

### What may remain distinct

The possible contribution is a shared **contract and enforcement semantics** spanning these established disciplines:

```text
Action
  requires Claims
    evaluated from Evidence
      carrying provenance, time, identity, transformations,
      shared dependencies and failure domains
    producing CONFIRMED | CONTRADICTED | UNKNOWN
  yields PERMIT | DEGRADE | REVALIDATE | HUMAN_REVIEW | REFUSE
```

The novelty claim must be phrased as integration and end-to-end semantic preservation, not invention of its constituent techniques.

### Confidence

**Moderate confidence** that the public literature is fragmented across layers and that end-to-end epistemic semantics are not standardized generally.

**Low confidence** that no deployed defense architecture already implements the mechanism, because classified, export-controlled, proprietary, and program-specific systems are not publicly inspectable.

**Low confidence** that architectural distinctness implies a commercial opportunity. No buyer, procurement requirement, integration willingness, or willingness to pay was established.

## Safe first prototype, conditional on continuing

Build a non-weaponized simulation of a heterogeneous sensing and inspection mission. The action is whether an autonomous inspection asset may enter or report completion for a simulated sector.

### Minimum objects

**Claim contract**

- stable claim identifier;
- required positive/negative conditions;
- validity interval and freshness limit;
- minimum independent confirmation rule;
- permitted evidence types;
- contradiction and missing-evidence policy.

**Evidence record**

- source and observation identity;
- observed object/region identity;
- timestamp and validity scope;
- derivation and transformation parents;
- failure-domain labels such as shared clock, network, positioning source, model, operator, or power supply;
- uncertainty and contradiction metadata.

**Runtime evaluation**

- calculate effective independent support rather than raw source count;
- preserve `UNKNOWN` when required positive evidence is absent;
- invalidate or downgrade stale claims;
- propagate contradictions;
- issue only `PERMIT`, `DEGRADE`, `REVALIDATE`, `HUMAN_REVIEW`, or `REFUSE` with an inspectable reason.

### Falsification scenarios

1. Three messages derived from one source must count as one effective confirmation.
2. Two different sensors sharing one positioning source must not be treated as fully independent for a location claim.
3. Absence of contradiction must leave a positive-confirmation claim `UNKNOWN`.
4. A previously confirmed claim must expire when its evidence becomes stale.
5. A safety-envelope monitor must refuse to rely on an input claim whose evidence contract is unmet.
6. Revalidation with genuinely independent evidence must change the disposition reproducibly.

### Comparator

Compare against:

- ordinary threshold/voting fusion;
- a provenance-only implementation;
- a conventional Runtime Assurance property monitor supplied the same flattened state;
- the full contract mechanism.

Measure false permission, unnecessary refusal, correlated-evidence double counting, stale-state acceptance, time to revalidation, decision latency, and explanation completeness.

This prototype would test the mechanism. It would not prove operational suitability, military utility, safety certification, product demand, or market ownership.

## Next evidence needed

1. Conduct a feature-level teardown or interview with Barycenter focused on claim prerequisites and evidence-dependency modeling.
2. Interview runtime-assurance and fusion engineers: where are provenance, correlation, and unknown-state semantics removed from interfaces today?
3. Inspect public interface standards and representative open-source autonomy stacks for the exact fields that survive from observation to action.
4. Obtain one non-sensitive IoBT assurance workflow and map every schema boundary where epistemic information is compressed.
5. Build the simulation only after defining a baseline that could falsify the benefit.

## Search boundary and stopping rule

The research covered public material from safety regulation, aviation assurance, NASA and DARPA runtime assurance, W3C provenance, multisensor fusion, NATO data/C2 strategy, U.S. Army IoBT research, and an emerging commercial runtime. Research stopped when each required capability had authoritative evidence, the strongest public near-match was identified, and further broad searching returned components or marketing variants rather than a documented system satisfying all eight kill conditions.

Public-source absence is not evidence of absence in classified or proprietary IoBT systems.

## Claim-to-source ledger

| Claim | Source | Publisher/date | Access note |
|---|---|---|---|
| Common-mode failures invalidate assumed redundancy independence | [49 CFR Part 229, Appendix F](https://www.law.cornell.edu/cfr/text/49/appendix-F_to_part_229) | U.S. e-CFR text via Cornell LII; current access 2026-09-04 | Public regulation/recommended practice |
| Aviation safety assessment addresses input verification, redundancy, independence, and isolation | [AC 25-11A](https://www.faa.gov/documentLibrary/media/Advisory_Circular/AC_25-11A.pdf) | FAA, 2007 | Public advisory circular |
| Fusion can remain conservative under unknown correlation | [Distributed multisensor fusion review](https://pmc.ncbi.nlm.nih.gov/articles/PMC5713506/) | Sensors, 2017 | Open-access review with methods and references |
| Provenance can be represented and exchanged across heterogeneous systems | [PROV-DM](https://www.w3.org/TR/prov-dm/) | W3C, 2013 | Recommendation-family specification |
| Runtime Assurance monitors properties and switches to an assured controller | [NASA verification framework](https://shemesh.larc.nasa.gov/fm/papers/DASC2024-SWDMC-draft.pdf) | NASA Langley authors, 2024 | Public author manuscript |
| Continual assurance is evaluated during operation as system/environment evolve | [Assured Autonomy](https://www.darpa.mil/research/programs/assured-autonomy) | DARPA | Official program description |
| NATO requires provenance, lineage, and quality metadata for downstream fitness judgments | [NATO Data Quality Framework](https://www.nato.int/en/about-us/official-texts-and-resources/official-texts/2025/08/29/data-quality-framework-for-the-alliance) | NATO, 2025 | Official public framework |
| IoBT research treats uncertainty, compromised sensors, and communication disruption as core problems | [Army IoBT uncertainty research](https://www.army.mil/article-amp/249169/ai_research_strengthens_certainty_in_battlefield_decision_making) | U.S. Army, 2021 | Official research summary |
| A commercial runtime claims uncertainty/provenance preservation plus independent execution permits | [Barycenter runtime](https://barycentersystems.com/runtime) | Barycenter Systems, accessed 2026-09-04 | First-party claim; private beta not independently verified |
