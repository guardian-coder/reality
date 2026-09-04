# First Claim–Evidence–Action Contract

- **Date:** 2026-09-04
- **Status:** Prototype specification; not operationally validated
- **Environment:** Non-weaponized IoBT simulation
- **Decision:** May an autonomous logistics vehicle cross a simulated bridge now?

## Why this decision

This case is deliberately small but contains the mechanisms Project Reality needs to test:

- the physical state can change;
- evidence becomes stale;
- sources can disagree;
- several observations can share one hidden dependency;
- absence of a warning is not positive confirmation;
- an action must be permitted, degraded, revalidated, reviewed, or refused.

The purpose is not to optimize routes or control a real vehicle. It is to test whether preserving epistemic state and evidence independence prevents unsafe permission in simulation.

## Action under control

```text
ACTION: CROSS_BRIDGE
ASSET: simulated autonomous logistics vehicle
BRIDGE: bridge-alpha
TIME: current decision time
```

The action gate is the only component allowed to issue a crossing permit.

## Required claims

### C-01 — Bridge identity is confirmed

The observed bridge is `bridge-alpha`, the bridge named in the action request.

Required state: `CONFIRMED`

### C-02 — Bridge is currently passable for this vehicle

The bridge's current physical condition and declared load capacity support the simulated vehicle.

Required state: `CONFIRMED`

### C-03 — Approach and crossing path are currently unobstructed

No detected obstruction prevents the vehicle from entering and completing the crossing.

Required state: `CONFIRMED`

### C-04 — Position estimate is sufficiently trustworthy

The vehicle and bridge positions are bound to the correct entities and satisfy the simulation's location tolerance.

Required state: `CONFIRMED`

### C-05 — No active stop condition exists

No authenticated operator stop, known structural alarm, or contradictory high-integrity observation is active.

Required state: not `CONTRADICTED`

## Epistemic states

Every claim must have exactly one state:

- `CONFIRMED`: required positive evidence is present, current, attributable, and sufficiently independent.
- `CONTRADICTED`: qualifying evidence conflicts with the claim or an explicit stop condition is active.
- `UNKNOWN`: confirmation requirements are not met, evidence is missing or stale, identity is unresolved, or dependence is too high.

Rules:

1. `UNKNOWN` is not `CONFIRMED`.
2. Absence of contradicting evidence is not positive confirmation.
3. A previous confirmation expires when its evidence exceeds the freshness limit.
4. Three records derived from one root observation count as one evidence lineage.
5. Sources sharing a relevant failure domain are not fully independent for that claim.
6. A model-generated conclusion is derived evidence, not an independent observation of reality.

## Evidence records

Every evidence item must carry:

| Field | Meaning |
|---|---|
| `evidence_id` | Stable unique identity |
| `source_id` | Sensor, operator, service, or model that produced it |
| `observed_entity_id` | Object or region the evidence claims to describe |
| `observation_time` | When reality was observed |
| `received_time` | When the system received the record |
| `valid_until` | End of the evidence's allowed freshness window |
| `claim_ids` | Claims the record may support or contradict |
| `value` | Observation or assertion |
| `uncertainty` | Measurement or classification uncertainty |
| `parent_evidence_ids` | Inputs used to derive this record |
| `failure_domains` | Shared dependencies such as GPS, power, clock, network, model, operator, or upstream track |
| `integrity_status` | Whether identity and record integrity checks passed |

## Allowed evidence by claim

### C-01 — Bridge identity

Requires two identity cues that do not share the same root observation:

- geospatial/map association; and
- independent visual marker, surveyed landmark, or authenticated infrastructure identifier.

Two applications reading the same map database are one lineage, not two confirmations.

### C-02 — Current passability

Requires:

- an authenticated load-capacity record applicable to this vehicle class; and
- one current physical-condition observation; and
- no qualifying structural alarm.

A historical inspection alone cannot confirm current condition.

### C-03 — Unobstructed path

Requires one current observation covering the full approach and crossing path. A partial view leaves the uncovered section `UNKNOWN`.

### C-04 — Position trustworthiness

Requires location support from at least two methods without the same relevant failure domain.

Example accepted pair:

- satellite positioning; and
- local visual landmark matching.

Example rejected pair:

- vehicle GPS receiver; and
- drone GPS receiver when both rely on the same spoofed satellite signal and no plausibility check exists.

### C-05 — No stop condition

Requires successful retrieval of the current authenticated stop-condition register. Failure to retrieve it does not mean no stop exists; it produces `UNKNOWN`.

## Contract evaluation

| Condition | Disposition |
|---|---|
| C-01 through C-04 are `CONFIRMED` and C-05 is not `CONTRADICTED` | `PERMIT` |
| A claim is supportable at a reduced operating envelope defined before the test | `DEGRADE` |
| A required claim is `UNKNOWN` and a specific observation can resolve it | `REVALIDATE` |
| Evidence conflict cannot be resolved automatically within the time limit | `HUMAN_REVIEW` |
| Any safety-critical claim is `CONTRADICTED`, integrity fails, or no safe degraded mode exists | `REFUSE` |

`DEGRADE` may not be invented at runtime. Its reduced speed, load, or route conditions must be defined before the scenario and must have their own evidence requirements.

## Initial test scenarios

### S-01 — Complete independent confirmation

All five claims meet their contracts using current evidence with adequate independence.

Expected result: `PERMIT`.

### S-02 — No structural warning, but no current inspection

The system finds no alarm. The last physical inspection is outside its freshness window.

Expected result: C-02 = `UNKNOWN`; disposition = `REVALIDATE`, not `PERMIT`.

### S-03 — Three apparent position sources, one shared dependency

Vehicle GPS, drone GPS, and a fused location service agree, but the fused service derives from those same GPS readings and all share the satellite-positioning failure domain.

Expected result: effective independent support = one; C-04 = `UNKNOWN`; disposition = `REVALIDATE`.

### S-04 — Genuine independent position evidence

Satellite positioning agrees with local visual-landmark matching whose camera, model, clock, and map reference do not share the relevant positioning failure.

Expected result: C-04 may become `CONFIRMED` if both inputs meet quality and freshness requirements.

### S-05 — Contradictory bridge condition

A current visual observation suggests an unobstructed bridge, but an authenticated structural sensor reports a critical condition.

Expected result: C-02 = `CONTRADICTED`; disposition = `REFUSE` or `HUMAN_REVIEW` according to the predeclared safety policy. Never `PERMIT`.

### S-06 — Lost stop-condition service

The action gate cannot retrieve the current authenticated stop register.

Expected result: C-05 = `UNKNOWN`; disposition = `REVALIDATE` and then `REFUSE` if the time limit expires.

### S-07 — Stale confirmation after delay

All claims were confirmed, but execution is delayed beyond the validity window of the path observation.

Expected result: C-03 transitions automatically to `UNKNOWN`; the old permit is invalidated; disposition = `REVALIDATE`.

## Comparators

Run every scenario against four systems:

1. **Simple voting:** count agreeing sources.
2. **Confidence-only fusion:** combine confidence without retaining lineage or failure domains.
3. **Provenance-only:** retain lineage but do not enforce claim contracts at the action boundary.
4. **Claim–Evidence–Action Contract:** retain epistemic state and dependencies and enforce the result before action.

## Measurements

- unsafe permits;
- safe permits;
- unnecessary refusals;
- correct `UNKNOWN` states;
- correlated evidence counted as independent;
- stale evidence accepted;
- contradictions preserved to the action boundary;
- revalidation success and latency;
- time from action request to disposition;
- whether an evaluator can reconstruct why the disposition occurred.

No success threshold is invented yet. Thresholds must be frozen before implementation and justified against the scenarios and comparator behavior.

## What would falsify the mechanism

- The full contract does not prevent unsafe permissions beyond a simpler existing monitor.
- Dependency modeling adds complexity but no measurable improvement over conservative fusion.
- False refusals make the mechanism unusable under representative degraded conditions.
- The required failure-domain information cannot be obtained or maintained across interfaces.
- A known existing runtime implements the same contract and performs as well or better.

## What this test cannot prove

A successful simulation would not prove:

- battlefield effectiveness;
- safety certification;
- robustness against every adversary;
- compatibility with deployed C2 systems;
- customer demand or willingness to pay;
- that Project Reality owns a new category.

It would prove only that the proposed semantics can be implemented and that they prevent specified epistemic failures better than the chosen baselines.

## Next implementation artifact

Before writing the engine, define machine-readable schemas for:

1. `ActionContract`;
2. `ClaimRequirement`;
3. `EvidenceRecord`;
4. `DependencyGraph`;
5. `ClaimEvaluation`; and
6. `ActionDisposition`.

Then freeze the seven scenarios as executable tests before implementing the evaluator.
