# First Buyer / Problem Search

**Date:** 2026-09-16  
**Status:** Proposed first outreach wave; no buyer or demand claimed

## Decision we need to earn

The current product can authorize an agent action before execution, persist its resource cost, evaluate externally supplied outcome evidence, and create an economic record. That is technical capability, not proof that a buyer needs it.

The next question is:

> Does a team operating real AI agents have an important decision that its existing traces, evaluations, and cost dashboards cannot make because cost is not reliably connected to externally evidenced outcomes?

## Narrow first workflow

Start with a customer-support agent that can take a bounded action such as issuing a refund, changing a subscription, creating a return, or closing a ticket.

This is a useful first workflow because it has:

- a paid model or tool call before action;
- an identifiable business action;
- an external system of record such as Stripe, Shopify, Zendesk, or a CRM;
- a measurable outcome such as a completed refund or an accepted resolution;
- an operator who can decide to stop, reroute, or scale the agent.

Customer support is a validation environment, not a permanent company definition.

## Who we should speak with

The best first participant is not a general business owner. It is one of:

1. a founder or technical lead at an AI-agent implementation firm;
2. an AI operations or delivery lead who monitors multiple customer workflows;
3. a product or support-operations owner running a transactional agent in production.

An implementation firm is especially useful because one relationship can expose several workflows, failure modes, and buyer roles. It may become a design partner, channel partner, competitor, or disconfirming expert. We must learn which rather than assume.

## Ranked first wave

| Priority | Organization | Public evidence of fit | What remains unknown | Best public route |
|---|---|---|---|---|
| 1 | QZX Studio | Its public case describes a three-person team building a Claude/MCP support agent connected to a knowledge base, CRM, billing, and ticketing. | Whether it can prove resolution from external systems, attribute full action cost, or control spend before tool use. | General company email published on its site. |
| 2 | Outlearn | It publishes denominated production figures for resolution, handoff, and ambiguous endings across 29,003 conversations; its agent can take actions and is priced in work credits. | How it defines an accepted outcome, whether source freshness and action cost affect that decision, and whether unresolved endings create an economic-control problem. | Team email or public support form. |
| 3 | KeyDelta | Its public case tracks resolution, CSAT, and cost per ticket and names operational ownership and review cadence. | Whether those metrics share a run-level evidence chain or are joined later in reporting. | Public operator-to-operator contact form. |
| 4 | SupportYourApp / CoSupport implementation team | Public cases describe AI agents integrated with Zendesk, customer systems, and human escalation, with measured changes in resolution and cost. | Whether an independent control layer would improve deployment decisions or duplicate their internal platform. | Business-growth contact published by SupportYourApp. |
| 5 | PlugScale | Its public case describes agents acting across Zendesk, Salesforce, Stripe, Snowflake, and internal systems in a governed workflow. | Whether its confidence and governance layer already provides outcome-grounded economic control. | Company contact route; request an AI delivery or operations lead. |
| 6 | eesel AI | Its public documentation supports helpdesk actions, human approval for consequential actions, and work-based pricing. | Whether “work done” is grounded in customer-system outcomes or defined within the agent platform. | Sales or custom-plan contact route. |
| 7 | Chatbase | Its product supports custom actions, helpdesk and commerce integrations, simulations, traces, and production analytics. | Whether successful action, accepted customer outcome, and cost are joined into one governed record. | Company sales/contact route. |
| 8 | Kommunicate | Its documentation exposes resolved conversations, handoffs, CSAT, intent analytics, and company-wide reporting. | Whether its reporting distinguishes a closed conversation from an externally verified successful outcome. | Public support or demo route. |
| 9 | Softorino | A public case states that a live voice agent verifies user details, creates CRM tickets, connects to an admin console, and reports operational metrics. | Whether the operator can trace spend to verified resolution and use that record to govern autonomy. | Public company support route; request the owner of the AI support workflow. |
| 10 | Cocoatech | A public case describes a small support team using an AI agent with Zendesk to manage tickets end to end. | Whether reported resolution represents customer-confirmed success, ticket closure, or another proxy, and who owns the scaling decision. | Public company support route; request the support-automation owner. |

## First-wave choice

Begin with **QZX Studio, Outlearn, and KeyDelta**. They provide three distinct lenses:

- QZX: builder and integrator;
- Outlearn: product operator with unusually transparent outcome definitions;
- KeyDelta: operating-model and economics lens.

This is a proposed sequence, not a claim that any is a buyer.

## Problem-interview questions

Do not demonstrate the product first. Ask for a recent real decision.

1. Tell us about the last time an agent completed a workflow but the team later decided the result was not truly successful.
2. What system determined success: the agent trace, a ticket state, billing, CRM, customer confirmation, or something else?
3. Could that success signal be stale, duplicated, user-abandoned, reversed, or produced by the same system being evaluated?
4. What costs are visible per run? Which costs remain outside the trace?
5. Who decides to stop, reroute, or scale the agent, and what evidence do they inspect?
6. What happens when the evidence is missing or contradictory?
7. Which existing tool already solves this for you?
8. Would a run-level record joining authorization, actual cost, source evidence, and accepted outcome change a real decision? Which one?

## Bounded shadow test

If a participant identifies a real gap, request one de-identified historical workflow. Do not request credentials, customer personal data, or production access.

Required artifact:

- task and success criterion;
- proposed paid action and cost;
- execution trace or equivalent event list;
- outcome-system record;
- the operator's actual decision.

Reality produces a parallel record. We compare:

1. Did it reach the same outcome classification?
2. Did it expose missing, stale, dependent, or contradictory evidence the existing workflow hid?
3. Did the difference change a stop, reroute, approval, or scaling decision?
4. What false refusals did Reality introduce?

## Commercial signal ladder

Interest is not demand. Count signals in this order:

1. agrees to a problem interview;
2. shares a de-identified historical artifact;
3. assigns a technical owner to a shadow test;
4. asks for a second workflow or internal introduction;
5. names a budget owner and procurement path;
6. signs a paid pilot or produces equivalent hard procurement evidence.

## Kill and narrow rules

- **Kill the current buyer hypothesis** if five qualified operators show that existing tooling already joins full resource cost to independently accepted outcomes at the decision point.
- **Narrow the workflow** if the gap exists only for specific actions such as refunds, returns, or billing changes.
- **Change buyer** if operators care but the budget and authority sit with platform engineering, finance, risk, or the agent vendor.
- **Continue** only if Reality changes a consequential operating decision without an unacceptable false-refusal burden.

## Sources

- QZX Studio, AI support automation case: <https://www.qzx.digital/en/cases/ai-support-automation>
- Outlearn production benchmark: <https://outlearn.com/ai-support-benchmark>
- KeyDelta AI virtual-agent case: <https://keydelta.com/case-studies/ai-virtual-agent>
- SupportYourApp / Cocoatech case: <https://supportyourapp.com/blog/ai-chatbot-support-cocoatech-case-study/>
- SupportYourApp / Softorino voice-agent case: <https://supportyourapp.com/blog/voice-ai-customer-support-softorino-case-study/>
- PlugScale agentic support case: <https://www.plugscale.com/agentic-ai-customer-support-case-study>
- eesel AI actions documentation: <https://docs.eesel.ai/instructions-and-memory/actions-and-approvals>
- Chatbase product overview: <https://www.chatbase.co/features/product-overview>
- Kommunicate analytics documentation: <https://docs.kommunicate.io/docs/analytics>
- LangChain, State of Agent Engineering 2026: <https://www.langchain.com/state-of-agent-engineering>
- LangSmith cost tracking: <https://docs.langchain.com/langsmith/cost-tracking>
- Stripe / Intercom Fin outcome-based pricing case: <https://stripe.com/customers/fin-ai>

