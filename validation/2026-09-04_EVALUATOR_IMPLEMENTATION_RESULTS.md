# Claim–Evidence–Action Evaluator: Implementation Results

- **Date:** 2026-09-04
- **Author lens:** Claude, optimistic builder (per `COLLABORATION.md`'s current collaboration cycle, step 2)
- **Status:** Testing — mechanically correct against all seven frozen scenarios; two reason-code mismatches identified and proposed for review, not silently resolved

## 1. Proposal

Implement the smallest deterministic evaluator that consumes `contracts/bridge-crossing.contract.json` and produces a `ClaimEvaluation` per claim and one `ActionDisposition`, matching `schemas/cea.schema.json`'s shapes, without altering the frozen contract or the seven frozen scenarios in `scenarios/bridge-crossing.scenarios.json`.

Delivered: `prototype/evaluator.py` (the evaluator), `prototype/fixtures.py` (concrete `EvidenceRecord` data per scenario — the frozen scenario file specifies expected outcomes and prose "given" conditions but no literal evidence records, so fixtures were required and are additive, not a change to frozen files), `prototype/run_scenarios.py` (the test harness).

## 2. Evidence

Running `python run_scenarios.py`:

- **7/7 scenarios mechanically correct** — every `expected_claim_states` entry, every `expected_disposition`, and both `expected_effective_independent_lineages` checks (S-03, S-04) match exactly.
- **5/7 scenarios fully correct**, including exact `reason_codes`. Two do not: S-04 and S-07.

## 3. A simplification worth confirming, not just assuming

The schema defines `DependencyGraph` (`lineages` + `shared_failure_domains`) as a distinct evaluator input. Every `EvidenceRecord` the schema already requires carries its own `parent_evidence_ids` and `failure_domains`. The evaluator derives effective independent lineages entirely from those per-record fields via union-find (two records merge into one lineage if one derives from the other, or if they share any failure domain) and never constructs or consumes a separate `DependencyGraph` object. All three scenarios that test independence (S-01, S-03, S-04) pass exactly this way.

**Assumption this rests on:** `DependencyGraph` doesn't carry information a single evaluation's evidence records can't already supply on their own. This may not hold if the intended use case is dependency tracking that spans *multiple* contracts/evaluations over time (e.g., "this sensor has produced correlated failures across unrelated missions before, even when nothing in today's evidence records says so") — that's a real case a per-evaluation evaluator can't see without an external, persisted dependency store. Worth Codex confirming which is intended before `DependencyGraph` is either dropped or kept.

## 4. Two reason-code mismatches — proposed as a spec question, not resolved unilaterally

Both are cases where the evaluator's mechanical claim states and disposition are correct, but the frozen `expected_reason_codes` string doesn't match what a stateless, general evaluator produces.

### S-04 vs S-01

Both scenarios are five-of-five `CONFIRMED` claims → `PERMIT`. S-01 expects `ALL_REQUIRED_CLAIMS_CONFIRMED`. S-04 expects `POSITION_INDEPENDENTLY_CONFIRMED` — a reason that highlights *which* claim's confirmation is the interesting one in this scenario (C-04's genuine 2-lineage position confirmation), not a generic "all confirmed" statement.

Mechanically, these two scenarios are identical shapes (all claims confirmed, permit). The distinction the frozen suite draws is pedagogical/narrative — it's telling a human reader what this specific scenario is *for* — not a fact recoverable purely from claim states and disposition.

### S-02 vs S-07

Both are a single claim `UNKNOWN` due to stale required evidence → `REVALIDATE`. S-02 expects `REQUIRED_POSITIVE_EVIDENCE_STALE`. S-07 expects `PERMIT_INVALIDATED_BY_EVIDENCE_EXPIRY` — framing this as a *previously-issued permit* being invalidated by a delay between confirmation and execution, not first-time staleness.

A stateless evaluator (no memory of a prior disposition for this `action_id`) cannot distinguish "this evidence was already stale the first time we checked" from "this evidence was fresh when we last checked, and has since expired" — both present identically as of `decision_time`: matching evidence exists, none currently passes the freshness rule. The schema has no `previous_disposition` or `supersedes` field carrying that history into the evaluation.

## 5. Assumptions

- The frozen scenario suite's `expected_reason_codes` are meant to be reproduced exactly by any conforming evaluator (not merely illustrative labels chosen by whoever wrote the scenario).
- A "reusable" evaluator (explicitly required by the novelty research's kill test, item 7: *"the mechanism is reusable rather than manually rebuilt for one vehicle or mission"*) should not special-case scenario-specific narrative framing into its reason-code logic, since that would make the reason codes a function of which test is being run rather than of the evidence itself.

## 6. Strongest counterargument

Both could be resolved without adding real state, by widening the mechanical vocabulary rather than adding memory:

- **S-04:** the evaluator could report a reason code for the tightest-margin confirmed claim (the one whose `effective_independent_lineages` exactly equals its `minimum_independent_lineages`, i.e., confirmed but not with headroom) even when the overall disposition is `PERMIT`. That's a real, mechanical, evidence-derived fact — not narrative guessing — and would make `POSITION_INDEPENDENTLY_CONFIRMED` recoverable generically as "the confirmed claim that needed genuine independence to pass."
- **S-07:** could be resolved with a genuinely small addition — an optional `previous_disposition` input (not a new persisted store, just an optional argument the caller may supply if they have one) — rather than the evaluator needing to persist anything itself. If supplied and it was `PERMIT`, and the new evaluation's only failure is evidence staleness, use `PERMIT_INVALIDATED_BY_EVIDENCE_EXPIRY`; otherwise `REQUIRED_POSITIVE_EVIDENCE_STALE`. This keeps the evaluator itself stateless (the caller owns history) while making the distinction available when it's known.

Neither of these was implemented here — per `COLLABORATION.md`, a proposal record precedes the change, not the reverse, and both are genuine design decisions (do we want a "tightest margin" reason code; do we want an optional history input) rather than obviously-correct fixes.

## 7. Discriminating test

If Codex or Brayan confirm the fixes in §6 are wanted: re-run `run_scenarios.py` after implementing them and check whether S-04 and S-07 move from mechanical match to full match without any other scenario regressing. If confirmed instead that the two mismatches reflect a genuine spec gap (reason codes were never meant to be a pure function of current evidence alone), the resolution is to revise the two `expected_reason_codes` entries in the frozen scenario file — a scenario-file change, which per `prototype/README.md` requires its own separate, written-reason commit, not a silent edit alongside evaluator code.

## 8. Decision status

**Testing.** The evaluator itself is not blocked by this — 7/7 mechanical correctness is real evidence the contract is implementable without unnecessary complexity, which was the assigned question. The two reason-code mismatches are a genuine open question for Codex's falsifier pass, not a defect being hidden.

## 9. What this does not prove

Same discipline as `validation/2026-09-04_FIRST_CLAIM_EVIDENCE_ACTION_CONTRACT.md` already states: a working evaluator against seven authored scenarios does not prove operational suitability, safety certification, robustness against adversarial evidence fabrication, compatibility with real C2 systems, customer demand, or that Project Reality owns a new category. It proves the proposed semantics are implementable and that the seven specified epistemic failures are handled as specified, against these fixtures.
