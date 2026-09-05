# Can Trustworthy Dependency Metadata Be Produced By Independent Reviewers? — Results

- **Date:** 2026-09-05
- **Status:** Experiment run once, against one real system, with two independent reviewers. Conceptual and experimental only.
- **Author:** Claude, optimistic-builder lens, executing Brayan's specified protocol.
- **Answers:** the follow-on question raised by `validation/2026-09-05_METADATA_INTEGRITY_FALSIFIER_RESULTS.md` — not "does the evaluator handle false metadata correctly" (already tested) but "can someone describe which evidence sources genuinely share failure modes — accurately, completely, and independently enough to control a consequential action?"
- **Raw material:** `research/2026-09-05_source_FHWA-HRT-09-040_excerpt.txt` (the shared source document), `research/2026-09-05_REVIEWER_A_report.md`, `research/2026-09-05_REVIEWER_B_report.md` (full reviewer outputs, reproduced verbatim — this document is a comparison and synthesis of those, not a replacement for reading them).

## Proposal (per Brayan's protocol, executed as specified)

1. Selected one real, publicly documented, non-weapon system: the **I-35W (St. Anthony Falls) bridge foundation/column structural health monitoring system**, Minneapolis, described in FHWA-HRT-09-040 ("State of the Practice and Art for Structural Health Monitoring of Bridge Substructures," May 2014, U.S. DOT/FHWA, public domain). Chosen because it is real, non-weapon, richly documented in a single freely-downloadable federal report, built across three sequential instrumentation phases (a genuine multi-generation architecture, not a single clean design), and — usefully for this test — the document itself narrates several real hardware failures rather than only describing the system in the abstract.
2. Gave the architecture text (Chapter 2 general practice + Chapter 4's full I-35W case study, ~75 KB, page-cited) to two independent agent instances. Neither saw the other's output, evaluator.py, the CEA schema, the contract, or any project document — only the source excerpt and a task description written in plain engineering language (never using CEA-specific vocabulary like "claim," "REFUSE," or "lineage" as a technical term without defining it first).
3. Asked each for: evidence sources and lineage; shared dependencies; affected properties; failure effects; necessary joint-claim rules; plus a sixth item not in the original protocol but added to operationalize your fourth comparison question — each reviewer's own assessment of the single most plausible way their own model could be defeated by an omission.
4. Compared the two reports against your four questions below.

## Evidence

### Do they discover the same dependencies?

**Yes, substantially, on the structural core.** Both reviewers, independently, named:

- The four-MUX aggregation for vibrating-wire (VW) gauges (MUX1–4, one per shaft/column location, correct gauge counts on both sides: 16/16/10/10).
- The two-AVW200 second-order aggregation above the MUX layer (both explicitly flagged this pairing as *inferred*, not stated outright in the source — independent agreement on both the fact and its epistemic status).
- Per-system CR1000/CR9000 loggers and per-system dedicated Raven100 modems as the next aggregation layer, and that modems are *not* shared across systems (a documented point of independence, not just dependence).
- The PS100 power supply's "can't run A/C and solar simultaneously" design flaw and the battery-manager workaround.
- Bundled conduit/wire runs (TC + strain gauge wires per shaft; FHWA + University of Minnesota column gauge wires) as a physical-layer shared dependency.
- The USF host computer / plotting software as the single broadest convergence point, and — independently, in nearly identical language — that this is the one dependency capable of producing a **correlated bias**, not just a correlated outage, because it sits downstream of every raw measurement.
- The column-load calibration-by-theoretical-segment-weight reference as a real, load-bearing shared dependency between VW and RT gauges (both reviewers cited the same source sentence).
- The University of Minnesota gauges' downstream processing as a genuine, stated unknown (neither invented an answer).
- The MUX-to-AVW200 cut-wire incident as the single most important real documented failure, and drew the same conclusion from it: failures at that layer are correlated within the affected group, and can present as intermittent/corrupted before becoming total.
- The ~1-month DAS-removal gap as the single largest-blast-radius failure in the account, non-electronic in origin (a construction/scheduling decision, not a component fault).

This is a real, independently-arrived-at overlap on a non-trivial system with no shared framework imposed on either reviewer beyond the six plain-language questions. That is a genuinely positive result for "can this be described at all."

### What does each miss?

Each reviewer surfaced real material the other did not:

- **Reviewer A caught, B did not:** the coverage gap that only 2 of 8 shafts under Pier 2 southbound were instrumented, with the other six "estimated based on engineering principles" per the source — directly relevant to any claim that shaft monitoring confirms the pier's foundation is safe. This is an evidentiary-completeness gap, not a shared-dependency finding, but it's exactly the kind of thing a corroboration-focused reviewer could reasonably not think to look for, since the prompt asked about *shared failure modes* between sources that exist, not about sources that don't exist at all.
- **Reviewer B caught, A did not (or gave far less weight):** the Chapter 2 West Seattle case study (a *different* bridge, offered in the source only as background precedent) reporting 17 of 62 gauges failed over 20 years, concentrated in underwater gauges — real evidence that environmental co-location can produce correlated, gradual degradation, not just sudden joint failure. A mentioned environmental/EMF correlation only for the EMF-modem case within the I-35W system itself.
- **Reviewer A drew out, more explicitly than B:** the unresolved detail that the cut-wire incident silenced only 9 of that MUX's 16-or-10 gauges, not all of them — flagged by A as undercutting a simplistic "one MUX = one all-or-nothing failure unit" model. B reported the same incident but did not flag this partial-failure puzzle as a challenge to the aggregation model itself.
- **Each reviewer's self-assessment (item 6) named a *different* blind spot** — A: the VW/RT calibration-reference coupling, invisible to a hardware-only equipment inventory. B: the AVW200-level pairing, one inferential hop above what an equipment list naming "four MUXes" would show. Both are real, both are independently plausible, and neither reviewer flagged the other's — meaning a single reviewer's self-critique is not a reliable way to find the full set of blind spots in their own model; two reviewers found two disjoint ones, and there is no basis in this experiment for believing that exhausts the set.

### Do their models produce different action decisions?

**Yes — and not just between A and B. Within Reviewer A's own report.** This is the most important single finding of the experiment.

Reviewer A's dependency list (§2b) explicitly names the AVW200-level pairing as a shared dependency: *"Shared AVW200 analyzer. Two AVW200 units each carry two MUXes' worth of channels — a second layer of aggregation above the MUX layer."* But when A compresses that finding down into the actionable deliverable — the **joint-claim rules** in §5, the thing that would actually gate a real decision if encoded into a contract — that specific rule (shaft 1 vs. shaft 2, or interior vs. exterior column, sharing an AVW200) does not appear. A's §5 covers MUX-level sharing (rule 2) and calibration-reference sharing (rule 1) but never states the AVW200-level pairing as a joint-claim rule, despite having identified the underlying dependency two sections earlier.

Reviewer B's §5 **does** state it explicitly as its second rule: *"Shaft 1 and shaft 2 VW data, or interior and exterior column VW data, to the extent they share an AVW200 unit... a fault at that level could affect both structural locations at once."*

If these two reports were mechanically encoded as contract joint-claim rules today, exactly as written:

- **A's ruleset** would treat shaft-1 and shaft-2 VW readings (or interior/exterior column VW readings) as fully independent corroboration of each other — a **false independence claim**, i.e., exactly the false-permission shape this whole line of falsification work has been probing for, produced not by a dishonest or careless reporter but by a careful, well-cited reviewer who *documented the correct fact* and then dropped it going from observation to rule.
- **B's ruleset** would correctly flag that pairing and require additional scrutiny (REVALIDATE-equivalent) before treating those two locations as independently confirming each other.

Same underlying evidence and system produced different rule coverage through a lossy compression step (raw findings → actionable rules). The dependency omission is directly observed. The different downstream disposition is an inference conditional on encoding the reports into a contract whose default is to permit when no rule blocks; no FHWA action contract was encoded or executed in this experiment. The observed loss still calls for a check such as “does every claim-relevant dependency named in the findings map to a rule or an explicit reason for exclusion?”

### Can either model detect intentionally omitted or falsified metadata?

Partially, and asymmetrically. Each reviewer's own self-assessment (item 6) is itself an answer to this question, applied to their own model:

- A's model, applied mechanically, would **not** catch a report that described VW and RT column systems purely by hardware (separate loggers, modems, enclosures) and omitted the calibration-reference coupling — because that coupling lives in a different part of the source narrative (methods/results) than an equipment inventory (setup/procedure) would typically draw from.
- B's model, applied mechanically, would **not** catch a report that named the four MUXes correctly but omitted the AVW200 pairing one layer up — because a spectrum analyzer reads as "internal wiring detail" rather than an obviously claim-relevant dependency.

Both are real, specific, plausible omission vectors — and, per the previous question, A's own report demonstrates its own vulnerability was not merely hypothetical: A found the AVW200 fact and then independently lost it before it became a rule, which is a more concerning failure mode than either self-assessment describes, because it means the omission does not require an adversary or even carelessness at the sourcing stage — it can happen silently at the synthesis stage in a reviewer who got the underlying fact right.

Neither reviewer's model, nor the two combined, comes with any way to verify the metadata against ground truth independent of the source document itself. Both are equally capable of being fooled by a document that itself omits or misstates a real shared dependency (e.g., the source's own silence on University of Minnesota's downstream processing chain, or on whether Phase III's permanent DAS reuses the same hardware pattern) — the reviewers correctly flagged these as unknowns rather than guessing, which is the right behavior, but "correctly labeled as unknown" is not the same as "detected." Detecting a *falsified* claim (as opposed to an honest gap) was not tested directly in this run — both reviewers worked from an unaltered source document, so this experiment establishes omission-vulnerability under honest-but-incomplete reporting, not adversarial-falsification resistance. That is a real scope limit on this result (see Assumptions).

## Applying the decision rule

1. **"If independent reviewers produce sufficiently consistent models, the architecture survives and we investigate real attestation."** — On the *structural core* (aggregation layers, power design flaw, host-computer convergence, calibration-reference coupling, the cut-wire incident's implications), consistency was real and substantial, reached independently, with no shared framework. This half of the rule's condition is met.
2. **"If substantial disagreement produces unsafe permissions, manual metadata authoring is not a dependable foundation."** — Partially triggered: A's actionable section omits an AVW200 dependency that A's findings identify. Under a default-permit contract this is unsafe-permission-shaped, but the disposition was not mechanically tested against a defined FHWA action. What is demonstrated is the omission; its exact operational consequence remains conditional.
3. **"If existing safety-case or digital-engineering systems already produce this information, our opportunity may be integration and runtime enforcement — not a new metadata system."** — The raw facts needed for a correct dependency model (the AVW200 fact, the calibration-correlation sentence, the incident reports) were already present in an existing engineering report, written for an entirely different purpose (documenting an SHM deployment for FHWA), not authored with "dependency metadata for an automated evaluator" in mind. Nobody had to invent new information to build either reviewer's model — the raw material already existed in conventional engineering documentation. What did *not* already exist, in a directly usable form, was the *structured extraction* of that material into claim-relevant dependency/joint-rule form — that step is exactly what took two full reviewer passes and still diverged. This points toward a hybrid opportunity: existing engineering documentation is a real source of the needed facts, but a structuring/extraction/verification layer is still novel work, not pure integration.
4. **"If obtaining reliable metadata costs more than the decision benefit, we narrow or kill the approach."** — This single experiment cost two full careful reads of one ~50-page excerpt of one system's substructure documentation, by two independent reviewers, and still produced one demonstrated false-independence gap. A real deployment would need this level of scrutiny per system, and — per the I-35W case itself — repeated across every architectural revision (three phases here, each changing the hardware). This is anecdotal cost evidence (n=1 system, n=2 reviewers, single pass, no iteration/review-of-review step that might have caught A's gap), not a validated cost model, but it does not look cheap, and the fact that it still missed something on a single, relatively well-documented system is a real data point against "just have a reviewer document it once and trust that."

**Net read:** this is not a clean pass or a clean kill. Rules 1 and 2 both fired on the same experiment — real consistency on the core structure, and a real, concrete unsafe-permission-shaped gap in one reviewer's own actionable output. That combination is itself the finding: independent human-style review can converge on most of the truth and still silently drop a specific, already-known fact when compressing findings into rules. Whatever comes next (real attestation, a cross-check step between "findings" and "rules," a second reviewer used specifically to audit the first reviewer's rules section rather than to independently re-derive a model) needs to address that compression failure specifically, not just "get more reviewers."

## Assumptions

- Two independent **agent** reviewers were used as a proxy for two independent **human domain experts**, per practical necessity of this environment. Both were instructed to reason as engineering/reliability reviewers and were give no access to each other's work, to the evaluator, or to this project's framework — a real, if imperfect, approximation of independence. Whether human bridge engineers would converge more, or less, than these two agents did is untested and is exactly the kind of thing worth checking if this line of work continues with real domain experts.
- n=1 system, n=2 reviewers, single pass. No claim of statistical generality — this is one data point about whether independent review of one real system's documentation converges, not a validated rate.
- The reviewers worked from an *honest* source document. This experiment tests omission-under-good-faith-incompleteness, not detection of deliberate falsification — a materially different and harder problem your original question also named, left open here.
- The "different action decision" finding (A's dropped AVW200 rule) required my own reading of both reports to notice — neither reviewer flagged it, and no automated cross-check caught it either. That itself is data: the very failure mode being described (a true fact quietly not making it into the actionable rule) recurred one level up, in the process of comparing the two reports, until a third pass (mine) caught it. I do not have a fourth-level check on my own synthesis, and flag that as an open regress, not a solved problem.
- The stored excerpt contains Chapters 2 and 4 and explicitly says Chapter 3 was omitted. Both raw reviewer reports nevertheless refer to some background material as Chapter 3. Because the reports are preserved verbatim, that location error remains visible rather than silently corrected. The comparison relies on the excerpt's page markers and treats non-I-35W case material only as background; exact chapter attribution in the raw reports is not reliable.

## Codex review before commit

The official FHWA report URL and publication metadata are recorded at the top of the source excerpt. Spot checks locate the two-AVW200 architecture, PS100 limitation, partially cut MUX-to-AVW200 wire, theoretical-load calibration, and two-of-eight-shafts coverage statements in the stored extraction.

Accepted: substantial independent overlap, distinct omissions, and Reviewer A's observed findings-to-rules loss.

Corrected: the claimed action difference is conditional rather than mechanically demonstrated, and both raw reports contain a chapter-location error. These corrections strengthen rather than erase the main finding: epistemic information was lost during synthesis even when the underlying dependency had already been found.

## Strongest counterargument

This result could be read as confirming the contract mechanism is fine and metadata authoring is the weak link — exactly what the metadata falsifier's counterargument already predicted. That's a fair reading. But it could equally be read as showing the opposite direction of hope: two independent reviewers, working only from a public engineering document with no purpose-built framework, converged on most of a real system's genuine dependency structure without being taught what a "failure domain" or "joint-claim rule" was supposed to mean — the vocabulary in your original protocol (evidence sources, shared dependencies, affected properties, failure effects, joint-claim rules) turned out to be learnable and appliable by a generic reviewer prompt, not something that required teaching them the CEA schema first. That's a real, positive signal for "the concepts are the right shape for a human expert to reason in," even though "reason correctly all the way through to the rules, every time" remains unproven.

## Discriminating test

Two follow-ups would sharpen this, neither answerable from this repository alone:

1. **A "reviewer-of-rules" pass**: give a third independent reviewer only Reviewer A's §1–§4 findings (not §5) and ask them to derive joint-claim rules from those findings alone, blind to A's own §5. Does an independent rule-derivation step from the same findings catch the AVW200 rule A missed? This would test whether the compression failure is specific to A, or a general property of the findings→rules step regardless of who does it.
2. **A falsification variant**: repeat this same two-reviewer protocol on a source document that has been deliberately, subtly altered — one true shared dependency quietly removed or renamed — and see whether either reviewer's cross-referencing (e.g., noticing an incident report that implies a dependency the equipment list doesn't mention) surfaces the discrepancy. This is the direct test of "falsified metadata," which this run did not attempt.

## Decision status

**Testing — mixed result, not a pass or a kill.** Genuine independent convergence on the structural core of a real system, alongside one concrete, reproducible case of a competent reviewer's own findings not surviving compression into actionable rules. The next real disagreement to have with Codex is whether the fix belongs in reviewer *process* (cross-check findings against rules before treating a model as final) or is evidence that manual metadata authoring — however careful — needs an attestation/verification layer no single reviewer pass can substitute for.

## Note on repository access

Produced from the same Claude Code session (bound to a different repo) that Brayan has been relaying this work into, continuing the access situation already recorded in `validation/2026-09-05_METADATA_INTEGRITY_FALSIFIER_RESULTS.md`. This document and the two reviewer-report files exist only on disk, not committed or pushed — git in this repo still reports dubious ownership under a different Windows account, and no global git config change has been made.
