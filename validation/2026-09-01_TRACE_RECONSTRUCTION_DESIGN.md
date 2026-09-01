# Trace Reconstruction Falsification — Test Design

- **Date:** 2026-09-01
- **Status:** Desk-research finding and validation design; no original experiment completed
- **Working fixture:** Inventory-based SME seeking short-term working-capital credit
- **Decision-maker:** Lender

## Question under attack

Can existing digital traces plus modern analytics or AI already reconstruct enough about an SME to make a working-capital credit decision?

This question must be separated into two different claims:

1. **Prediction claim:** transaction data can predict repayment/default.
2. **Truth claim:** transaction data can produce a defensible representation of the business's economic state and explain the meaning of material events.

Evidence supporting claim 1 does not automatically establish claim 2. However, it can kill a product whose value proposition is merely transaction-based credit scoring.

## Desk-research finding

### Evidence

- A 2024 BIS paper reports proof-of-concept models using SME transactional cash-flow data. One experiment used roughly 74 million monthly observations from more than 1,000 retail SMEs to predict default across several horizons. This establishes that transaction-derived variables can be technically useful for SME credit scoring. [BIS Papers No. 148](https://www.bis.org/publ/bppdf/bispap148_h.pdf)
- CGAP reports two MSE-lending case studies in which transactional data had predictive power comparable to credit history, and the combination performed better than either source alone. Its transaction category extended beyond bank movements to sales, expenses, orders, invoices, activity, and inventory records depending on the business. [CGAP, Leveraging Transactional Data for Micro and Small Enterprise Lending](https://www.cgap.org/research/publication/leveraging-transactional-data-for-micro-and-small-enterprise-lending)
- IFC's 2025 handbook documents active use of bank, mobile-money, supplier, e-commerce, platform, qualitative, and other data in MSME decisioning. It also says scorecards support rather than fully determine decisions, with further diligence needed on facility purpose, business viability, and risk. IFC describes field collection of primary sales/product data and assisted-tech assessment for rural retailers. [IFC, MSME Banking in the Digital Era](https://www.ifc.org/content/dam/ifc/doc/2025/msme-banking-in-the-digital-era.pdf)

### Inference

The weak version of the wedge—“use transaction data and AI to score SMEs”—is already crowded and substantially demonstrated. It is not a novel infrastructure thesis.

The research does **not** prove that existing systems reconstruct a complete or independently defensible economic state. It instead shows that a lender often does not need complete truth to predict repayment. Therefore the burden of proof has increased: Decision-Grade Financial Truth must improve a concrete decision beyond what prediction and existing diligence already achieve.

## Working reconstruction map

The map below is a hypothesis to test against consented sample records and lender standards.

| Category | Candidate facts | What the records establish | Main failure mode |
|---|---|---|---|
| Observable | timestamp, amount, account, direction, counterparty identifier, channel, stated reference, recorded invoice/order, POS event | A recorded system event occurred | incomplete coverage, cash activity, duplicate or manipulated records |
| Inferable | cash-flow volatility, seasonality, concentration, recurring counterparties, approximate sales pattern, expense rhythm, liquidity buffer, repayment behavior | A probabilistic pattern supported by traces | correlation mistaken for economic meaning; account mixing; selection bias |
| Unverifiable from money movement alone | whether inflow is revenue, debt, owner capital, refund, transfer, pass-through, or fraud; whether expense is business or personal; undisclosed liabilities; true margins | Only that funds moved | economically different events look identical in a ledger |
| Requires external or cross-system evidence | inventory existence and ownership, delivery, purchase purpose, invoice authenticity, supplier/customer relationship, contract terms, returns, receivables/payables, off-platform debt, cash sales | Meaning or real-world state supported by another source | evidence cost, consent, access, fraud, inconsistent identifiers, stale state |

## Minimum test package

For one inventory-based SME, obtain lawful and consented samples covering a consistent 6–12 month period:

- bank and mobile-money statements;
- POS or sales ledger;
- purchase invoices and supplier ledger;
- inventory movements and one physical stock observation;
- loan and owner-capital records;
- receivables, payables, refunds, and related-party transfers;
- known outcome labels relevant to the lender's decision.

The package must be de-identified before use outside the authorized validation team.

## Experiment

Run the same case as four cumulative, blinded evidence stages. Freeze the requested output and decision standard before revealing the next stage.

### Stage 1 — Transactions only

Give a current model only bank/mobile-money transaction records. Require it to produce:

- estimated recurring business inflows and outflows;
- liquidity and seasonality indicators;
- proposed working-capital capacity;
- event classifications with confidence;
- contradictions and unresolved questions;
- provenance for every material conclusion.

### Stage 2 — Transactions plus accounting records

Add the sales and purchase ledgers, financial statements where available, receivables, payables, loan records, and owner-capital records. Record every material change in classification, confidence, and lending recommendation.

### Stage 3 — External commercial and physical evidence

Add independently attributable supplier/customer evidence, invoice or delivery corroboration, inventory movement records, and a physical stock observation. Record which unresolved claims become decision-grade and which remain uncertain.

### Stage 4 — Reconciled ground truth

Reveal the ground truth assembled by the consenting business, accountant, and test organizers. This is a reference with documented limits, not a claim of perfect omniscience. Score every earlier stage against it.

### Existing lender baseline

Apply the lender's present scorecard, rules, bureau inputs, and standard diligence. This is the commercial baseline; an AI-only comparison is insufficient.

### Expert reference

Have a qualified credit analyst and accountant reconcile the same package without seeing model outputs first. Record disagreements rather than forcing a false single truth.

## Evaluation

Measure:

- event-classification accuracy by material value;
- unsubstantiated-claim rate;
- contradiction-detection recall;
- provenance coverage;
- calibration of stated confidence;
- accuracy of cash-generation and working-capital estimates;
- lender decision change versus Baseline B;
- false-positive and false-negative decision changes;
- acquisition cost, processing cost, latency, and refreshability.

At each stage also ask the accountable lender: **Is the evidence now sufficient to put real money at risk?** Record the answer, required conditions, proposed amount and terms, and reasons. A model's internal confidence is not a substitute for this decision threshold.

Numeric thresholds are intentionally unset until a real lender defines the decision standard. Invented thresholds would create false precision.

## Decision rule

- **Kill the wedge as credit analytics** if Baseline B or transactions plus existing models already meets the decision standard at lower cost.
- **Continue the truth-layer hypothesis** only if evidence enrichment resolves material ambiguity, improves consequential decisions, and cannot be reproduced cheaply by the incumbent from data it already controls.
- **Redirect the customer or use case** if economic truth is real but lenders rationally prefer cheaper prediction to fuller truth.

## Current conclusion

The first falsification does not kill the umbrella AI-to-reality vision. It does substantially weaken the idea that transaction aggregation and AI scoring alone form a scarce layer. The next empirical work must test the incremental value of verified economic context against an actual lender process—not against no system at all.
