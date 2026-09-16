# Reality Founder Map

**As of:** 2026-09-16
**Purpose:** Give Brayan a filtered, teachable understanding of where Reality came from, what problem it is actually addressing, what the current product does, what remains unproven, and where the project is heading.

This is not a record of every conversation or experiment. It keeps only the ideas that changed the thesis, product, evidence, or next decision.

The architecture origin in Step 11 was checked directly against the ChatGPT conversation titled **Example Conversation**, where AI Data Utility, Human Execution API, Agent Economics, the shared Claim/Evidence Ledger, Stakes Model, relying parties, proof policies, and the governor model were compared and refined.

---

## 1. Reality in one sentence

> Reality is building a control plane that helps AI agents spend resources and take actions only under an explicit contract, then connects each action to evidence that the intended outcome actually occurred.

That sentence describes the current product direction. The larger vision is broader:

> Build infrastructure that lets intelligent systems interact with reality reliably.

The product is one attempt to enter that vision. It is not yet proof that the whole vision is correct.

## 2. The problem in plain language

AI is becoming better at reasoning, planning, generating software, and using tools. But a capable agent can still:

- act on stale, missing, or misleading information;
- spend money before anyone checks whether the action is justified;
- report that it finished when only its internal workflow finished;
- count a closed ticket as success even when the customer’s problem remains;
- treat several dependent signals as independent confirmation;
- lose uncertainty or provenance as information passes between systems;
- create cost without an accepted business outcome.

The problem is therefore not simply that AI lacks intelligence.

The problem is the weak connection between:

```text
what the agent believes
-> what it is allowed to do
-> what it actually does
-> what changed in the world
-> what evidence proves that change
-> whether the result justified the resources consumed
```

### A useful analogy

Imagine an employee with a company card.

A normal spend dashboard tells the company how much the employee spent. Reality is trying to answer the harder questions:

1. Was this purchase permitted for this exact task?
2. Did the purchase stay inside the agreed resource envelope?
3. Did the intended job actually get completed?
4. Which external evidence proves completion?
5. What did one accepted outcome truly cost?

Reality is not merely the card statement. It is the agreement, permission, receipt, proof of completion, and economic record connected together.

## 3. Why stronger AI does not automatically remove the problem

A stronger model may improve reasoning and reduce many mistakes. It may also learn to collect better evidence. That can shrink parts of the problem.

But model capability alone cannot guarantee:

- an observation was made when no sensor or external system recorded it;
- a record belongs to the correct person, object, task, or event;
- information remains fresh after the world changes;
- two sources are independent when they share one hidden dependency;
- an external event occurred merely because the agent says it occurred;
- an organization authorized the action;
- the economic value assigned to the outcome is correct.

This is why the thesis is not “AI can never solve it.” The careful claim is:

> As AI becomes more capable, systems may still need explicit infrastructure for authority, evidence, uncertainty, outcome verification, and accountability.

That claim is a hypothesis to test. If future agent platforms solve it completely and cheaply, Reality must narrow, integrate with them, or stop.

## 4. The journey that produced the current direction

### Step 1 — The original question

We began by asking for a “holy grail” one-person AI business.

The first correction was that optimizing around one founder’s current skills, money, or location could hide the most important opportunity. We separated:

- **importance:** what new infrastructure becomes necessary as AI expands?
- **entry:** what can we build and test first?

### Step 2 — Looking beneath AI capability

If intelligence becomes powerful and broadly accessible, another generic AI application may be easy to reproduce. We therefore looked underneath intelligence at the chain connecting intent to real-world outcomes.

This produced the umbrella vision: infrastructure that lets intelligent systems interact with reality reliably.

### Step 3 — SME financial truth as the first laboratory

The first concrete case was financial truth for SMEs. Transactions show that money moved, but not necessarily why it moved or what economic reality it represents.

The lasting lesson was:

> More digital data does not automatically create a defensible account of reality.

SME finance did not become the company identity. It was an early laboratory.

### Step 4 — The 100× AI test

We imagined AI becoming one hundred times more capable and asked what uncertainty would remain. Across health, logistics, infrastructure, finance, robotics, and insurance, several classes survived: missing observations, identity ambiguity, stale state, adversarial evidence, and hidden shared dependencies.

This strengthened the search but did not prove a market.

### Step 5 — IoBT as a stress environment

The Internet of Battlefield Things concentrated the hardest conditions: incomplete observation, deception, degraded communication, shared infrastructure, time pressure, and high consequences.

The research boundary remained assurance, resilience, provenance, uncertainty, and outcome verification—not weapon targeting or autonomous attack.

IoBT revealed a recurring failure shape:

- missing confirmation can silently become permission;
- repeated signals can appear independent even when they share one failure source.

### Step 6 — Claim–Evidence–Action Contract

We built a mechanism in which an action declares required claims, evidence is evaluated with time, identity, lineage, provenance, and dependency information, and each claim remains `CONFIRMED`, `CONTRADICTED`, or `UNKNOWN` before the action receives `PERMIT`, `REVALIDATE`, `HUMAN REVIEW`, or `REFUSE`.

The evaluator passed frozen scenarios, then adversarial tests exposed failures. Fixing those failures demonstrated that the mechanism was testable, but not generally trustworthy.

### Step 7 — The metadata and transformation problem

Further attacks showed that false, missing, or incomplete metadata could still cause unsafe permission or unnecessary refusal. In a public bridge-monitoring document experiment, a reviewer noticed a shared dependency in the findings and then omitted it while translating the findings into rules.

The important insight was not about bridges:

> A fact can be known at one stage and disappear when information changes representation.

### Step 8 — Epistemic Continuity

The pattern led to a candidate rule:

> A transformation must not increase action-relevant certainty without new, authenticated, claim-relevant, sufficiently independent evidence.

Uncertainty, provenance, freshness, dependency, scope, and contradiction should remain attached to a claim as it moves toward action.

This is a useful hypothesis, not a proven scientific law or established novelty.

### Step 9 — Reality Audit

Reality Audit turned the research into a visible shadow workflow. It mapped a decision, required claims, evidence, dependencies, unknowns, and action disposition.

It taught us how to expose evidence problems, but it remained a curated demonstration. It did not prove a buyer, payment, live integration, or repeatable business.

Reality Audit is now internal verification logic. It should not appear as a separate public product.

### Step 10 — Agent Economics

We then connected evidence integrity to agent resource use.

Agents spend model tokens, API charges, tool calls, time, and human attention. Cost dashboards report consumption after the fact. Agent Economics asks whether spending should be permitted before action and whether an accepted outcome later justified that spending.

This became the first business-shaped product direction.

### Step 11 — The Example Conversation selected and connected the directions

The conversation titled **Example Conversation** was not merely a later explanation of the product. It was where the present architecture crystallized.

Three directions had survived the broader search:

1. **AI Data Utility** — permissioned access to fresh, fragmented reality expressed as machine-readable claims with evidence.
2. **Human Execution API** — bounded physical work that returns evidence a machine can evaluate, rather than a human merely saying “done.”
3. **Agent Economics / Spend Control** — connecting an agent’s resource consumption to an accepted outcome, not merely reporting token or API spend.

Brayan selected Agent Economics as the strongest first business direction. The AI-side selection was AI Data Utility. Human Execution did not need to remain a third pillar: it could become one way Reality Data acquires evidence from the physical world.

The conversation then produced the deeper connection:

- a world-state statement and an agent-outcome statement have the same underlying shape;
- both are claims that require evidence, provenance, freshness, and a validity boundary;
- therefore the pillars should not become two disconnected engines;
- they should share one evidence substrate while remaining separately useful capabilities.

The resulting core was described as a **Claim/Evidence Ledger** with different ontologies or workflows above it:

- **Reality Data:** What is true in the world now, according to which evidence?
- **Agent Economics:** What did the agent do, what did it cost, and did an accepted outcome occur?

The conversation also added several pieces that the simplified six-node graph does not show:

- **verification cost:** the resources spent proving an outcome are part of the true outcome cost;
- **Stakes Model:** evidence sufficiency depends on what being wrong would cost, including reversibility, legal, safety, financial, and reputational effects;
- **relying parties:** one stable claim and evidence trail may be judged by several parties with different proof requirements;
- **proof policy:** each relying party defines what evidence is sufficient for its decision;
- **external governor:** the acting agent should not be the only authority deciding that its own evidence is sufficient;
- **two kinds of independence:** computational independence can separate an agent from its evaluator inside one organization, while institutional independence may be required when an outside counterparty or regulator must trust the result.

This produced the fuller architecture:

```text
signal / event
-> evidence
-> claim
-> stakes
-> relying parties
-> proof policies
-> ALLOW / REQUIRE MORE EVIDENCE / DENY
-> action
-> outcome evidence
-> economic record
-> feedback
```

Agent spending was selected as the first narrow test of this architecture—not as the definition of the entire company. It was the first cylinder of the larger engine because it could exercise evidence, stakes, authority, action, outcome, and economics in one loop.

### Step 12 — One control plane, two visible pillars

The two selected directions were therefore joined into one product architecture:

- **Reality Data:** acquire current, specific, machine-readable claims with sources and evidence.
- **Agent Economics:** authorize resources before action and connect actual cost, including appropriate verification cost, to an accepted outcome.
- **Internal verification:** inspect evidence throughout both workflows.
- **Governance:** apply stakes-aware proof policies before consequential action.

The present repository uses this simpler shared graph as its official top-level representation:

```text
claim
-> evidence
-> source
-> action
-> outcome
-> economic consequence
```

The fuller Example Conversation graph explains what must eventually sit inside the transitions. The current V1 has not yet implemented every object from that fuller graph.

## 5. What was filtered out—and why

| Item | Current treatment | Reason |
|---|---|---|
| “One-person business” | Origin story, not product constraint | Importance and entry strategy are different questions. |
| SME financial truth | Historical laboratory | It exposed the truth problem but did not validate the market. |
| Bridge monitoring | Test fixture | It demonstrated transformation loss; it is not proof of a bridge product. |
| Reality Audit | Internal verification process | Useful mechanism, but not the public product identity. |
| Human Execution API as a third standalone pillar | Evidence-acquisition method inside Reality Data | Its durable value was machine-evaluable proof that bounded physical work occurred. |
| “Epistemic Continuity is a new law” | Rejected claim | It remains a falsifiable engineering hypothesis. |
| “AI can never solve this” | Rejected claim | Better AI may solve parts or all of the problem; we must test the boundary. |
| Generic cost dashboard | Rejected product | It observes spending after action but does not connect authorization, evidence, outcome, and cost. |
| Generic SaaS interface | Rejected position | Interfaces are increasingly reproducible; the defensible value must live in the cross-system control and evidence layer. |
| Palantir clone | Rejected identity | Palantir is only an architectural analogy for connected operational objects and governed workflows. |
| Beautiful website as validation | Rejected evidence | Design can improve understanding, but only external behavior, artifacts, decisions, and payment validate value. |

## 6. The current product

### Product name

**Reality Control Plane**

### Pillar A — Reality Data

Its intended job is to obtain a needed fact together with inspectable evidence:

```text
fact needed
-> source selected
-> evidence acquired
-> identity and freshness checked
-> provenance and dependencies inspected
-> claim classified
```

This pillar is not yet implemented as a complete working acquisition product.

### Shared internal process — evidence verification

For every important claim or outcome, the system should ask:

- Which exact entity and property does this evidence concern?
- When was it observed, and is it still fresh enough?
- Where did it originate?
- Which transformations did it pass through?
- Do apparently separate sources share a dependency?
- Is there contradictory evidence?
- What remains unknown?

The caller cannot make an outcome true simply by labeling it `VERIFIED`.

### Shared governance model

The deeper architecture from the Example Conversation asks four additional questions before consequential action:

1. **Stakes:** What is the cost of being wrong, and how reversible is the action?
2. **Relying parties:** Who must be able to trust this claim?
3. **Proof policy:** What does each relying party require before accepting the claim for this decision?
4. **Independence:** Is the evaluator sufficiently separate from the agent, operator, or counterparty whose claim is being judged?

The intended invariant is:

> One stable claim, one stable evidence trail, and multiple relying parties applying their own explicit proof policies without rewriting the underlying evidence.

These are foundation-level design insights. They are not all first-class implemented objects in the present V1.

### Pillar B — Agent Economics

Its working contract is:

```text
TASK
-> RESOURCE ENVELOPE
-> PRE-ACTION AUTHORIZATION
-> EXECUTION TRACE
-> OUTCOME EVIDENCE
-> ACCEPTANCE GATE
-> ECONOMIC RECORD
```

The core metric is not merely cost per run. It is the candidate metric:

> Cost per verified accepted outcome.

That metric is not yet proven to be universally correct or commercially valuable.

## 7. A concrete example

Imagine a customer-support agent wants to issue a $20 refund.

### Without Reality

1. The agent interprets the conversation.
2. It calls the refund API.
3. The platform records a successful tool call.
4. The ticket closes.
5. A dashboard counts the ticket as resolved and records model/API cost.

But the refund may have targeted the wrong order, exceeded policy, failed in the payment processor, been reversed later, or closed the ticket without satisfying the customer.

### With the intended Reality flow

1. The task defines the customer, order, allowed refund, resource limit, and required outcome evidence.
2. The agent requests permission for the exact refund action.
3. Reality checks identity, policy, remaining resource envelope, and required evidence contract.
4. Reality issues a single-use permit or refuses/requires review.
5. The permitted action executes and its actual cost is recorded.
6. Evidence arrives from the payment system and, where required, another outcome source.
7. Internal verification checks source, freshness, entity binding, contradictions, and uncertainty.
8. Only an accepted outcome closes the economic record.
9. The operator can decide whether to stop, reroute, or scale the workflow.

This example is explanatory. We have not yet connected and validated this exact refund workflow with a customer.

## 8. What works today and what does not

### Working implementation

- persistent owner-gated integration workspace;
- one-time integration key stored as a hash;
- generic HTTP integration route;
- frozen task and resource contract per run;
- pre-action authorization;
- action-bound, single-use permits;
- execution and outcome ingestion;
- persisted policy-versioned economic records;
- a public integration journey and working control-plane interface.

### Partial or unproven

- the complete unaided customer journey still needs external testing;
- no provider-specific agent adapter exists;
- no real paid-agent/API and independent outcome source have been validated end to end;
- Reality Data acquisition is not complete;
- the Stakes Model, relying-party set, and per-party proof policies are not implemented as complete first-class product objects;
- institutional independence is not established merely because an internal evaluator is separate from the acting agent;
- source identity and authenticity are not independently attested;
- outcome value is supplied by the contract rather than independently established;
- strict concurrent reservation behavior is not proven under production load;
- buyer, budget owner, willingness to pay, and repeat demand are unproven;
- automatic policy learning and controlled self-correction do not exist.

The honest status is:

> **Working engine and partial product workflow; market and complete external integration unvalidated.**

## 9. Keep four types of claims separate

### A. Problem claim

Agent actions can become disconnected from reliable evidence of real outcomes and from the resources they consume.

**Status:** Supported by research and plausible production cases; not yet validated as an urgent paid problem for our chosen buyer.

### B. Mechanism claim

An explicit evidence and authorization chain can prevent some unsafe permissions and preserve unknown states.

**Status:** Demonstrated in bounded scenarios and adversarial fixtures; not proven as a general trusted boundary.

### C. Product claim

Reality can connect pre-action resource control, execution, outcome evidence, and an economic record.

**Status:** Partially implemented; external end-to-end validation remains open.

### D. Business claim

A customer will repeatedly pay for this capability.

**Status:** Unproven.

Never use evidence for one claim as proof of another. A working engine does not prove demand. A research paper does not prove our mechanism. A positive reply does not prove willingness to pay.

## 10. Who may need it

The current first-buyer hypothesis is an organization operating or implementing agents that:

- take actions across several business systems;
- consume paid models, tools, APIs, or human review;
- can cause refunds, billing changes, account changes, orders, or other consequential outcomes;
- must decide whether to stop, reroute, approve, or scale the workflow;
- cannot easily connect full run cost to independently accepted outcomes.

Possible roles include:

- head of AI or agent platform;
- engineering or technical delivery lead;
- support or operations leader responsible for automation;
- finance/FinOps owner for AI resources;
- risk, assurance, or governance owner.

We do not yet know which role owns both the pain and budget.

## 11. Current external test

QZX Studio and Outlearn have received problem-interview messages. KeyDelta remains unconfirmed because its form stopped at CAPTCHA.

The interview should not begin with a product pitch. It should investigate the last real workflow where apparent agent completion and accepted business outcome differed.

The evidence ladder is:

```text
reply
-> problem interview
-> de-identified historical workflow
-> assigned technical owner
-> shadow test
-> second workflow or internal introduction
-> named budget/procurement path
-> paid pilot or equivalent hard commitment
```

Compliments, website visits, and general interest do not move us far up this ladder.

## 12. The roadmap from here

### Phase 1 — Problem truth

**Goal:** Learn whether the problem is painful, frequent, and owned.

**Work:** Interview qualified agent builders/operators. Ask for recent failures, current tools, decision owners, and existing spend.

**Pass:** A participant identifies a consequential gap and shares a de-identified historical workflow.

**Narrow or kill:** Five qualified operators show that existing tools already connect full cost to independently accepted outcomes at the decision point.

### Phase 2 — Shadow proof

**Goal:** Determine whether Reality changes a real decision.

**Work:** Replay one historical workflow through the Reality contract without controlling production.

**Measure:** Unsafe permissions caught, unnecessary refusals introduced, evidence gaps exposed, and whether the operator changes a stop/reroute/approve/scale decision.

**Pass:** Reality exposes a material difference that the operator considers useful enough for another test.

### Phase 3 — Real integration V1

**Goal:** Complete one unaided, end-to-end external workflow.

**Work:** Connect one agent runtime or paid API and one independent business-system outcome source.

**Pass:** The external user connects it, defines the task and evidence contract, receives authorization, runs the action, submits outcome evidence, and inspects the persisted record without project-team assistance.

### Phase 4 — Commercial proof

**Goal:** Prove that the value has an owner and budget.

**Work:** Convert a successful shadow test into a bounded paid pilot.

**Pass:** Payment, purchase order, letter of intent with a procurement path, or equivalent hard commitment.

### Phase 5 — Repeatability

**Goal:** Learn whether this is a product rather than one consulting engagement.

**Work:** Repeat the workflow with multiple runs and at least one additional organization or workflow type.

**Pass:** A stable contract, repeated user behavior, manageable false refusals, and reusable integration components.

### Phase 6 — Production hardening

**Goal:** Make the control plane trustworthy under operational load.

**Work:** Source attestation, concurrency guarantees, team authorization, secure adapters, observability, recovery, privacy, retention, and adversarial testing.

**Pass:** Defined service objectives and independent security/reliability review appropriate to the consequences.

### Phase 7 — Scale the platform

**Goal:** Expand only after the primitive and buyer are proven.

Possible expansion includes provider adapters, reusable evidence-source connectors, policy templates, Reality Data acquisition, controlled policy improvement, and cross-workflow economic intelligence.

Do not decide this phase from imagination. Let repeated customer evidence determine it.

## 13. The unresolved strategic tension

IoBT was selected as the first industry in D-011. The present product and buyer search focus on commercial agent operations and support workflows. Later decisions changed product priority but did not explicitly cancel the IoBT industry decision.

Therefore the honest state is:

- IoBT remains a demanding strategic research direction and source of the underlying problem;
- Agent Economics is the current product-validation direction;
- we have not formally decided whether commercial agent operations are an entry market, a separate product path, or a replacement for IoBT as the first market.

This needs an explicit decision after early buyer evidence. It should not be hidden by storytelling.

## 14. How to explain Reality

### Fifteen seconds

> AI agents can spend money and mark tasks complete without proving the intended outcome occurred. Reality authorizes resource use before action and connects actual cost to evidence of an accepted outcome.

### One minute

> As AI becomes more capable, the hard part is not only generating decisions. Agents must act across real systems, spend resources, and prove what changed. Today, traces and cost dashboards can show that an agent called a tool or closed a task, but that is not always the same as a successful business outcome. Reality is a control plane: it freezes the task and resource contract, authorizes paid actions before execution, receives evidence from the outcome system, preserves uncertainty and provenance, and creates an economic record only after the outcome is accepted. We have a working engine, but we are now testing whether operators have this problem strongly enough to share workflows and pay for a solution.

### The deeper thesis

> Reality tests whether intelligent systems need an explicit continuity layer between belief, authority, action, evidence, outcome, and economic consequence. The central hypothesis is that action-relevant certainty must not become stronger as information moves between systems unless new qualifying evidence justifies it.

## 15. What not to claim

Do not say:

- “We solved AI hallucinations.”
- “AI cannot solve this problem.”
- “Reality independently verifies every outcome.”
- “Epistemic Continuity is a new scientific law.”
- “We have customers or validated demand.”
- “Reality is production-ready.”
- “We are building Palantir for AI.”
- “IoBT, bridges, SME finance, and support automation are all proven markets for the same product.”

Say what is true: we have a researched problem, a candidate mechanism, a working control engine, explicit limitations, and an active external market test.

## 16. Founder mastery plan

Use this sequence until the explanation becomes natural rather than memorized.

### Session 1 — Explain the problem without product language

Answer: What can go wrong between an agent deciding and the world actually changing?

You understand it when you can give three examples involving missing observation, false completion, or dependent evidence.

### Session 2 — Explain the research journey

Retell the journey in ten steps without claiming that the final answer was known at the beginning.

You understand it when each step answers one question and creates the next.

### Session 3 — Draw the architecture from memory

Draw the simplified product view:

```text
Reality Data
     ↓
claim -> evidence -> source
                       ↓
task -> authorization -> action -> outcome -> economic consequence
           Agent Economics
```

Then explain where internal evidence verification operates.

Next, draw the fuller decision view:

```text
claim + evidence
-> stakes
-> relying parties
-> proof policies
-> allow / more evidence / deny
-> action
-> verified outcome
-> economics
```

Explain why the claim and evidence remain stable while different relying parties may require different proof.

### Session 4 — Separate truth levels

For any statement, label it:

- evidence;
- inference;
- hypothesis;
- decision;
- unknown.

You understand the company when you can explain why a working engine is not market validation.

### Session 5 — Run the refund example

Explain the same workflow with and without Reality. Identify the task, resource envelope, permit, action, outcome source, evidence checks, and economic record.

### Session 6 — Defend against the strongest objections

Answer:

1. Why will OpenAI, Anthropic, observability tools, or payment systems not simply include this?
2. Why is this not FinOps with extra steps?
3. Who owns the budget?
4. Why is external evidence more trustworthy than the agent trace?
5. What happens when evidence is unavailable?
6. What false refusals will the system create?
7. When should Reality be killed or absorbed into another product?

The correct answer may be “we do not know yet; this is the test.”

### Session 7 — Explain the next milestone

The next milestone is not “finish the website.” It is:

> Obtain one qualified operator’s de-identified historical workflow and test whether Reality changes a consequential decision without unacceptable false refusal.

## 17. The decision compass

Before doing new work, ask:

1. Which claim are we trying to prove or disprove?
2. What real person, workflow, artifact, and consequence ground it?
3. What is the smallest test that could change our decision?
4. Does this work improve the functional loop or only its appearance?
5. What evidence would make us narrow, integrate, or stop?

If a task cannot answer these questions, it is probably not the next task.

## 18. Current destination

We are not heading toward “a website about Reality.”

We are testing whether Reality can become the evidence and economic control layer between autonomous agents and the systems they affect.

The destination is earned in stages:

```text
understand the real operator problem
-> prove a decision-changing shadow result
-> complete one real integration
-> obtain commercial commitment
-> prove repeatability
-> harden the control plane
-> expand only where evidence pulls us
```

The large dream remains. The immediate work is deliberately narrow because a credible large company is built from truths that survive contact with reality.
