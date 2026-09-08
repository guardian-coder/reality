'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type ReviewState = 'DOCUMENTED' | 'INFERRED' | 'UNKNOWN';
type Finding = { id: string; title: string; statement: string; locator: string; initial: ReviewState; significance: string };

const findings: Finding[] = [
  { id: 'F-01', title: 'Second-order aggregation exists', statement: 'Four MUX units feed two AVW200 two-channel spectrum analyzers.', locator: 'FHWA-HRT-09-040 · Chapter 4 · System 2 architecture', initial: 'DOCUMENTED', significance: 'Multiple sensor groups can converge through a smaller set of shared components.' },
  { id: 'F-02', title: 'A shared path failed in practice', statement: 'A partially cut MUX-to-AVW200 wire produced unintelligible data before complete failure.', locator: 'FHWA-HRT-09-040 · Chapter 4 · documented incident', initial: 'DOCUMENTED', significance: 'The failure progressed through corrupted-but-present evidence before becoming unavailable.' },
  { id: 'F-03', title: 'Exact MUX pairing', statement: 'The two shaft MUXes share one AVW200 and the two column MUXes share the other.', locator: 'Reviewer synthesis · not stated explicitly in the source excerpt', initial: 'INFERRED', significance: 'This pairing would determine which locations cannot count as independent confirmation.' },
  { id: 'F-04', title: 'AVW200 common-bias behavior', statement: 'A degraded AVW200 can make separate connected sources agree on the same plausible but wrong load value.', locator: 'No confirming statement located in the source excerpt', initial: 'UNKNOWN', significance: 'Without this fact, a common-bias action rule would exceed what the document establishes.' },
];
const stateOrder: ReviewState[] = ['DOCUMENTED', 'INFERRED', 'UNKNOWN'];

export default function SourceReview() {
  const [states, setStates] = useState<Record<string, ReviewState>>(() => Object.fromEntries(findings.map((finding) => [finding.id, finding.initial])));
  const [reviewed, setReviewed] = useState<Record<string, boolean>>(() => Object.fromEntries(findings.map((finding) => [finding.id, false])));
  const counts = useMemo(() => stateOrder.map((state) => [state, Object.values(states).filter((value) => value === state).length] as const), [states]);
  const reviewedCount = Object.values(reviewed).filter(Boolean).length;
  const isComplete = reviewedCount === findings.length;
  const hasUnresolved = Object.values(states).some((state) => state !== 'DOCUMENTED');
  const disposition = !isComplete ? 'NOT READY' : hasUnresolved ? 'HUMAN REVIEW' : 'REVALIDATE';

  const setFindingState = (id: string, state: ReviewState) => {
    setStates((current) => ({ ...current, [id]: state }));
    setReviewed((current) => ({ ...current, [id]: true }));
  };

  useEffect(() => {
    type WebMcpContext = { registerTool: (tool: Record<string, unknown>, options?: { signal?: AbortSignal }) => void | Promise<void> };
    const context = (document as Document & { modelContext?: WebMcpContext }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const afterVisibleUpdate = () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

    const register = async () => {
      await context.registerTool({
        name: 'review_reality_audit_finding',
        title: 'Review source finding',
        description: 'Assign a documented, inferred, or unknown state to one visible FHWA audit finding and mark its human checkpoint reviewed.',
        inputSchema: {
          type: 'object',
          properties: { findingId: { type: 'string', enum: findings.map((finding) => finding.id) }, state: { type: 'string', enum: stateOrder } },
          required: ['findingId', 'state'],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute: async (input: unknown) => {
          const { findingId, state } = input as { findingId?: string; state?: string };
          if (!findingId || !findings.some((finding) => finding.id === findingId)) throw new Error('Unknown finding.');
          if (!state || !stateOrder.includes(state as ReviewState)) throw new Error('Unknown review state.');
          setFindingState(findingId, state as ReviewState);
          await afterVisibleUpdate();
          return { findingId, state, reviewed: true };
        },
      }, { signal: lifecycle.signal });

      await context.registerTool({
        name: 'read_reality_source_review',
        title: 'Read source review',
        description: 'Read the current FHWA finding states, review progress, and downstream disposition.',
        inputSchema: { type: 'object', properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: true, untrustedContentHint: false },
        execute: () => ({ states, reviewedCount, findingCount: findings.length, disposition }),
      }, { signal: lifecycle.signal });
    };

    void register().catch(() => {
      // The visible review remains usable when WebMCP is unavailable.
    });
    return () => lifecycle.abort();
  }, [states, reviewedCount, disposition]);

  const exportReview = () => {
    const record = { source: 'FHWA-HRT-09-040', reviewMode: 'shadow', findings: findings.map((finding) => ({ ...finding, state: states[finding.id], reviewed: reviewed[finding.id] })), disposition, note: 'Reviewer labels are not source authentication. Inferred and unknown findings remain unresolved.' };
    const url = URL.createObjectURL(new Blob([JSON.stringify(record, null, 2)], { type: 'application/json' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'reality-audit-fhwa-source-review.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="review-app">
      <header className="audit-topbar">
        <Link href="/" className="audit-brand"><span />REALITY</Link>
        <div className="audit-context"><small>SOURCE REVIEW</small><strong>FHWA-HRT-09-040</strong><span>HUMAN CHECKPOINT</span></div>
        <Link href="/audit" className="review-link">← Action gate</Link>
      </header>

      <section className="review-hero">
        <div><p>PHASE 02 / SOURCE INTAKE</p><h1>Do not let the summary<br />become more certain<br />than the source.</h1></div>
        <aside><span>REVIEW PROGRESS</span><strong>{reviewedCount}/{findings.length}</strong><div><i style={{ width: `${(reviewedCount / findings.length) * 100}%` }} /></div><small>{isComplete ? 'Every finding has a human disposition.' : 'Every finding requires an explicit disposition.'}</small></aside>
      </section>

      <section className="source-card">
        <div><span>PUBLIC SOURCE</span><strong>State of the Practice and Art for Structural Health Monitoring of Bridge Substructures</strong><small>U.S. DOT / Federal Highway Administration · May 2014</small></div>
        <a href="https://www.fhwa.dot.gov/publications/research/infrastructure/structures/bridge/09040/09040.pdf" target="_blank" rel="noreferrer">Open original PDF ↗</a>
      </section>

      <div className="review-grid">
        <section className="finding-list">
          <div className="section-label"><span>EXTRACTED FINDINGS</span><span>AI PROPOSES · HUMAN DISPOSES</span></div>
          {findings.map((finding) => (
            <article className={`finding-card ${reviewed[finding.id] ? 'reviewed' : ''}`} key={finding.id}>
              <div className="finding-id"><code>{finding.id}</code><span className={states[finding.id].toLowerCase()}>{states[finding.id]}</span></div>
              <div className="finding-copy"><h2>{finding.title}</h2><p>{finding.statement}</p><small>{finding.locator}</small><blockquote>{finding.significance}</blockquote></div>
              <div className="finding-controls" aria-label={`Review ${finding.id}`}>{stateOrder.map((state) => <button key={state} className={states[finding.id] === state ? 'active' : ''} onClick={() => setFindingState(finding.id, state)}>{state}</button>)}</div>
            </article>
          ))}
        </section>

        <aside className="review-summary">
          <div className="summary-heading"><span>EPISTEMIC LEDGER</span><b>{isComplete ? 'CHECKED' : 'OPEN'}</b></div>
          {counts.map(([state, count]) => <div className="state-count" key={state}><span className={state.toLowerCase()}>{state}</span><strong>{count}</strong></div>)}
          <div className={`review-gate ${disposition.toLowerCase().replace(' ', '-')}`}><small>DOWNSTREAM GATE</small><strong>{disposition}</strong><p>{!isComplete ? 'The source review is incomplete.' : hasUnresolved ? 'At least one action-relevant claim exceeds what the source documents.' : 'Documentation alone still does not authenticate live system state.'}</p></div>
          <div className="continuity-check"><span>CONTINUITY CHECK</span><p>Confidence was not allowed to increase during extraction. Inference and absence remain visible at the decision boundary.</p></div>
          <button className="export-button" disabled={!isComplete} onClick={exportReview}>Export reviewed record <span>↓</span></button>
        </aside>
      </div>
    </main>
  );
}
