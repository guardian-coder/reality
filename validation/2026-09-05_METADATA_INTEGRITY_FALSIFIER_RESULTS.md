# Dependency-Metadata Integrity Falsifier — Results

- **Date:** 2026-09-05
- **Status:** Falsifier written and run locally; conceptual and experimental only. No evaluator, contract, or scenario file was changed.
- **Author:** Claude, optimistic-builder lens, per `COLLABORATION.md`'s current collaboration cycle.
- **Answers:** the "Discriminating test" in `validation/2026-09-05_TYPED_DEPENDENCY_AND_JOINT_RULE_RESULTS.md`.
- **Script:** `prototype/run_metadata_integrity_falsifier.py` (new file, not yet committed — repo ownership prevented git access from this session; see note at the end).

## Proposal

The typed dependency/joint-rule work (2026-09-05) named its own open question: the new types could just move the hard problem into metadata authorship. This falsifier tests that directly, in four parts:

1. Can missing `failure_domains` metadata produce a false `PERMIT`?
2. Can false (mislabeled) `failure_domains` metadata produce a false `PERMIT`?
3. Can fabricated `failure_domains` metadata produce a false denial (the mirror-image attack)?
4. Can a domain expert author the needed metadata and a joint rule from an independently described system, without changing evaluator code?

It also compares three policies for handling missing/unattested metadata — fail-open (today's implicit behavior), fail-closed-on-missing, and authenticated-only — on false-permission and false-refusal outcomes.

## Evidence

Six forcing cases, run against the unmodified evaluator (black-box: alternate policies are simulated as evidence-level preprocessing before calling `evaluate_action`, never by patching evaluator internals):

| Case | Attack | Expected (honest metadata) | Actual | Result |
|---|---|---|---|---|
| M-01 | One of two genuinely-shared roots simply omits `failure_domains` | REVALIDATE | PERMIT | **false permission** |
| M-02 | Both roots declare the shared domain, but `affected_properties` excludes the property it actually threatens | REVALIDATE | PERMIT | **false permission** |
| M-03 | Both roots correctly scope the domain, but `failure_effect` is mislabeled `UNAVAILABLE` instead of the true `COMMON_BIAS` | REVALIDATE | PERMIT | **false permission** |
| M-04 | A fabricated shared domain is injected onto two genuinely independent roots | PERMIT | REVALIDATE | **false denial** |
| M-05 | Same missing-metadata vector as M-01, applied to a `joint_claim_rule` instead of single-claim independence | REVALIDATE | PERMIT | **false permission** |
| M-06 | A domain expert invents a new failure_effect (`LATENCY_ONLY`) with the same non-correlating intent as the evaluator's one hardcoded exception (`UNAVAILABLE`) | PERMIT (expert's own stated intent) | REVALIDATE | **expert cannot express intent through data alone** |

6/6 proposed gaps reproduced against today's evaluator. These are constructed forcing cases, not observations from an operational system. M-01 and M-05 also omit a schema-required field, so they specifically show that the evaluator currently accepts schema-invalid input; runtime schema validation would reject those two inputs but would not establish that present metadata is true. M-02 through M-04 are schema-shaped but semantically false. M-06 uses a value outside the schema's closed enum and therefore demonstrates a schema-and-code vocabulary boundary, not only an evaluator-function limitation.

Codex review added M-07: a producer can attach the illustrative `metadata_integrity_status: VERIFIED` marker to false metadata. The marker-only preprocessing then returns `PERMIT`. This confirms that a writable flag is not authentication; a real design would need identity, authority, signature/attestation verification, and lifecycle semantics rather than trusting the marker itself.

### Policy comparison (missing-metadata case, one symmetric variant added)

| Case | fail-open (current) | fail-closed-missing | verified-marker-only (simulation) |
|---|---|---|---|
| M-01: one root missing, one root declares the real domain | PERMIT | **PERMIT** | REVALIDATE |
| M-01b: both roots missing (symmetric) | PERMIT | REVALIDATE | REVALIDATE |

The first row is the important negative result. The naive fail-closed fix — "fold every record with no `failure_domains` key into one shared `UNDECLARED-DEPENDENCY` bucket" — only catches the symmetric case where every side of a real correlation is missing metadata the same way. It does **not** catch the asymmetric case (one side honestly declares the real domain, the other's declaration is simply absent), because the honestly-declared domain keeps its own id and never collides with the sentinel the other root falls into. Asymmetric is also the more realistic shape of the failure: it only takes one careless integration, not two.

`verified-marker-only` catches both rows because it does not treat "missing" as the special trigger. It discards any domain claim, present or absent, that lacks the marker, so an honest-but-unmarked declaration and a silently omitted one collapse to the same untrusted state. The cost is symmetric with the benefit: it forces `REVALIDATE` on every claim resting on any unmarked domain declaration. More importantly, M-07 shows that the marker can simply be forged. This policy demonstrates the behavior a real attestation boundary might enable; it is not itself authentication.

## Assumptions

- `metadata_integrity_status` as simulated here is illustrative, not a real attestation design — no signing, no registered-authority check, just a boolean flag on the fixture. M-07 proves the distinction directly. Building the real thing (who signs a failure-domain claim, against what registry, revocable how) is unstarted work, not a small addition.
- The five-value `failure_effect` vocabulary problem in M-06 is a single concrete instance of a more general fact confirmed here empirically: `_domain_relevant_to_claim` in `evaluator.py` special-cases exactly one string (`"UNAVAILABLE"`). Every other effect, however accurately or inaccurately named, collapses independence. A domain expert who understands the physical system but not the evaluator's source has no way to add a second non-correlating effect category without asking a programmer to edit that function.
- By contrast, `joint_claim_rules` (tested previously via X-02) are genuinely data-driven — a domain expert *can* author a new joint rule from contract JSON alone, no code change needed. The asymmetry between these two mechanisms — one is real end-user configuration, the other only looks like it — is itself worth carrying into `docs/26` line of work if this contract pattern generalizes past the bridge scenario.
- These six cases exercise `position_accuracy` (C-04) and one identity/position joint rule; they were not repeated against every claim property, though the mechanism being tested is generic to `_domain_relevant_to_claim` and `_joint_rule_violation`, not claim-specific.

## Strongest counterargument

None of this proves the mechanism is wrong for its stated scope. The prior document's own decision status already said the paired semantic gaps were "mechanically closed for the simulation" and explicitly not a claim about metadata availability. This falsifier confirms exactly the gap that document predicted, at the same conceptual/experimental level — it is evidence the predicted gap is real and concrete, not evidence the overall CEA contract approach is wrong. A system that requires trustworthy dependency metadata to make trustworthy decisions is not unusual; the open question is whether that metadata can realistically be produced and attested for a real physical system, which is an operational question this desk exercise cannot answer.

## Discriminating test

Two things would move this forward, neither answerable from this repository alone:

1. Take an independently-described real dependency graph (not one either agent invented for the test) and see whether a person with domain knowledge of that system, but no view of `evaluator.py`, can author the `failure_domains` and `joint_claim_rules` entries needed to reproduce the correct disposition — and separately, whether they hit the M-06 wall (wanting a new non-correlating effect category the evaluator doesn't recognize).
2. Decide whether an attestation mechanism for dependency metadata is in scope for this simulation at all, or is being deferred the same way `DEGRADE` already is (E-04) — if deferred, that should be stated as explicitly as the `DEGRADE` gap already is, not left implicit.

## Decision status

**Testing.** Six original gaps and the added forged-marker gap were reproduced, alongside one real negative result about naive fail-closed fixes and one concrete instance of the closed vocabulary limit. This does not validate or invalidate the contract mechanism itself — it sharpens exactly where the "moves the hard problem into metadata authorship" counterargument bites, per this repo's own prior prediction.

## Note on repository access

This was produced from a Claude Code session whose working directory is a separate repo (`real-life-gaming-platform`). Brayan relayed the status update and next step into that session. `git` in this repo reported "dubious ownership" (the `.git` directory is owned by a different Windows account, consistent with Codex operating here from its own sandboxed identity) and refused all operations without a global `safe.directory` config change. Per Brayan's explicit choice, that change was not made — this falsifier script and this document exist as new files on disk only, not committed or pushed. Whoever has real write access to this repo should review and commit them (or reject them) rather than treat them as already part of the record.
