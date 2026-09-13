'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  evaluateEconomicOutcome,
  type EconomicTaskContract,
  type OutcomeEvidence,
  type ResourceEvent,
} from '@/lib/economic-engine';

const taskBase = {
  taskId: 'TASK-001',
  objective: 'Resolve duplicate invoice dispute INV-1048',
  estimatedValueUsd: 14,
  successCriteria: [
    { id: 'C-01', label: 'Duplicate charge reversed' },
    { id: 'C-02', label: 'Support case closed' },
    { id: 'C-03', label: 'Customer notification delivered' },
  ],
};

const resources: ResourceEvent[] = [
  { id: 'R-01', category: 'MODEL', label: 'Classify dispute and plan resolution', costUsd: 0.08 },
  { id: 'R-02', category: 'API', label: 'Read billing and invoice state', costUsd: 0.03 },
  { id: 'R-03', category: 'TOOL', label: 'Issue credit memo', costUsd: 0.12 },
  { id: 'R-04', category: 'API', label: 'Update support case', costUsd: 0.02 },
  { id: 'R-05', category: 'MODEL', label: 'Create and send customer response', costUsd: 0.09 },
];

const baseEvidence: OutcomeEvidence[] = [
  { id: 'EV-01', criterionId: 'C-01', label: 'Credit memo CM-1048 created', source: 'Billing API', state: 'VERIFIED' },
  { id: 'EV-02', criterionId: 'C-02', label: 'Case CS-281 changed to resolved', source: 'Support API', state: 'VERIFIED' },
  { id: 'EV-03', criterionId: 'C-03', label: 'Delivery receipt for customer notice', source: 'Messaging API', state: 'VERIFIED' },
];

const phases = [
  ['01', 'Task contract'],
  ['02', 'Resource envelope'],
  ['03', 'Execution meter'],
  ['04', 'Outcome evidence'],
  ['05', 'Acceptance gate'],
  ['06', 'Economic record'],
];

export default function AgentEconomicsV1() {
  const [budget, setBudget] = useState(0.8);
  const [evidence, setEvidence] = useState(baseEvidence);
  const [evaluationNumber, setEvaluationNumber] = useState(1);

  const contract: EconomicTaskContract = useMemo(() => ({ ...taskBase, budgetUsd: budget }), [budget]);
  const record = useMemo(() => evaluateEconomicOutcome(contract, resources, evidence), [contract, evidence, evaluationNumber]);
  const verifiedCount = evidence.filter((item) => item.state === 'VERIFIED').length;

  const toggleEvidence = (id: string, checked: boolean) => {
    setEvidence((current) => current.map((item) => item.id === id
      ? { ...item, state: checked ? 'VERIFIED' : 'UNVERIFIED' }
      : item));
  };

  const evaluate = () => setEvaluationNumber((current) => current + 1);

  const exportRecord = () => {
    const blob = new Blob([JSON.stringify({ ...record, evaluationNumber }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `economic-record-${record.taskId.toLowerCase()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="econ-app">
      <header className="econ-topbar">
        <Link href="/" className="econ-brand"><span />REALITY</Link>
        <div className="econ-product"><small>PRODUCT V1</small><strong>Agent Economics</strong><i>SIMULATED WORKFLOW</i></div>
        <nav><Link href="/audit">Reality Audit</Link><Link href="/">Discovery story</Link></nav>
      </header>

      <section className="econ-command">
        <div>
          <p>ECONOMIC CONTROL PLANE / TASK-001</p>
          <h1>Did the agent produce<br /><em>accepted value?</em></h1>
        </div>
        <div className={`econ-verdict ${record.disposition.toLowerCase().replace(' ', '-')}`}>
          <small>ECONOMIC GATE</small>
          <strong>{record.disposition}</strong>
          <span>{record.reasonCodes.join(' · ')}</span>
        </div>
      </section>

      <div className="econ-layout">
        <aside className="econ-phase-rail">
          <div className="econ-panel-label"><span>EXECUTION MAP</span><b>{phases.length} phases</b></div>
          <ol>{phases.map(([number, title], index) => {
            const failed = (record.disposition === 'STOPPED' && index === 1) || (record.disposition === 'NOT ACCEPTED' && index === 3);
            return <li key={number} className={failed ? 'fault' : 'clear'}><span>{number}</span><strong>{title}</strong><i>{failed ? 'ATTENTION' : 'RECORDED'}</i></li>;
          })}</ol>
          <Button className="econ-export" variant="outline" onClick={exportRecord}>Export economic record ↓</Button>
        </aside>

        <section className="econ-workspace">
          <article className="econ-contract-card">
            <div className="econ-panel-label"><span>TASK CONTRACT</span><b>FROZEN BEFORE EXECUTION</b></div>
            <h2>{taskBase.objective}</h2>
            <p>The record closes only when every success criterion has verified evidence and total spend remains inside the resource envelope.</p>
            <div className="econ-contract-grid">
              <label><span>RESOURCE ENVELOPE</span><div><b>$</b><Input aria-label="Resource envelope in US dollars" type="number" min="0.10" max="10" step="0.05" value={budget} onChange={(event) => setBudget(Number(event.target.value) || 0)} /></div></label>
              <div><span>ESTIMATED OUTCOME VALUE</span><strong>${taskBase.estimatedValueUsd.toFixed(2)}</strong><small>Contract input · not independently verified</small></div>
            </div>
          </article>

          <article className="econ-meter-card">
            <div className="econ-panel-label"><span>RESOURCE TRACE</span><b>{resources.length} EVENTS</b></div>
            <div className="econ-resource-list">{resources.map((event) => <div key={event.id}><code>{event.id}</code><span>{event.category}</span><p>{event.label}</p><strong>${event.costUsd.toFixed(2)}</strong></div>)}</div>
            <footer><span>ACTUAL COST</span><strong>${record.actualCostUsd.toFixed(2)}</strong><i>of ${budget.toFixed(2)} envelope</i></footer>
          </article>

          <article className="econ-evidence-card">
            <div className="econ-panel-label"><span>OUTCOME EVIDENCE</span><b>{verifiedCount}/{evidence.length} VERIFIED</b></div>
            <div className="econ-evidence-list">{evidence.map((item) => <div key={item.id}>
              <Switch checked={item.state === 'VERIFIED'} onCheckedChange={(checked) => toggleEvidence(item.id, checked)} aria-label={`Mark ${item.label} verified`} />
              <code>{item.criterionId}</code>
              <p><strong>{item.label}</strong><small>{item.source} · {item.id}</small></p>
              <span className={item.state.toLowerCase()}>{item.state}</span>
            </div>)}</div>
            <Button className="econ-run" onClick={evaluate}>Evaluate economic outcome <span>→</span></Button>
          </article>
        </section>

        <aside className="econ-record-panel">
          <div className="econ-panel-label"><span>ECONOMIC RECORD</span><b>RUN {String(evaluationNumber).padStart(2, '0')}</b></div>
          <div className="econ-metric primary"><span>COST / ACCEPTED OUTCOME</span><strong>{record.disposition === 'ACCEPTED' ? `$${record.actualCostUsd.toFixed(2)}` : '—'}</strong></div>
          <div className="econ-metric"><span>ACCEPTED VALUE</span><strong>${record.acceptedValueUsd.toFixed(2)}</strong></div>
          <div className="econ-metric"><span>VALUE / COST</span><strong>{record.valueCostRatio ? `${record.valueCostRatio.toFixed(1)}×` : '—'}</strong></div>
          <div className="econ-metric"><span>BUDGET REMAINING</span><strong>${record.remainingBudgetUsd.toFixed(2)}</strong></div>
          <section className="econ-criteria">
            <span>SUCCESS CRITERIA</span>
            {record.criterionResults.map((criterion) => <div key={criterion.id}><i className={criterion.state.toLowerCase()} /> <p>{criterion.label}</p><b>{criterion.state}</b></div>)}
          </section>
          <div className="econ-honesty"><span>V1 BOUNDARY</span><p>This proves deterministic record construction in one simulated workflow. It does not yet prove customer value, live integrations, or trustworthy evidence authentication.</p></div>
        </aside>
      </div>
    </main>
  );
}
