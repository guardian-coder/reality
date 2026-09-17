'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, ArrowRight, Check, CircleHelp, Copy, Database, FileCheck2, KeyRound, Network, Radio, RefreshCw, Send, ShieldCheck, Webhook } from 'lucide-react';

type Source = { id: string; name: string; category: string; mode: string; lineageId: string; tokenPrefix: string; freshnessMinutes: number; status: 'WAITING' | 'TESTED' | 'LIVE'; lastEventAt?: string | null; createdAt: string };
type Claim = { externalId: string; subject: string; assertion: string; state: string; reasonCodesJson: string; evaluatedAt: string; validUntil?: string };
type Evidence = { id: string; claimExternalId: string; sourceName: string; sourceRef: string; relation: string; lineageId: string; observedAt: string };
type Setup = { source: Source; token: string; endpoint: string };
type Step = 'choose' | 'connect' | 'receive';

const categories = [
  ['PAYMENTS', 'Payments', 'Refunds, charges, settlement'],
  ['CRM', 'CRM', 'Customers, tickets, approvals'],
  ['INVENTORY', 'Inventory', 'Stock, batches, warehouse events'],
  ['TICKETING', 'Travel & ticketing', 'Bookings, issuance, cancellation'],
  ['SENSOR', 'Sensors & GPS', 'Position, condition, physical state'],
  ['DATABASE', 'Database', 'Operational records and state'],
  ['CUSTOM', 'Custom system', 'Any system that can send HTTPS'],
] as const;

export default function DataConsole({ displayName }: { displayName: string }) {
  const [sources, setSources] = useState<Source[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [workspaceReady, setWorkspaceReady] = useState(true);
  const [step, setStep] = useState<Step>('choose');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const [setup, setSetup] = useState<Setup | null>(null);
  const [result, setResult] = useState<any>(null);
  const [sourceForm, setSourceForm] = useState({ category: 'PAYMENTS', name: '', freshnessMinutes: '1440' });
  const [eventForm, setEventForm] = useState({ subject: 'Refund ref-1042', assertion: 'The refund is recorded in billing', sourceRef: 'refund-1042', relation: 'SUPPORTS' });

  const refresh = useCallback(async () => {
    const response = await fetch('/api/data/claims', { cache: 'no-store' });
    if (response.status === 401) { setWorkspaceReady(false); return; }
    if (!response.ok) throw new Error('Reality Data could not load.');
    const data = await response.json();
    setSources(data.sources || []); setClaims(data.claims || []); setEvidence(data.evidence || []); setWorkspaceReady(true);
  }, []);
  useEffect(() => { refresh().catch((e) => setError(e.message)); }, [refresh]);

  const createWorkspace = async () => {
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/economics/workspace', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: 'Reality operations' }) });
      if (!response.ok) throw new Error('Workspace creation failed.');
      await refresh();
    } catch (e) { setError(e instanceof Error ? e.message : 'Workspace creation failed.'); }
    finally { setBusy(false); }
  };

  const createSource = async () => {
    setBusy(true); setError(''); setResult(null);
    try {
      const response = await fetch('/api/data/sources', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...sourceForm, freshnessMinutes: Number(sourceForm.freshnessMinutes) }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The source could not be created.');
      setSetup(data); setStep('connect'); await refresh();
    } catch (e) { setError(e instanceof Error ? e.message : 'The source could not be created.'); }
    finally { setBusy(false); }
  };

  const sendTest = async () => {
    if (!setup) return;
    setBusy(true); setError(''); setResult(null);
    try {
      const response = await fetch(setup.endpoint, { method: 'POST', headers: { authorization: `Bearer ${setup.token}`, 'content-type': 'application/json' }, body: JSON.stringify({ ...eventForm, observedAt: new Date().toISOString(), test: true }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The evidence event was rejected.');
      setResult(data); setStep('receive'); await refresh();
    } catch (e) { setError(e instanceof Error ? e.message : 'The evidence event was rejected.'); }
    finally { setBusy(false); }
  };

  const copy = async (value: string, label: string) => {
    await navigator.clipboard.writeText(value); setCopied(label); window.setTimeout(() => setCopied(''), 1500);
  };

  const endpoint = typeof window === 'undefined' ? '' : window.location.origin;
  const webhookUrl = `${endpoint}${setup?.endpoint || '/api/data/ingest'}`;
  const payload = JSON.stringify({ subject: eventForm.subject, assertion: eventForm.assertion, sourceRef: eventForm.sourceRef, relation: eventForm.relation, observedAt: new Date().toISOString() }, null, 2);
  const curl = `curl -X POST "${webhookUrl}" \\\n+  -H "Authorization: Bearer ${setup?.token || 'YOUR_SOURCE_KEY'}" \\\n+  -H "Content-Type: application/json" \\\n+  -d '${payload}'`;
  const recentEvidence = useMemo(() => evidence.filter((item) => item.claimExternalId === claims[0]?.externalId), [claims, evidence]);

  return <main className="rcp-shell">
    <aside className="rcp-sidebar">
      <a href="/data" className="rcp-mark"><span>R</span>Reality</a>
      <div className="rcp-product"><small>CONTROL PLANE</small><strong>Reality Data</strong></div>
      <nav><a className="active" href="/data"><FileCheck2 size={17}/>Reality Data</a><a href="/economics"><ShieldCheck size={17}/>Agent Economics</a></nav>
      <div className="rcp-spine"><Network size={18}/><p><b>Evidence Graph</b><span>Source → evidence → claim → action</span></p></div>
      <a href="/discovery" className="rcp-secondary">Discovery Story <ArrowRight size={15}/></a>
    </aside>
    <section className="rcp-main">
      <header className="rcp-header"><div><small>REALITY / DATA UTILITY</small><h1>Connect the system where the fact becomes real.</h1></div><div className="rcp-user"><i>{displayName.slice(0,1).toUpperCase()}</i><span>{displayName}</span></div></header>
      {!workspaceReady ? <section className="rcp-empty"><Database size={25}/><h2>Create the shared workspace.</h2><p>Reality Data and Agent Economics will use the same evidence graph.</p><button onClick={createWorkspace} disabled={busy}>Create workspace <ArrowRight size={16}/></button>{error && <em className="rcp-error">{error}</em>}</section> : <>
        <section className="source-journey">
          <header className="source-journey-head"><div><small>CONNECT A REAL SOURCE</small><h2>What system should Reality listen to?</h2><p>Choose the system and freshness rule. Reality creates an authenticated webhook and derives provenance instead of asking you to type lineage by hand.</p></div><b>{sources.some((source) => source.status === 'LIVE') ? 'Live source connected' : setup ? 'Setup in progress' : 'No live source yet'}</b></header>
          <nav className="source-steps" aria-label="Source connection steps">
            {([['choose','01','Choose system'],['connect','02','Connect'],['receive','03','Receive evidence']] as const).map(([id, number, label]) => <button key={id} onClick={() => (id === 'choose' || setup) && setStep(id)} disabled={id !== 'choose' && !setup} className={step === id ? 'active' : ''}><i>{number}</i><span>{label}</span>{id === 'connect' && setup ? <Check size={15}/> : id === 'receive' && result ? <Check size={15}/> : null}</button>)}
          </nav>

          {step === 'choose' && <div className="source-panel source-choose">
            <div className="source-category-grid" role="radiogroup" aria-label="System category">{categories.map(([id, title, detail]) => <button key={id} role="radio" aria-checked={sourceForm.category === id} className={sourceForm.category === id ? 'selected' : ''} onClick={() => setSourceForm({...sourceForm, category:id})}><span>{id === 'SENSOR' ? <Radio size={18}/> : id === 'CUSTOM' ? <Webhook size={18}/> : <Database size={18}/>}</span><b>{title}</b><small>{detail}</small>{sourceForm.category === id && <Check size={16}/>}</button>)}</div>
            <div className="source-definition"><label><span>System name</span><input placeholder="e.g. Stripe production" value={sourceForm.name} onChange={(e)=>setSourceForm({...sourceForm,name:e.target.value})}/></label><label><span>How long can its evidence be trusted?</span><select value={sourceForm.freshnessMinutes} onChange={(e)=>setSourceForm({...sourceForm,freshnessMinutes:e.target.value})}><option value="15">15 minutes</option><option value="60">1 hour</option><option value="1440">24 hours</option><option value="10080">7 days</option></select></label><button onClick={createSource} disabled={busy || !sourceForm.name.trim()}>{busy ? 'Creating source…' : 'Create connection'} <ArrowRight size={16}/></button></div>
          </div>}

          {step === 'connect' && setup && <div className="source-panel source-connect">
            <div className="source-live-card"><span><Webhook size={22}/></span><div><small>{setup.source.category} · WEBHOOK</small><h3>{setup.source.name}</h3><p>Waiting for the first authenticated event.</p></div><b>WAITING</b></div>
            <div className="source-secret"><header><div><KeyRound size={18}/><p><b>Source key</b><span>Shown once. Keep it in the sending system, not in browser code.</span></p></div><button onClick={()=>copy(setup.token,'key')}>{copied === 'key' ? <Check size={15}/> : <Copy size={15}/>} {copied === 'key' ? 'Copied' : 'Copy key'}</button></header><code>{setup.token}</code></div>
            <div className="source-webhook"><header><div><Send size={18}/><b>Send evidence here</b></div><button onClick={()=>copy(curl,'curl')}><Copy size={14}/>{copied === 'curl' ? 'Copied' : 'Copy request'}</button></header><code>{webhookUrl}</code><pre>{curl}</pre></div>
            <button className="source-next" onClick={()=>setStep('receive')}>Test the connection <ArrowRight size={16}/></button>
          </div>}

          {step === 'receive' && setup && <div className="source-panel source-receive">
            <div className="source-test-form"><header><small>CONTROLLED CONNECTION TEST</small><h3>Send one event through the authenticated webhook.</h3><p>This proves the connection and persistence path. It does not prove that an external production system is connected.</p></header><div><label><span>Subject</span><input value={eventForm.subject} onChange={(e)=>setEventForm({...eventForm,subject:e.target.value})}/></label><label><span>Fact to verify</span><input value={eventForm.assertion} onChange={(e)=>setEventForm({...eventForm,assertion:e.target.value})}/></label><label><span>Source record ID</span><input value={eventForm.sourceRef} onChange={(e)=>setEventForm({...eventForm,sourceRef:e.target.value})}/></label><label><span>What does the record say?</span><select value={eventForm.relation} onChange={(e)=>setEventForm({...eventForm,relation:e.target.value})}><option value="SUPPORTS">Supports the fact</option><option value="CONTRADICTS">Contradicts the fact</option></select></label></div><button onClick={sendTest} disabled={busy}>{busy ? 'Sending evidence…' : 'Send controlled test'} <Activity size={16}/></button>{error && <em className="rcp-error">{error}</em>}</div>
            <aside className={`attestation-card ${result?.claim?.state?.toLowerCase() || 'unknown'}`}><small>EVALUATION RESULT</small><div className="attestation-state"><i/>{result?.claim?.state || 'WAITING'}</div><h3>{result?.claim?.assertion || 'No evidence received yet.'}</h3>{result ? <><dl><div><dt>Source state</dt><dd>{result.source.status}</dd></div><div><dt>Ingestion</dt><dd>{result.ingestionMode.replaceAll('_',' ')}</dd></div></dl><div className="reason-list">{result.claim.reasonCodes.map((reason:string)=><span key={reason}><Check size={13}/>{reason.replaceAll('_',' ')}</span>)}</div><button className="source-another" onClick={()=>{setSetup(null);setResult(null);setStep('choose');setSourceForm({...sourceForm,name:''});}}>Connect another system</button></> : <p>The claim stays UNKNOWN until authenticated, fresh evidence arrives.</p>}</aside>
          </div>}
        </section>

        <section className="source-registry"><header><div><small>CONNECTED SOURCES</small><h2>Source registry</h2></div><button onClick={refresh}><RefreshCw size={15}/>Refresh</button></header>{sources.length ? <div>{sources.map((source)=><article key={source.id}><i className={source.status.toLowerCase()}/><div><strong>{source.name}</strong><span>{source.category} · valid for {source.freshnessMinutes} min</span></div><b>{source.status}</b><small>{source.lastEventAt ? new Date(source.lastEventAt).toLocaleString() : 'No event received'}</small></article>)}</div> : <div className="claim-zero"><CircleHelp size={20}/>No source has been connected.</div>}</section>
        <section className="claim-ledger"><header><div><small>PERSISTED EVIDENCE GRAPH</small><h2>Claims created by sources</h2></div><span>{claims.length} total</span></header>{claims.length ? <div className="claim-table">{claims.map((claim)=><article key={claim.externalId}><i className={claim.state.toLowerCase()}/><div><strong>{claim.assertion}</strong><span>{claim.subject}</span></div><b>{claim.state}</b><small>{new Date(claim.evaluatedAt).toLocaleString()}</small></article>)}</div> : <div className="claim-zero"><CircleHelp size={20}/>Claims will appear after a source sends evidence.</div>}{claims[0] && <footer>{recentEvidence.length} evidence record{recentEvidence.length === 1 ? '' : 's'} attached to the latest claim.</footer>}</section>
      </>}
    </section>
    <aside className="scout-float"><div className="scout-image"><Image src="/reality-scout.png" alt="Reality Scout robotic guide" fill sizes="88px"/></div><p><b>Reality Scout</b><span>{step === 'choose' ? 'Start with the system that already records the fact.' : step === 'connect' ? 'Put this key only in the sending system.' : 'A controlled test proves the pipe—not the external system.'}</span></p></aside>
  </main>;
}
