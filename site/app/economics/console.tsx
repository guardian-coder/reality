'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, ArrowRight, Bot, Braces, Check, CircleDot, Copy, Database, FileCheck2, KeyRound, Network, Play, RefreshCw, RotateCcw, Settings2, ShieldCheck, Webhook } from 'lucide-react';

type Workspace = { id: string; name: string; tokenPrefix: string };
type Task = { externalId: string; objective: string; budgetMicros: number; estimatedValueMicros: number; criteriaJson: string; updatedAt: string };
type Run = { taskExternalId: string; runId: string; policyVersion: string; createdAt: string };
type Event = { id: string; taskExternalId: string; runId: string; eventType: string; category?: string; label: string; costMicros: number; criterionId?: string; evidenceState?: string; source?: string; receivedAt: string };
type Authorization = { id: string; taskExternalId: string; runId: string; label: string; disposition: string; reasonCode: string; policyVersion: string; createdAt: string };
type StoredRecord = { id: string; taskExternalId: string; runId: string; disposition: string; actualCostMicros: number; acceptedValueMicros: number; policyVersion: string; recordJson: string; updatedAt: string };
type Overview = { workspace: Workspace | null; tasks: Task[]; runs: Run[]; events: Event[]; authorizations: Authorization[]; records: StoredRecord[] };
type SetupStep = 'connect' | 'policy' | 'verify';
type TestResult = { disposition: string; detail: string; runId?: string };

const empty: Overview = { workspace: null, tasks: [], runs: [], events: [], authorizations: [], records: [] };

export default function EconomicsConsole({ displayName }: { displayName: string }) {
  const [data, setData] = useState<Overview>(empty);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const [setupStep, setSetupStep] = useState<SetupStep>('connect');
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [guideOpen, setGuideOpen] = useState(true);
  const [contract, setContract] = useState({
    objective: 'Resolve a duplicate customer charge',
    budgetUsd: '1.00',
    estimatedValueUsd: '14.00',
    actionLabel: 'Issue customer refund',
    actionCostUsd: '0.12',
    successLabel: 'Refund is recorded in billing',
  });

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

  const issueKey = async () => {
    setBusy(true); setError(''); setTestResult(null);
    try {
      const response = await fetch('/api/economics/workspace', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ rotateToken: true }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'A new integration key could not be issued.');
      setToken(result.token); await refresh();
    } catch (e) { setError(e instanceof Error ? e.message : 'A new integration key could not be issued.'); }
    finally { setBusy(false); }
  };

  const runTest = async () => {
    if (!token) return;
    setBusy(true); setError(''); setTestResult(null);
    const authorization = { authorization: `Bearer ${token}`, 'content-type': 'application/json' };
    try {
      const runId = `run-${Date.now()}`;
      const taskId = `task-${Date.now()}`;
      const task = { id: taskId, objective: contract.objective, budgetUsd: Number(contract.budgetUsd), estimatedValueUsd: Number(contract.estimatedValueUsd), successCriteria: [{ id: 'primary-outcome', label: contract.successLabel }] };
      const actions = [{ id: crypto.randomUUID(), category: 'TOOL', label: contract.actionLabel, estimatedCostUsd: Number(contract.actionCostUsd) }];
      const permitted = [];
      for (const action of actions) {
        const response = await fetch('/api/economics/authorize', { method: 'POST', headers: authorization, body: JSON.stringify({ task, runId, action }) });
        const decision = await response.json();
        if (!response.ok) {
          if (decision.disposition === 'REFUSE') {
            setTestResult({ disposition: 'REFUSED', detail: `Action blocked before execution: ${decision.reasonCode}`, runId });
            await refresh(); return;
          }
          throw new Error(decision.error || `Reality refused: ${decision.reasonCode}`);
        }
        permitted.push({ ...action, actionId: action.id, id: crypto.randomUUID(), costUsd: action.estimatedCostUsd, authorizationId: decision.authorizationId });
      }
      const execution = await fetch('/api/economics/ingest', { method: 'POST', headers: authorization, body: JSON.stringify({
        task, runId, events: permitted,
      }) });
      if (!execution.ok) throw new Error((await execution.json()).error || 'Execution event was rejected.');
      const claimId = `outcome-${runId}`;
      const observedAt = new Date();
      const claimResponse = await fetch('/api/data/claims', { method: 'POST', headers: authorization, body: JSON.stringify({
        claim: { id: claimId, subject: taskId, assertion: contract.successLabel },
        evidence: [{ id: crypto.randomUUID(), sourceName: 'Connected outcome source', sourceRef: `integration://${runId}/outcome`, relation: 'SUPPORTS', lineageId: 'connected-outcome-system', observedAt: observedAt.toISOString(), validUntil: new Date(observedAt.getTime() + 24 * 60 * 60 * 1000).toISOString(), integrityStatus: 'DOCUMENTED' }],
      }) });
      if (!claimResponse.ok) throw new Error((await claimResponse.json()).error || 'Outcome claim could not be evaluated.');
      const outcome = await fetch('/api/economics/outcome', { method: 'POST', headers: authorization, body: JSON.stringify({ taskId, runId, evidence: [{ id: crypto.randomUUID(), criterionId: 'primary-outcome', label: contract.successLabel, claimId }] }) });
      if (!outcome.ok) throw new Error((await outcome.json()).error || 'Outcome evidence was rejected.');
      const outcomeResult = await outcome.json();
      setTestResult({ disposition: outcomeResult.economicRecord?.disposition || 'ACCEPTED', detail: 'Live authorization, execution, and outcome evidence were persisted.', runId });
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
  const integrationSnippet = `const decision = await fetch('${endpoint}/api/economics/authorize', {\n  method: 'POST',\n  headers: { Authorization: 'Bearer ${token || 'YOUR_REALITY_KEY'}', 'Content-Type': 'application/json' },\n  body: JSON.stringify({ task, runId, action })\n});\n\nif (!decision.ok) return; // do not execute\nconst permit = await decision.json();`;
  const guideCopy = setupStep === 'connect'
    ? { title: 'Connect the system that spends.', body: 'Issue a credential, keep it on your server, then place the authorization hook immediately before an agent calls a paid model, tool, or API.' }
    : setupStep === 'policy'
      ? { title: 'Define what “worth it” means.', body: 'Set the task budget, expected value, action cost, and the external evidence that must exist before value can be counted.' }
      : { title: 'Prove the chain is alive.', body: 'Run one controlled transaction. Reality should permit or refuse before execution, then create an economic record only after outcome evidence arrives.' };

  return (
    <main className="control-shell">
      <aside className="control-sidebar">
        <a href="/economics" className="control-wordmark"><span>R</span>Reality</a>
        <div className="control-context"><small>CONTROL PLANE</small><strong>Agent Economics</strong></div>
        <nav className="control-pillar-nav"><a href="/data"><FileCheck2 size={17}/>Reality Data</a><a className="active" href="/economics"><ShieldCheck size={17}/>Agent Economics</a></nav>
        <nav>
          <a className="active" href="#connect"><Network size={17}/>Connect</a>
          <a href="#policy"><Settings2 size={17}/>Policy</a>
          <a href="#live-runs"><Activity size={17}/>Live runs</a>
          <a href="#economic-record"><Database size={17}/>Economic records</a>
        </nav>
        <div className="control-foundation"><ShieldCheck size={18}/><p><b>Reality foundation</b><span>Evidence remains attached to action.</span></p></div>
        <a href="/discovery" className="control-secondary-link">Read Discovery Story <ArrowRight size={15}/></a>
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
            <section className="control-statusbar"><div><i className="online"/><span>Economic gate online</span><b>{data.workspace.name}</b></div><button onClick={() => refresh()} aria-label="Refresh"><RefreshCw size={15}/></button></section>

            <section className="integration-journey" id="connect">
              <header className="journey-header"><div><small>WORKING INTEGRATION</small><h2>Put Reality inside one agent action.</h2><p>Complete the path once here, then use the same API contract in your runtime.</p></div><b>{testResult?.disposition === 'ACCEPTED' ? 'Connected' : 'Setup required'}</b></header>
              <nav className="journey-steps" aria-label="Integration steps">
                {([['connect','01','Connect'],['policy','02','Define policy'],['verify','03','Verify live']] as const).map(([id, number, label]) => <button key={id} onClick={() => setSetupStep(id)} className={setupStep === id ? 'active' : ''}><i>{number}</i><span>{label}</span>{id === 'connect' && token ? <Check size={15}/> : id === 'verify' && testResult?.disposition === 'ACCEPTED' ? <Check size={15}/> : null}</button>)}
              </nav>

              {setupStep === 'connect' && <div className="journey-panel connect-panel">
                <div className="runtime-choice"><span><Braces size={20}/></span><div><small>UNIVERSAL REST</small><h3>Any agent runtime</h3><p>Works with custom agents, workflow tools, Python, JavaScript, or direct HTTP.</p></div><b>Selected</b></div>
                <div className="credential-box"><header><div><KeyRound size={18}/><p><b>Integration credential</b><span>{token ? 'Ready. Copy it now; only its hash is stored.' : `Current key ${data.workspace.tokenPrefix} is hidden.`}</span></p></div>{token ? <button onClick={() => copy(token, 'key')}>{copied === 'key' ? <Check size={15}/> : <Copy size={15}/>} {copied === 'key' ? 'Copied' : 'Copy key'}</button> : <button onClick={issueKey} disabled={busy}><RotateCcw size={15}/>{busy ? 'Issuing…' : 'Issue new key'}</button>}</header>{token && <code>{token}</code>}<small>{token ? 'Keep this secret in your server environment.' : 'Issuing a new key will replace the hidden key.'}</small></div>
                <div className="integration-code"><header><div><Bot size={18}/><b>Agent authorization hook</b></div><button onClick={() => copy(integrationSnippet, 'snippet')}><Copy size={14}/>{copied === 'snippet' ? 'Copied' : 'Copy code'}</button></header><pre>{integrationSnippet}</pre></div>
                <button className="journey-next" onClick={() => setSetupStep('policy')}>Define the first policy <ArrowRight size={16}/></button>
              </div>}

              {setupStep === 'policy' && <div className="journey-panel policy-panel" id="policy">
                <div className="policy-intro"><Settings2 size={21}/><div><h3>Freeze the decision before execution.</h3><p>This contract is sent to the live gate. Once a run begins, it cannot silently change.</p></div></div>
                <div className="policy-form"><label className="wide"><span>Task objective</span><input value={contract.objective} onChange={(e) => setContract({...contract, objective:e.target.value})}/></label><label><span>Maximum budget · USD</span><input type="number" min="0" step="0.01" value={contract.budgetUsd} onChange={(e) => setContract({...contract, budgetUsd:e.target.value})}/></label><label><span>Expected value · USD</span><input type="number" min="0" step="0.01" value={contract.estimatedValueUsd} onChange={(e) => setContract({...contract, estimatedValueUsd:e.target.value})}/></label><label><span>Action to authorize</span><input value={contract.actionLabel} onChange={(e) => setContract({...contract, actionLabel:e.target.value})}/></label><label><span>Maximum action cost · USD</span><input type="number" min="0" step="0.01" value={contract.actionCostUsd} onChange={(e) => setContract({...contract, actionCostUsd:e.target.value})}/></label><label className="wide"><span>Evidence required to count success</span><input value={contract.successLabel} onChange={(e) => setContract({...contract, successLabel:e.target.value})}/></label></div>
                <div className="policy-summary"><span><ShieldCheck size={17}/>The gate will refuse an action that exceeds the remaining budget.</span><button className="journey-next" onClick={() => setSetupStep('verify')}>Verify against live engine <ArrowRight size={16}/></button></div>
              </div>}

              {setupStep === 'verify' && <div className="journey-panel verify-panel">
                <div className="verify-copy"><small>LIVE SYSTEM CHECK</small><h3>Send this contract through the real control plane.</h3><p>This is not a visual simulation. It requests a permit, records execution only if permitted, sends outcome evidence, and persists the economic result.</p><dl><div><dt>Budget</dt><dd>${Number(contract.budgetUsd || 0).toFixed(2)}</dd></div><div><dt>Action cost</dt><dd>${Number(contract.actionCostUsd || 0).toFixed(2)}</dd></div><div><dt>Success evidence</dt><dd>{contract.successLabel}</dd></div></dl></div>
                <div className="verify-action">{!token ? <><KeyRound size={25}/><h4>An integration key is required.</h4><p>Return to Connect and issue a key before testing.</p><button onClick={() => setSetupStep('connect')}>Open connection setup</button></> : <><Play size={25}/><h4>Ready to execute one controlled run.</h4><p>The result will appear below in Live operations.</p><button onClick={runTest} disabled={busy}>{busy ? 'Running live chain…' : 'Run end-to-end test'}</button></>}{testResult && <div className={`test-result ${testResult.disposition.toLowerCase()}`}><b>{testResult.disposition}</b><span>{testResult.detail}</span></div>}{error && <em>{error}</em>}</div>
              </div>}
            </section>

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
      <button className="product-guide-trigger" onClick={() => setGuideOpen(!guideOpen)} aria-expanded={guideOpen}><CircleDot size={18}/><span>{guideOpen ? 'Close guide' : 'Guide me'}</span></button>
      {guideOpen && <aside className={`product-guide pet-state-${setupStep}`} aria-live="polite"><header><span><i className="product-guide-pet" aria-hidden="true"><Image src="/reality-scout.png" alt="" fill sizes="58px" /></i>REALITY SCOUT</span><button onClick={() => setGuideOpen(false)} aria-label="Close guide">×</button></header><small>STEP {setupStep === 'connect' ? '01' : setupStep === 'policy' ? '02' : '03'} OF 03</small><h3>{guideCopy.title}</h3><p>{guideCopy.body}</p><button onClick={() => setupStep === 'connect' ? setSetupStep('policy') : setupStep === 'policy' ? setSetupStep('verify') : setGuideOpen(false)}>{setupStep === 'verify' ? 'Got it' : 'Next step'} <ArrowRight size={14}/></button></aside>}
    </main>
  );
}
