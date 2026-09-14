'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, ArrowRight, Check, CircleDot, Copy, Database, KeyRound, Network, Play, RefreshCw, ShieldCheck, Webhook } from 'lucide-react';

type Workspace = { id: string; name: string; tokenPrefix: string };
type Task = { externalId: string; objective: string; budgetMicros: number; estimatedValueMicros: number; criteriaJson: string; updatedAt: string };
type Run = { taskExternalId: string; runId: string; policyVersion: string; createdAt: string };
type Event = { id: string; taskExternalId: string; runId: string; eventType: string; category?: string; label: string; costMicros: number; criterionId?: string; evidenceState?: string; source?: string; receivedAt: string };
type Authorization = { id: string; taskExternalId: string; runId: string; label: string; disposition: string; reasonCode: string; policyVersion: string; createdAt: string };
type StoredRecord = { id: string; taskExternalId: string; runId: string; disposition: string; actualCostMicros: number; acceptedValueMicros: number; policyVersion: string; recordJson: string; updatedAt: string };
type Overview = { workspace: Workspace | null; tasks: Task[]; runs: Run[]; events: Event[]; authorizations: Authorization[]; records: StoredRecord[] };

const empty: Overview = { workspace: null, tasks: [], runs: [], events: [], authorizations: [], records: [] };

export default function EconomicsConsole({ displayName }: { displayName: string }) {
  const [data, setData] = useState<Overview>(empty);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  const refresh = useCallback(async () => {
    const response = await fetch('/api/economics/workspace', { cache: 'no-store' });
    if (!response.ok) throw new Error('The control plane could not load.');
    setData(await response.json());
  }, []);

  useEffect(() => { refresh().catch((e) => setError(e.message)).finally(() => setLoading(false)); }, [refresh]);

  const create = async () => {
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/economics/workspace', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: 'Reality operations' }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Workspace creation failed.');
      setToken(result.token); await refresh();
    } catch (e) { setError(e instanceof Error ? e.message : 'Workspace creation failed.'); }
    finally { setBusy(false); }
  };

  const copy = async (value: string, label: string) => {
    await navigator.clipboard.writeText(value); setCopied(label); window.setTimeout(() => setCopied(''), 1600);
  };

  const runTest = async () => {
    if (!token) return;
    setBusy(true); setError('');
    const authorization = { authorization: `Bearer ${token}`, 'content-type': 'application/json' };
    try {
      const runId = `run-${Date.now()}`;
      const task = { id: 'invoice-resolution-001', objective: 'Resolve a duplicate customer charge', budgetUsd: 1, estimatedValueUsd: 14, successCriteria: [{ id: 'refund-issued', label: 'Refund is recorded' }, { id: 'case-closed', label: 'Support case is closed' }] };
      const actions = [{ id: crypto.randomUUID(), category: 'MODEL', label: 'Plan resolution', estimatedCostUsd: 0.08 }, { id: crypto.randomUUID(), category: 'API', label: 'Read invoice state', estimatedCostUsd: 0.03 }, { id: crypto.randomUUID(), category: 'TOOL', label: 'Issue refund', estimatedCostUsd: 0.12 }];
      const permitted = [];
      for (const action of actions) {
        const response = await fetch('/api/economics/authorize', { method: 'POST', headers: authorization, body: JSON.stringify({ task, runId, action }) });
        const decision = await response.json();
        if (!response.ok) throw new Error(decision.error || `Reality refused: ${decision.reasonCode}`);
        permitted.push({ ...action, actionId: action.id, id: crypto.randomUUID(), costUsd: action.estimatedCostUsd, authorizationId: decision.authorizationId });
      }
      const execution = await fetch('/api/economics/ingest', { method: 'POST', headers: authorization, body: JSON.stringify({
        task, runId, events: permitted,
      }) });
      if (!execution.ok) throw new Error((await execution.json()).error || 'Execution event was rejected.');
      const outcome = await fetch('/api/economics/outcome', { method: 'POST', headers: authorization, body: JSON.stringify({ taskId: 'invoice-resolution-001', runId, evidence: [{ id: crypto.randomUUID(), criterionId: 'refund-issued', label: 'Refund confirmation', source: 'Billing webhook', state: 'VERIFIED' }, { id: crypto.randomUUID(), criterionId: 'case-closed', label: 'Case status changed to closed', source: 'Support webhook', state: 'VERIFIED' }] }) });
      if (!outcome.ok) throw new Error((await outcome.json()).error || 'Outcome evidence was rejected.');
      await refresh();
    } catch (e) { setError(e instanceof Error ? e.message : 'The connection test failed.'); }
    finally { setBusy(false); }
  };

  const activeTask = data.tasks[0];
  const activeRecord = activeTask ? data.records.find((record) => record.taskExternalId === activeTask.externalId) : undefined;
  const activeRunId = activeRecord?.runId ?? (activeTask ? data.runs.find((run) => run.taskExternalId === activeTask.externalId)?.runId : undefined);
  const taskEvents = useMemo(() => activeTask ? data.events.filter((event) => event.taskExternalId === activeTask.externalId && (!activeRunId || event.runId === activeRunId)) : [], [data.events, activeTask, activeRunId]);
  const taskAuthorizations = useMemo(() => activeTask ? data.authorizations.filter((item) => item.taskExternalId === activeTask.externalId && (!activeRunId || item.runId === activeRunId)) : [], [data.authorizations, activeTask, activeRunId]);
  const executionEvents = taskEvents.filter((event) => event.eventType === 'EXECUTION');
  const outcomeEvents = taskEvents.filter((event) => event.eventType === 'OUTCOME');
  const cost = executionEvents.reduce((sum, event) => sum + event.costMicros, 0) / 1_000_000;
  const criteria = activeTask ? JSON.parse(activeTask.criteriaJson) as Array<{ id: string; label: string }> : [];
  const verified = criteria.filter((criterion) => outcomeEvents.some((event) => event.criterionId === criterion.id && event.evidenceState === 'VERIFIED')).length;
  const accepted = activeRecord?.disposition === 'ACCEPTED';
  const endpoint = typeof window === 'undefined' ? '' : window.location.origin;

  return (
    <main className="control-shell">
      <aside className="control-sidebar">
        <Link href="/" className="control-wordmark"><span>R</span>Reality</Link>
        <div className="control-context"><small>CONTROL PLANE</small><strong>Agent Economics</strong></div>
        <nav>
          <a className="active"><Network size={17}/>Connections</a>
          <a href="#live-runs"><Activity size={17}/>Live runs</a>
          <a href="#economic-record"><Database size={17}/>Economic records</a>
        </nav>
        <div className="control-foundation"><ShieldCheck size={18}/><p><b>Reality foundation</b><span>Evidence remains attached to action.</span></p></div>
        <Link href="/audit" className="control-secondary-link">Open Reality Audit <ArrowRight size={15}/></Link>
      </aside>

      <section className="control-main">
        <header className="control-header"><div><small>REALITY / AGENT ECONOMICS</small><h1>Integration control plane</h1></div><div className="control-user"><i>{displayName.slice(0, 1).toUpperCase()}</i><span>{displayName}</span></div></header>

        {loading ? <div className="control-loading">Loading control plane…</div> : !data.workspace ? (
          <section className="control-onboarding">
            <div className="control-onboarding-copy"><small>START HERE</small><h2>Connect execution to outcome.</h2><p>Reality does not replace your agent stack. It sits between your runtimes and the systems where work becomes real, then keeps the economic chain intact.</p><button onClick={create} disabled={busy}>{busy ? 'Creating…' : 'Create integration workspace'} <ArrowRight size={17}/></button>{error && <em>{error}</em>}</div>
            <div className="control-architecture">
              <div><span><Activity size={18}/></span><p><b>Agent runtime</b><small>Models · tools · APIs</small></p></div><i>execution events</i>
              <div className="core"><span><CircleDot size={18}/></span><p><b>Reality</b><small>Task · evidence · policy</small></p></div><i>accepted outcome</i>
              <div><span><Webhook size={18}/></span><p><b>Business systems</b><small>CRM · billing · operations</small></p></div>
            </div>
          </section>
        ) : (
          <>
            <section className="control-statusbar"><div><i className="online"/><span>Pre-action gate active</span><b>{data.workspace.name}</b></div><button onClick={() => refresh()} aria-label="Refresh"><RefreshCw size={15}/></button></section>

            <section className="control-connections">
              <article><header><span><Activity size={19}/></span><div><small>CONTROL 01</small><h2>Agent runtime</h2></div><b className={taskAuthorizations.length ? 'connected' : ''}>{taskAuthorizations.length ? 'Gating' : 'Ready'}</b></header><p>Ask permission before each paid action. Only permitted execution events can enter the economic record.</p><code>POST {endpoint}/api/economics/authorize</code><code>POST {endpoint}/api/economics/ingest</code></article>
              <div className="control-linkline"><span/><b>Reality task ID</b><span/></div>
              <article><header><span><Webhook size={19}/></span><div><small>INGRESS 02</small><h2>Outcome source</h2></div><b className={outcomeEvents.length ? 'connected' : ''}>{outcomeEvents.length ? 'Receiving' : 'Ready'}</b></header><p>Send external evidence from the system that can confirm whether the task actually succeeded.</p><code>POST {endpoint}/api/economics/outcome</code></article>
            </section>

            <section className="control-key-panel"><div><KeyRound size={18}/><p><b>Workspace integration key</b><span>{token ? 'Copy it now. It is shown once and stored only as a hash.' : `Connected with ${data.workspace.tokenPrefix}`}</span></p></div>{token ? <><code>{token}</code><button onClick={() => copy(token, 'key')}>{copied === 'key' ? <Check size={16}/> : <Copy size={16}/>} {copied === 'key' ? 'Copied' : 'Copy key'}</button><button className="test" onClick={runTest} disabled={busy}><Play size={15}/>{busy ? 'Sending…' : 'Send first connected run'}</button></> : <span className="control-key-safe"><ShieldCheck size={16}/>Secret hidden</span>}</section>

            <section className="control-runtime" id="live-runs">
              <div className="control-section-title"><div><small>LIVE OPERATIONS</small><h2>{activeTask ? activeTask.objective : 'Waiting for the first task'}</h2></div><span>{data.events.length} events received</span></div>
              {!activeTask ? <div className="control-empty"><Network size={28}/><h3>The control plane is connected.</h3><p>Send one task contract from an agent runtime, then send evidence from the system where the outcome appears.</p></div> : <div className="control-run-grid">
                <article><small>CONTROL + EXECUTION</small><strong>{taskAuthorizations.filter((item) => item.disposition === 'PERMIT').length}/{taskAuthorizations.length}</strong><span>actions permitted before execution</span><ol>{taskAuthorizations.slice(0,4).map((item) => <li key={item.id}><i className={item.disposition === 'PERMIT' ? 'ok' : ''}>{item.disposition}</i><p>{item.label}</p><b>{item.reasonCode}</b></li>)}</ol></article>
                <article><small>OUTCOME EVIDENCE</small><strong>{verified}/{criteria.length}</strong><span>criteria verified</span><ol>{criteria.map((criterion) => { const hit = outcomeEvents.find((event) => event.criterionId === criterion.id); return <li key={criterion.id}><i className={hit?.evidenceState === 'VERIFIED' ? 'ok' : ''}>{hit?.evidenceState === 'VERIFIED' ? 'VERIFIED' : 'UNKNOWN'}</i><p>{criterion.label}</p><b>{hit?.source || '—'}</b></li> })}</ol></article>
                <article className="record" id="economic-record"><small>ENGINE ECONOMIC RECORD</small><strong className={accepted ? 'accepted' : 'pending'}>{activeRecord?.disposition ?? 'PENDING'}</strong><span>{accepted ? 'Outcome accepted under external evidence.' : 'Reality will not count value yet.'}</span><dl><div><dt>Resource cost</dt><dd>${((activeRecord?.actualCostMicros ?? Math.round(cost * 1_000_000))/1_000_000).toFixed(3)}</dd></div><div><dt>Accepted value</dt><dd>{accepted ? `$${((activeRecord?.acceptedValueMicros || 0)/1_000_000).toFixed(2)}` : '—'}</dd></div><div><dt>Policy</dt><dd>{activeRecord?.policyVersion ?? 'awaiting record'}</dd></div></dl></article>
              </div>}
            </section>
          </>
        )}
      </section>
    </main>
  );
}
