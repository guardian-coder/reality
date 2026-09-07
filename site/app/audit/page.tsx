'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type ScenarioKey = 'healthy' | 'stale' | 'shared' | 'identity';
type Health = 'PASS' | 'WARN' | 'FAIL';

type Scenario = {
  label: string;
  disposition: 'PERMIT' | 'REVALIDATE' | 'HUMAN REVIEW' | 'REFUSE';
  summary: string;
  reason: string;
  affected: string;
  health: Record<string, Health>;
};

const phases = [
  ['01', 'Decision scope'],
  ['02', 'Source intake'],
  ['03', 'Claim map'],
  ['04', 'Dependency coverage'],
  ['05', 'Action rules'],
  ['06', 'Attack lab'],
  ['07', 'Decision report'],
];

const sensors = [
  ['grounding', 'Grounding coverage', 'Can every required claim reach an observable source?'],
  ['freshness', 'Freshness', 'Is the evidence current enough for this decision?'],
  ['identity', 'Entity binding', 'Does the evidence describe the correct physical asset?'],
  ['lineage', 'Lineage resolution', 'Can derived evidence be traced to its roots?'],
  ['independence', 'Evidence independence', 'Do confirmations avoid a relevant shared failure?'],
  ['coverage', 'Rule coverage', 'Did every material finding survive into action logic?'],
];

const scenarios: Record<ScenarioKey, Scenario> = {
  healthy: {
    label: 'Healthy baseline',
    disposition: 'PERMIT',
    summary: 'The authored evidence contract is satisfied for this simulated decision.',
    reason: 'All required claims are confirmed by current, entity-bound evidence with resolved lineage.',
    affected: 'No failing checkpoint',
    health: { grounding: 'PASS', freshness: 'PASS', identity: 'PASS', lineage: 'PASS', independence: 'PASS', coverage: 'PASS' },
  },
  stale: {
    label: 'Stale inspection',
    disposition: 'REVALIDATE',
    summary: 'The structural observation is older than the decision contract permits.',
    reason: 'Claim C-02 cannot remain confirmed after its evidence validity window expires.',
    affected: 'Category: Evidence · Phase 02: Source intake',
    health: { grounding: 'PASS', freshness: 'FAIL', identity: 'PASS', lineage: 'PASS', independence: 'PASS', coverage: 'PASS' },
  },
  shared: {
    label: 'Shared dependency',
    disposition: 'HUMAN REVIEW',
    summary: 'Two green claims depend on one signal-conditioning path.',
    reason: 'Apparent confirmation does not meet the required independence threshold.',
    affected: 'Category: Dependencies · Phase 04: Dependency coverage',
    health: { grounding: 'PASS', freshness: 'PASS', identity: 'PASS', lineage: 'PASS', independence: 'WARN', coverage: 'WARN' },
  },
  identity: {
    label: 'Wrong asset identity',
    disposition: 'REFUSE',
    summary: 'The evidence is bound to a different physical structure.',
    reason: 'A correct reading about the wrong bridge cannot establish this action prerequisite.',
    affected: 'Category: Claims · Phase 03: Claim map',
    health: { grounding: 'FAIL', freshness: 'PASS', identity: 'FAIL', lineage: 'PASS', independence: 'PASS', coverage: 'PASS' },
  },
};

const baseEvents = [
  { time: '09:12', phase: '01', category: 'Decision', state: 'PASS', message: 'Action boundary frozen: continue normal inspection cycle.' },
  { time: '09:14', phase: '02', category: 'Evidence', state: 'PASS', message: 'Five public source records registered.' },
  { time: '09:18', phase: '03', category: 'Claims', state: 'PASS', message: 'Three required claims mapped to the target structure.' },
  { time: '09:21', phase: '04', category: 'Dependencies', state: 'PASS', message: 'Root lineages resolved for the baseline.' },
];

export default function RealityAudit() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>('healthy');
  const [events, setEvents] = useState(baseEvents);
  const scenario = scenarios[scenarioKey];

  const claimStates = useMemo(() => [
    ['C-01', 'Correct structure identified', scenarioKey === 'identity' ? 'CONTRADICTED' : 'CONFIRMED'],
    ['C-02', 'Structural observation is valid', scenarioKey === 'stale' ? 'UNKNOWN' : 'CONFIRMED'],
    ['C-03', 'Independent confirmation threshold met', scenarioKey === 'shared' ? 'UNKNOWN' : 'CONFIRMED'],
  ], [scenarioKey]);

  const selectScenario = (key: ScenarioKey) => {
    const next = scenarios[key];
    setScenarioKey(key);
    setEvents((current) => [
      ...current,
      {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        phase: key === 'stale' ? '02' : key === 'identity' ? '03' : key === 'shared' ? '04' : '06',
        category: key === 'stale' ? 'Evidence' : key === 'identity' ? 'Claims' : key === 'shared' ? 'Dependencies' : 'Tests',
        state: next.disposition === 'PERMIT' ? 'PASS' : next.disposition === 'REFUSE' ? 'FAIL' : 'WARN',
        message: `${next.label} evaluated: ${next.disposition}.`,
      },
    ]);
  };

  useEffect(() => {
    type WebMcpContext = {
      registerTool: (tool: Record<string, unknown>, options?: { signal?: AbortSignal }) => void | Promise<void>;
    };
    const context = (document as Document & { modelContext?: WebMcpContext }).modelContext;
    if (!context?.registerTool) return;

    const lifecycle = new AbortController();
    const afterVisibleUpdate = () => new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });

    const register = async () => {
      await context.registerTool({
        name: 'run_reality_audit_scenario',
        title: 'Run Reality Audit scenario',
        description: 'Run one public bridge-audit scenario and update the visible action gate, integrity sensors, and audit memory.',
        inputSchema: {
          type: 'object',
          properties: {
            scenario: { type: 'string', enum: ['healthy', 'stale', 'shared', 'identity'] },
          },
          required: ['scenario'],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute: async (input: unknown) => {
          const key = (input as { scenario?: string })?.scenario;
          if (!key || !(key in scenarios)) throw new Error('Unknown audit scenario.');
          selectScenario(key as ScenarioKey);
          await afterVisibleUpdate();
          const result = scenarios[key as ScenarioKey];
          return { scenario: key, disposition: result.disposition, failureLocator: result.affected };
        },
      }, { signal: lifecycle.signal });

      await context.registerTool({
        name: 'read_reality_audit_state',
        title: 'Read Reality Audit state',
        description: 'Read the current public demonstration scenario, action disposition, sensor health, and checkpoint count.',
        inputSchema: { type: 'object', properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: true, untrustedContentHint: false },
        execute: () => ({
          scenario: scenarioKey,
          disposition: scenario.disposition,
          health: scenario.health,
          checkpointCount: events.length,
        }),
      }, { signal: lifecycle.signal });
    };

    void register().catch(() => {
      // The visible audit remains fully usable when WebMCP is unavailable.
    });
    return () => lifecycle.abort();
  }, [scenarioKey, scenario, events.length]);

  const exportRecord = () => {
    const record = { audit: 'FHWA bridge monitoring · public demonstration', scenario: scenarioKey, disposition: scenario.disposition, reason: scenario.reason, health: scenario.health, events };
    const url = URL.createObjectURL(new Blob([JSON.stringify(record, null, 2)], { type: 'application/json' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `reality-audit-${scenarioKey}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="audit-app">
      <header className="audit-topbar">
        <Link href="/" className="audit-brand"><span />REALITY</Link>
        <div className="audit-context"><small>ACTIVE AUDIT</small><strong>FHWA Bridge Monitoring</strong><span>PUBLIC DEMONSTRATION</span></div>
        <div className="audit-mode"><i /> SHADOW MODE</div>
      </header>

      <div className="audit-layout">
        <aside className="phase-rail">
          <div className="rail-heading"><span>BUILD MAP</span><b>7 phases</b></div>
          <ol>{phases.map(([number, title], index) => {
            const hasFailure = (scenarioKey === 'stale' && index === 1) || (scenarioKey === 'identity' && index === 2) || (scenarioKey === 'shared' && index === 3);
            const state = hasFailure ? (scenarioKey === 'identity' ? 'FAIL' : 'WARN') : index < 6 ? 'PASS' : scenario.disposition === 'PERMIT' ? 'PASS' : 'WARN';
            return <li key={number} className={state.toLowerCase()}><span>{number}</span><div><strong>{title}</strong><small>{state}</small></div></li>;
          })}</ol>
          <button className="export-button" onClick={exportRecord}>Export audit memory <span>↓</span></button>
        </aside>

        <section className="audit-workspace">
          <div className="workspace-heading">
            <div><p>CATEGORY 06 / ATTACK LAB</p><h1>Can this action<br />earn permission?</h1></div>
            <div className={`gate-stamp ${scenario.disposition.toLowerCase().replace(' ', '-')}`}><small>ACTION GATE</small><strong>{scenario.disposition}</strong></div>
          </div>

          <div className="scenario-strip" aria-label="Test scenarios">{(Object.keys(scenarios) as ScenarioKey[]).map((key) => (
            <button key={key} className={scenarioKey === key ? 'active' : ''} onClick={() => selectScenario(key)}><span>{scenarios[key].label}</span><small>{key === 'healthy' ? 'BASELINE' : 'INJECT FAILURE'}</small></button>
          ))}</div>

          <article className="decision-card">
            <div className="decision-meta"><span>PROPOSED ACTION</span><b>Continue normal inspection cycle</b></div>
            <h2>{scenario.summary}</h2>
            <p>{scenario.reason}</p>
            <div className="failure-locator"><span>FAILURE LOCATOR</span><strong>{scenario.affected}</strong></div>
          </article>

          <section className="claim-section">
            <div className="section-label"><span>REQUIRED CLAIMS</span><span>STATE AFTER EVALUATION</span></div>
            {claimStates.map(([id, claim, state]) => <div className="claim-row" key={id}><code>{id}</code><strong>{claim}</strong><span className={state.toLowerCase()}>{state}</span></div>)}
          </section>

          <section className="memory-section">
            <div className="section-label"><span>AUDIT MEMORY</span><span>{events.length} CHECKPOINT EVENTS</span></div>
            <div className="memory-log">{events.slice().reverse().map((event, index) => (
              <div className="memory-row" key={`${event.time}-${index}`}><time>{event.time}</time><code>P{event.phase}</code><span>{event.category}</span><b className={event.state.toLowerCase()}>{event.state}</b><p>{event.message}</p></div>
            ))}</div>
          </section>
        </section>

        <aside className="sensor-rail">
          <div className="rail-heading"><span>INTEGRITY SENSORS</span><b>{sensors.filter(([key]) => scenario.health[key] === 'PASS').length}/{sensors.length} clear</b></div>
          <div className="sensor-stack">{sensors.map(([key, name, description]) => {
            const state = scenario.health[key];
            return <article key={key} className={state.toLowerCase()}><div><i /><span>{state}</span></div><h3>{name}</h3><p>{description}</p></article>;
          })}</div>
          <div className="sensor-note"><span>NURU // SYSTEM NOTE</span><p>A green claim is not enough. Trace what allowed it to become green.</p></div>
        </aside>
      </div>
    </main>
  );
}
