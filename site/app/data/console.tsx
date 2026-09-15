'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowRight, Check, CircleHelp, Database, FileCheck2, Network, RefreshCw, ShieldCheck } from 'lucide-react';

type Claim = { externalId: string; subject: string; assertion: string; state: string; reasonCodesJson: string; evaluatedAt: string; validUntil?: string };
type Evidence = { id: string; claimExternalId: string; sourceName: string; sourceRef: string; relation: string; lineageId: string; observedAt: string };

const isoLocal = (date: Date) => {
  const copy = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return copy.toISOString().slice(0, 16);
};

export default function DataConsole({ displayName }: { displayName: string }) {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [workspaceReady, setWorkspaceReady] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  const [form, setForm] = useState({
    subject: 'Customer refund ref-1042', assertion: 'The refund is recorded in billing', sourceName: 'Billing ledger',
    sourceRef: 'billing://refunds/ref-1042', lineageId: 'billing-ledger-primary', relation: 'SUPPORTS',
    observedAt: isoLocal(new Date()), validUntil: isoLocal(new Date(Date.now() + 24 * 60 * 60 * 1000)),
  });

  const refresh = useCallback(async () => {
    const response = await fetch('/api/data/claims', { cache: 'no-store' });
    if (response.status === 401) { setWorkspaceReady(false); return; }
    if (!response.ok) throw new Error('Reality Data could not load.');
    const data = await response.json(); setClaims(data.claims || []); setEvidence(data.evidence || []); setWorkspaceReady(true);
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

  const verify = async () => {
    setBusy(true); setError(''); setResult(null);
    try {
      const claimId = `claim-${Date.now()}`;
      const response = await fetch('/api/data/claims', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({
        claim: { id: claimId, subject: form.subject, assertion: form.assertion },
        evidence: [{ id: crypto.randomUUID(), sourceName: form.sourceName, sourceRef: form.sourceRef, lineageId: form.lineageId, relation: form.relation, observedAt: new Date(form.observedAt).toISOString(), validUntil: new Date(form.validUntil).toISOString(), integrityStatus: 'DOCUMENTED' }],
      }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Claim verification failed.');
      setResult(data.claim); await refresh();
    } catch (e) { setError(e instanceof Error ? e.message : 'Claim verification failed.'); }
    finally { setBusy(false); }
  };

  const recentEvidence = useMemo(() => evidence.filter((item) => item.claimExternalId === claims[0]?.externalId), [claims, evidence]);
  return <main className="rcp-shell">
    <aside className="rcp-sidebar">
      <a href="/data" className="rcp-mark"><span>R</span>Reality</a>
      <div className="rcp-product"><small>CONTROL PLANE</small><strong>Reality Data</strong></div>
      <nav><a className="active" href="/data"><FileCheck2 size={17}/>Reality Data</a><a href="/economics"><ShieldCheck size={17}/>Agent Economics</a></nav>
      <div className="rcp-spine"><Network size={18}/><p><b>Evidence Graph</b><span>Claim → evidence → action → outcome</span></p></div>
      <a href="/discovery" className="rcp-secondary">Discovery Story <ArrowRight size={15}/></a>
    </aside>
    <section className="rcp-main">
      <header className="rcp-header"><div><small>REALITY / DATA UTILITY</small><h1>Verify a fact before a machine depends on it.</h1></div><div className="rcp-user"><i>{displayName.slice(0,1).toUpperCase()}</i><span>{displayName}</span></div></header>
      {!workspaceReady ? <section className="rcp-empty"><Database size={25}/><h2>Create the shared control-plane workspace.</h2><p>Both Reality Data and Agent Economics use the same evidence graph.</p><button onClick={createWorkspace} disabled={busy}>Create workspace <ArrowRight size={16}/></button></section> : <>
        <section className="data-grid">
          <article className="data-form-card"><header><small>NEW REALITY CLAIM</small><h2>What must be true?</h2><p>Reality evaluates the source, time, lineage, and contradiction state. It never accepts a caller’s confidence label as proof.</p></header>
            <div className="data-form">
              <label><span>Subject</span><input value={form.subject} onChange={(e)=>setForm({...form,subject:e.target.value})}/></label>
              <label><span>Claim</span><input value={form.assertion} onChange={(e)=>setForm({...form,assertion:e.target.value})}/></label>
              <label><span>Evidence source</span><input value={form.sourceName} onChange={(e)=>setForm({...form,sourceName:e.target.value})}/></label>
              <label><span>Source reference</span><input value={form.sourceRef} onChange={(e)=>setForm({...form,sourceRef:e.target.value})}/></label>
              <label><span>Independent lineage</span><input value={form.lineageId} onChange={(e)=>setForm({...form,lineageId:e.target.value})}/></label>
              <label><span>Relationship</span><select value={form.relation} onChange={(e)=>setForm({...form,relation:e.target.value})}><option>SUPPORTS</option><option>CONTRADICTS</option></select></label>
              <label><span>Observed at</span><input type="datetime-local" value={form.observedAt} onChange={(e)=>setForm({...form,observedAt:e.target.value})}/></label>
              <label><span>Valid until</span><input type="datetime-local" value={form.validUntil} onChange={(e)=>setForm({...form,validUntil:e.target.value})}/></label>
            </div><button className="data-primary" onClick={verify} disabled={busy}>{busy ? 'Evaluating…' : 'Evaluate and publish'} <ArrowRight size={16}/></button>{error && <em className="rcp-error">{error}</em>}
          </article>
          <aside className={`attestation-card ${result?.state?.toLowerCase() || 'unknown'}`}><small>LIVE ATTESTATION</small><div className="attestation-state"><i/>{result?.state || 'WAITING'}</div><h3>{result?.assertion || 'Submit a claim to create a machine-readable result.'}</h3>{result ? <><dl><div><dt>Independent lines</dt><dd>{result.independentLineages}</dd></div><div><dt>Valid until</dt><dd>{result.validUntil ? new Date(result.validUntil).toLocaleString() : 'None'}</dd></div></dl><div className="reason-list">{result.reasonCodes.map((reason:string)=><span key={reason}><Check size={13}/>{reason.replaceAll('_',' ')}</span>)}</div><code>{JSON.stringify({ claimId: result.externalId, state: result.state, validUntil: result.validUntil }, null, 2)}</code></> : <p>No certainty is created until the evidence contract passes.</p>}</aside>
        </section>
        <section className="claim-ledger"><header><div><small>PERSISTED EVIDENCE GRAPH</small><h2>Recent claims</h2></div><button onClick={refresh}><RefreshCw size={15}/>Refresh</button></header>{claims.length ? <div className="claim-table">{claims.map((claim)=><article key={claim.externalId}><i className={claim.state.toLowerCase()}/><div><strong>{claim.assertion}</strong><span>{claim.subject}</span></div><b>{claim.state}</b><small>{new Date(claim.evaluatedAt).toLocaleString()}</small></article>)}</div> : <div className="claim-zero"><CircleHelp size={20}/>No claims have been evaluated yet.</div>}{claims[0] && <footer>{recentEvidence.length} evidence record{recentEvidence.length === 1 ? '' : 's'} attached to the latest claim.</footer>}</section>
      </>}
    </section>
    <aside className="scout-float"><div className="scout-image"><Image src="/reality-scout.png" alt="Reality Scout robotic guide" fill sizes="88px"/></div><p><b>Reality Scout</b><span>Start with one claim. If the source or freshness is missing, I keep it UNKNOWN.</span></p></aside>
  </main>;
}
