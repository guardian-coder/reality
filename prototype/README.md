# Claim–Evidence–Action Gate Prototype

This directory contains the machine-readable specification for the first safe Reality Coupling experiment.

It does not contain an evaluator yet. The contract and expected scenario results are frozen before implementation so the evaluator can be tested against predeclared behavior.

## Decision

May a simulated autonomous logistics vehicle cross `bridge-alpha` now?

## Contents

- `schemas/cea.schema.json` — JSON Schema for action contracts, claim requirements, evidence records, dependency graphs, claim evaluations, and action dispositions.
- `contracts/bridge-crossing.contract.json` — the first machine-readable contract.
- `scenarios/bridge-crossing.scenarios.json` — seven frozen scenarios and expected results.

## Next implementation rule

The evaluator must consume these files without changing their expected outcomes. Any required schema or scenario change must be committed separately with a written reason before evaluator code is changed.

