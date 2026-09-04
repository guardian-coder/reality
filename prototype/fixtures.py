"""
Concrete EvidenceRecord fixtures for the seven frozen bridge-crossing
scenarios (scenarios/bridge-crossing.scenarios.json). That file
specifies expected outcomes and prose "given" conditions but no
literal evidence data - this file supplies it, additively, without
altering anything in the frozen contract or scenario file, per
prototype/README.md's "Next implementation rule."

DECISION_TIME matches the suite's frozen decision_time exactly
(2026-09-04T12:00:00Z). All timestamps below are constructed relative
to it so each scenario's fixture demonstrates the specific mechanism
its "given" describes.
"""

DECISION_TIME = "2026-09-04T12:00:00Z"


def _baseline_evidence():
    """A fully-confirming evidence set for all five claims - the
    fixture used verbatim by S-01, and the starting point every other
    scenario overrides only where its own "given" says to."""
    return [
        # C-01: bridge identity, two genuinely independent lineages.
        {
            "evidence_id": "ev-c01-map", "source_id": "map-db-1",
            "observed_entity_id": "bridge-alpha",
            "observation_time": "2026-09-04T11:00:00Z", "received_time": "2026-09-04T11:00:01Z",
            "valid_until": "2026-09-05T11:00:00Z",
            "claim_ids": ["C-01"], "evidence_type": "MAP_ASSOCIATION",
            "value": "bridge-alpha", "uncertainty": 0.0,
            "parent_evidence_ids": [], "failure_domains": ["map-database-1"],
            "integrity_status": "VERIFIED",
        },
        {
            "evidence_id": "ev-c01-cue", "source_id": "visual-landmark-1",
            "observed_entity_id": "bridge-alpha",
            "observation_time": "2026-09-04T11:58:00Z", "received_time": "2026-09-04T11:58:01Z",
            "valid_until": "2026-09-04T12:05:00Z",
            "claim_ids": ["C-01"], "evidence_type": "INDEPENDENT_IDENTITY_CUE",
            "value": "surveyed-landmark-42", "uncertainty": 0.02,
            "parent_evidence_ids": [], "failure_domains": ["onboard-camera-01"],
            "integrity_status": "VERIFIED",
        },
        # C-02: passability, load record + fresh condition observation.
        {
            "evidence_id": "ev-c02-load", "source_id": "structural-registry-1",
            "observed_entity_id": "bridge-alpha",
            "observation_time": "2026-08-20T09:00:00Z", "received_time": "2026-08-20T09:00:01Z",
            "valid_until": "2026-09-19T09:00:00Z",
            "claim_ids": ["C-02"], "evidence_type": "LOAD_CAPACITY_RECORD",
            "value": {"max_load_kg": 40000}, "uncertainty": 0.0,
            "parent_evidence_ids": [], "failure_domains": ["structural-registry-1"],
            "integrity_status": "VERIFIED",
        },
        {
            "evidence_id": "ev-c02-cond", "source_id": "visual-inspector-1",
            "observed_entity_id": "bridge-alpha",
            "observation_time": "2026-09-04T11:57:00Z", "received_time": "2026-09-04T11:57:01Z",
            "valid_until": "2026-09-04T12:02:00Z",
            "claim_ids": ["C-02"], "evidence_type": "PHYSICAL_CONDITION_OBSERVATION",
            "value": "no visible damage", "uncertainty": 0.05,
            "parent_evidence_ids": [], "failure_domains": ["onboard-camera-01"],
            "integrity_status": "VERIFIED",
        },
        # C-03: unobstructed path, fresh full-path observation.
        {
            "evidence_id": "ev-c03-path", "source_id": "onboard-camera-1",
            "observed_entity_id": "bridge-alpha-path",
            "observation_time": "2026-09-04T11:59:30Z", "received_time": "2026-09-04T11:59:31Z",
            "valid_until": "2026-09-04T12:00:30Z",
            "claim_ids": ["C-03"], "evidence_type": "FULL_PATH_OBSERVATION",
            "value": "clear", "uncertainty": 0.03,
            "parent_evidence_ids": [], "failure_domains": ["onboard-camera-01"],
            "integrity_status": "VERIFIED",
        },
        # C-04: position, two genuinely independent methods.
        {
            "evidence_id": "ev-c04-gps", "source_id": "vehicle-gps-1",
            "observed_entity_id": "logistics-vehicle-01",
            "observation_time": "2026-09-04T11:59:45Z", "received_time": "2026-09-04T11:59:46Z",
            "valid_until": "2026-09-04T12:00:15Z",
            "claim_ids": ["C-04"], "evidence_type": "POSITION_OBSERVATION",
            "value": {"lat": 0.0, "lon": 0.0}, "uncertainty": 0.1,
            "parent_evidence_ids": [], "failure_domains": ["gps-signal-01"],
            "integrity_status": "VERIFIED",
        },
        {
            "evidence_id": "ev-c04-landmark", "source_id": "visual-landmark-matcher-1",
            "observed_entity_id": "logistics-vehicle-01",
            "observation_time": "2026-09-04T11:59:50Z", "received_time": "2026-09-04T11:59:51Z",
            "valid_until": "2026-09-04T12:00:20Z",
            "claim_ids": ["C-04"], "evidence_type": "POSITION_OBSERVATION",
            "value": {"lat": 0.0001, "lon": 0.0001}, "uncertainty": 0.15,
            "parent_evidence_ids": [], "failure_domains": ["onboard-camera-01"],
            "integrity_status": "VERIFIED",
        },
        # C-05: no active stop condition.
        {
            "evidence_id": "ev-c05-stop", "source_id": "stop-register-service-1",
            "observed_entity_id": "logistics-vehicle-01",
            "observation_time": "2026-09-04T11:59:55Z", "received_time": "2026-09-04T11:59:56Z",
            "valid_until": "2026-09-04T12:00:10Z",
            "claim_ids": ["C-05"], "evidence_type": "STOP_REGISTER_SNAPSHOT",
            "value": "no_stop_active", "uncertainty": 0.0,
            "parent_evidence_ids": [], "failure_domains": ["stop-register-service-1"],
            "integrity_status": "VERIFIED",
        },
    ]


def _drop(evidence, *evidence_ids):
    return [e for e in evidence if e["evidence_id"] not in evidence_ids]


def build_scenario_evidence(scenario_id):
    ev = _baseline_evidence()

    if scenario_id == "S-01":
        return ev

    if scenario_id == "S-02":
        # No structural alarm; the only condition observation is stale
        # (its freshness window expired well before decision_time).
        ev = _drop(ev, "ev-c02-cond")
        ev.append({
            "evidence_id": "ev-c02-cond-stale", "source_id": "visual-inspector-1",
            "observed_entity_id": "bridge-alpha",
            "observation_time": "2026-09-01T09:00:00Z", "received_time": "2026-09-01T09:00:01Z",
            "valid_until": "2026-09-01T09:05:00Z",
            "claim_ids": ["C-02"], "evidence_type": "PHYSICAL_CONDITION_OBSERVATION",
            "value": "no visible damage (3 days old)", "uncertainty": 0.05,
            "parent_evidence_ids": [], "failure_domains": ["onboard-camera-01"],
            "integrity_status": "VERIFIED",
        })
        return ev

    if scenario_id == "S-03":
        # Vehicle GPS, drone GPS, and a fused location derived from both -
        # three records, one effective lineage (shared gps-signal-01
        # failure domain, and the fused record is a direct child).
        ev = _drop(ev, "ev-c04-gps", "ev-c04-landmark")
        ev += [
            {
                "evidence_id": "ev-c04-vgps", "source_id": "vehicle-gps-1",
                "observed_entity_id": "logistics-vehicle-01",
                "observation_time": "2026-09-04T11:59:45Z", "received_time": "2026-09-04T11:59:46Z",
                "valid_until": "2026-09-04T12:00:15Z",
                "claim_ids": ["C-04"], "evidence_type": "POSITION_OBSERVATION",
                "value": {"lat": 0.0, "lon": 0.0}, "uncertainty": 0.1,
                "parent_evidence_ids": [], "failure_domains": ["gps-signal-01"],
                "integrity_status": "VERIFIED",
            },
            {
                "evidence_id": "ev-c04-dgps", "source_id": "drone-gps-1",
                "observed_entity_id": "logistics-vehicle-01",
                "observation_time": "2026-09-04T11:59:47Z", "received_time": "2026-09-04T11:59:48Z",
                "valid_until": "2026-09-04T12:00:17Z",
                "claim_ids": ["C-04"], "evidence_type": "POSITION_OBSERVATION",
                "value": {"lat": 0.0, "lon": 0.0}, "uncertainty": 0.1,
                "parent_evidence_ids": [], "failure_domains": ["gps-signal-01"],
                "integrity_status": "VERIFIED",
            },
            {
                "evidence_id": "ev-c04-fused", "source_id": "fused-location-service-1",
                "observed_entity_id": "logistics-vehicle-01",
                "observation_time": "2026-09-04T11:59:49Z", "received_time": "2026-09-04T11:59:50Z",
                "valid_until": "2026-09-04T12:00:19Z",
                "claim_ids": ["C-04"], "evidence_type": "POSITION_OBSERVATION",
                "value": {"lat": 0.0, "lon": 0.0}, "uncertainty": 0.05,
                "parent_evidence_ids": ["ev-c04-vgps", "ev-c04-dgps"],
                "failure_domains": ["gps-signal-01"],
                "integrity_status": "VERIFIED",
            },
        ]
        return ev

    if scenario_id == "S-04":
        return ev  # identical to baseline - genuine 2-lineage position confirmation.

    if scenario_id == "S-05":
        # Visual evidence still says fine; an authenticated structural
        # sensor contradicts it.
        ev.append({
            "evidence_id": "ev-c02-alarm", "source_id": "structural-sensor-1",
            "observed_entity_id": "bridge-alpha",
            "observation_time": "2026-09-04T11:59:00Z", "received_time": "2026-09-04T11:59:01Z",
            "valid_until": "2026-09-04T12:10:00Z",
            "claim_ids": ["C-02"], "evidence_type": "STRUCTURAL_ALARM",
            "value": "critical_stress_reading", "uncertainty": 0.02,
            "parent_evidence_ids": [], "failure_domains": ["structural-sensor-network-1"],
            "integrity_status": "VERIFIED", "stance": "CONTRADICTS",
        })
        return ev

    if scenario_id == "S-06":
        # Stop register cannot be retrieved at all - zero evidence for C-05.
        return _drop(ev, "ev-c05-stop")

    if scenario_id == "S-07":
        # Everything was confirmed, but execution was delayed past the
        # full-path observation's freshness window.
        ev = _drop(ev, "ev-c03-path")
        ev.append({
            "evidence_id": "ev-c03-path-expired", "source_id": "onboard-camera-1",
            "observed_entity_id": "bridge-alpha-path",
            "observation_time": "2026-09-04T11:55:00Z", "received_time": "2026-09-04T11:55:01Z",
            "valid_until": "2026-09-04T11:56:00Z",
            "claim_ids": ["C-03"], "evidence_type": "FULL_PATH_OBSERVATION",
            "value": "clear (now expired)", "uncertainty": 0.03,
            "parent_evidence_ids": [], "failure_domains": ["onboard-camera-01"],
            "integrity_status": "VERIFIED",
        })
        return ev

    raise ValueError(f"Unknown scenario_id: {scenario_id}")
