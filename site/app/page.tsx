'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

type StoryChapter = {
  id: string;
  number: string;
  short: string;
  marker: string;
  title: string;
  lead: string;
  observation: string;
  inference: string;
  next: string;
  nuru: string;
  status: string;
};

const chapters: StoryChapter[] = [
  {
    id: 'origin', number: '01', short: 'Origin', marker: 'THE ORIGINAL QUESTION',
    title: 'This did not begin with a product.',
    lead: 'It began with a personal search: could one person find and build an unusually important business in the age of AI?',
    observation: 'Optimizing first for present skills, capital, location, or ease of building could produce a practical project while hiding the deeper opportunity created by AI.',
    inference: 'Importance and entry strategy had to become separate questions. We stopped asking what was easiest to build and started asking what AI would make newly important.',
    next: 'As AI becomes dramatically more capable and broadly accessible, what remains difficult underneath it?',
    nuru: 'The first breakthrough was not an answer. It was refusing to let the current founder constraint define the size of the question.',
    status: 'DECISION',
  },
  {
    id: 'shift', number: '02', short: 'The shift', marker: 'LOOKING BENEATH INTELLIGENCE',
    title: 'Capability changes what becomes scarce.',
    lead: 'Powerful AI can make analysis, prediction, planning, and software creation easier and available to far more people.',
    observation: 'An AI can recommend a decision or generate a plan. But a plan does not automatically become an authorized, verified, accountable change in the physical world.',
    inference: 'The lasting bottleneck may sit in the chain below intelligence: intent, authority, action, state change, evidence, outcome, and accountability.',
    next: 'Which part of that chain remains scarce even when the AI is exceptionally capable?',
    nuru: '“Cheap” is a consequence, not the thesis. The driver is expanding capability and access.',
    status: 'WORLD MODEL',
  },
  {
    id: 'test', number: '03', short: '100× test', marker: 'REMOVING INTELLIGENCE AS THE BOTTLENECK',
    title: 'We gave the AI every advantage.',
    lead: 'Imagine an AI one hundred times more capable, broadly available, and nearly perfect at analyzing every record it receives.',
    observation: 'Across health, robotics, logistics, insurance, infrastructure, lending, and intelligence, uncertainty still remained when a state was unobserved, stale, misbound, manipulated, or supported by dependent sources.',
    inference: 'Better reasoning can improve an estimate. It cannot manufacture a missing observation or prove that a later physical state change occurred.',
    next: 'Does the same residual failure survive in an environment where uncertainty is dynamic, adversarial, and consequential?',
    nuru: 'The thesis survived the thought experiment—but only as a narrower hypothesis, not as proof of a product or market.',
    status: 'FALSIFICATION',
  },
  {
    id: 'pattern', number: '04', short: 'The pattern', marker: 'IOT / IOBT STRESS ENVIRONMENT',
    title: 'Unknown was disappearing on the way to action.',
    lead: 'IoBT concentrated the hardest conditions: incomplete observation, deception, stale data, shared infrastructure, interrupted communication, and irreversible consequences.',
    observation: 'Across unrelated failure cases, absence of positive confirmation was repeatedly treated as sufficient permission. Multiple sources also looked independent even when they shared one sensor, clock, power supply, network, or model.',
    inference: 'The deeper failure might not be poor estimation alone. Action-relevant meaning was being weakened as information crossed sensing, fusion, decision, and action boundaries.',
    next: 'Can a reusable mechanism prevent uncertainty and evidence dependence from being silently flattened?',
    nuru: 'Three messages can still be one observation wearing three uniforms.',
    status: 'CONNECTION',
  },
  {
    id: 'mechanism', number: '05', short: 'Mechanism', marker: 'CLAIM–EVIDENCE–ACTION CONTRACT',
    title: 'Make every consequential action show its work.',
    lead: 'An action declares the real-world claims it requires. Each claim keeps its evidence, lineage, freshness, entity binding, contradictions, and relevant dependencies.',
    observation: 'A frozen seven-scenario contract could be evaluated deterministically. Adversarial tests then exposed invalid values, wrong entities, temporal errors, integrity failures, unresolved ancestry, and false independence.',
    inference: 'The control mechanism is buildable, but it is trustworthy only when the evidence metadata entering it is authentic, complete, and expressive enough.',
    next: 'Who or what can create that metadata without losing important meaning?',
    nuru: 'The evaluator caught failures—and then became evidence of the same failure pattern it was designed to prevent.',
    status: 'PROTOTYPE',
  },
  {
    id: 'leap', number: '06', short: 'The leap', marker: 'EPISTEMIC CONTINUITY',
    title: 'Certainty should not appear from nowhere.',
    lead: 'Machines, metadata, software, and careful human reviewers all produced one surprising shape: downstream certainty became stronger without new qualifying evidence.',
    observation: 'A reviewer found a shared dependency in engineering findings and then dropped it while translating those findings into action rules. The fact existed; the transformation lost it.',
    inference: 'Uncertainty, provenance, freshness, dependence, scope, and contradiction may need to remain attached to a claim through every transformation that leads to action.',
    next: 'Is this conservation rule distinct and useful, or established assurance practice under another name?',
    nuru: 'This is the creative leap of the project. It remains a testable hypothesis, not a discovered law.',
    status: 'ABDUCTIVE HYPOTHESIS',
  },
  {
    id: 'frontier', number: '07', short: 'The frontier', marker: 'REALITY AUDIT',
    title: 'The next evidence must come from outside us.',
    lead: 'Reality Audit turns the hypothesis into a shadow-mode workflow for one consequential IoT decision: claims, evidence, dependencies, review, attack tests, and an inspectable action disposition.',
    observation: 'The public build demonstrates the workflow. Adjacent assurance markets exist. But we do not yet have a verified buyer, budget, paid pilot, or independent practitioner correction.',
    inference: 'Another internally invented feature is not the highest-leverage next step. Real decision artifacts and external use must now test whether the method changes anything that matters.',
    next: 'Will a practitioner share a real artifact, correct the audit, change a decision, and take a concrete step toward a pilot or payment?',
    nuru: 'A polished demo is still a demo. Grounding begins when someone outside the project can prove us wrong.',
    status: 'MARKET GATE',
  },
];

const evidenceLedger = [
  { label: 'Failure atlas', value: '9 cases', note: 'Recurring missing-confirmation pattern', tone: 'good' },
  { label: 'Frozen scenarios', value: '7 / 7', note: 'Deterministic contract behavior', tone: 'good' },
  { label: 'Adversarial paths', value: '0 / 6 open', note: 'Known control-flow gaps closed', tone: 'good' },
  { label: 'Metadata attacks', value: '7 / 7', note: 'Integrity weakness reproduced', tone: 'warn' },
  { label: 'Independent review', value: 'Mixed', note: 'Findings-to-rules loss observed', tone: 'warn' },
  { label: 'Commercial proof', value: 'Not yet', note: 'Buyer and payment unvalidated', tone: 'open' },
];

const guideMessages = [
  ['Do not start with our answer.', 'Follow the question as it changes. Each chapter separates what we observed, what we inferred, and what we still need to learn.'],
  ['Inference is not observation.', 'A stronger model can reason better over the record it has. It cannot make an unobserved physical state appear inside that record.'],
  ['No contradiction is not confirmation.', 'The dangerous transition occurs when an interface cannot carry uncertainty and the next layer receives a claim that looks more certain than its evidence.'],
  ['This is not a finished solution.', 'Epistemic Continuity, the contract, and Reality Audit are candidate mechanisms. The market and the exact architectural novelty remain open.'],
];

export default function Home() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideStep, setGuideStep] = useState(0);
  const chapter = chapters[activeChapter];
  const guide = guideMessages[guideStep];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (guideOpen) return;
      if (event.key === 'ArrowRight') setActiveChapter((current) => Math.min(current + 1, chapters.length - 1));
      if (event.key === 'ArrowLeft') setActiveChapter((current) => Math.max(current - 1, 0));
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [guideOpen]);

  return (
    <main className="story-site">
      {guideOpen && (
        <dialog open className="guide-layer" aria-labelledby="guide-title">
          <button className="guide-dismiss" onClick={() => setGuideOpen(false)} aria-label="Close Nuru guide">Close guide</button>
          <div className="guide-visual" aria-hidden="true"><Image src="/nuru-guide.png" alt="" fill priority sizes="(max-width: 800px) 100vw, 48vw" /></div>
          <div className="guide-panel">
            <div className="guide-id"><span className="guide-pulse" /><span>NURU // REALITY GUIDE</span></div>
            <p className="guide-marker">ORIENTATION {String(guideStep + 1).padStart(2, '0')}</p>
            <h2 id="guide-title">{guide[0]}</h2>
            <p className="guide-body">{guide[1]}</p>
            <div className="guide-controls">
              <div className="guide-progress" aria-label={`Step ${guideStep + 1} of ${guideMessages.length}`}>{guideMessages.map((_, index) => <span key={index} className={index <= guideStep ? 'active' : ''} />)}</div>
              <button onClick={() => guideStep < guideMessages.length - 1 ? setGuideStep(guideStep + 1) : setGuideOpen(false)}>{guideStep === guideMessages.length - 1 ? 'Enter the story' : 'Continue'} <span>→</span></button>
            </div>
          </div>
        </dialog>
      )}

      <nav className="story-nav" aria-label="Primary navigation">
        <a className="story-wordmark" href="#top" aria-label="Reality home"><span />REALITY</a>
        <div className="story-nav-center"><a href="#story">Discovery</a><a href="#evidence">Evidence</a><a href="#frontier">Frontier</a></div>
        <a className="story-product-link" href="/audit">Open Reality Audit <span>↗</span></a>
      </nav>

      <section className="story-hero" id="top">
        <div className="story-hero-copy">
          <div className="story-meta"><span>DISCOVERY LOG / 001</span><span>OPEN INVESTIGATION</span></div>
          <p className="story-overline">It began with a different question.</p>
          <h1>What should one person build <em>when intelligence becomes powerful?</em></h1>
          <p className="story-intro">We did not begin with Reality Audit. We began by looking beneath AI for the constraint its growing capability would make impossible to ignore.</p>
          <div className="story-hero-actions"><a href="#story">Follow the discovery <span>↓</span></a><button onClick={() => { setGuideStep(0); setGuideOpen(true); }}>Ask Nuru to guide me</button></div>
        </div>
        <aside className="story-nuru" aria-label="Nuru field guide">
          <div className="story-nuru-image"><Image src="/nuru-guide.png" alt="Nuru, the Reality guide" fill priority sizes="(max-width: 880px) 100vw, 36vw" /></div>
          <div className="story-nuru-copy"><span>NURU / FIELD GUIDE</span><p>“Do not start with our answer. Follow the evidence that forced the question to change.”</p></div>
        </aside>
        <div className="story-route" aria-label="Discovery route">
          {chapters.map((item, index) => <button key={item.id} onClick={() => { setActiveChapter(index); document.querySelector('#story')?.scrollIntoView({ behavior: 'smooth' }); }}><i>{item.number}</i><strong>{item.short}</strong><small>{item.status}</small></button>)}
        </div>
      </section>

      <section className="story-engine" id="story">
        <aside className="chapter-rail" aria-label="Discovery chapters">
          <div className="rail-title"><span>DISCOVERY PATH</span><b>{String(activeChapter + 1).padStart(2, '0')} / {String(chapters.length).padStart(2, '0')}</b></div>
          {chapters.map((item, index) => <button key={item.id} className={index === activeChapter ? 'active' : ''} onClick={() => setActiveChapter(index)} aria-current={index === activeChapter ? 'step' : undefined}><span>{item.number}</span><strong>{item.short}</strong><i>{index < activeChapter ? 'TRACED' : index === activeChapter ? 'READING' : 'AHEAD'}</i></button>)}
          <p className="keyboard-hint">Use ← → to move through the story</p>
        </aside>

        <article className="chapter-canvas" key={chapter.id}>
          <header><div><span>{chapter.number} / {chapter.marker}</span><i>{chapter.status}</i></div><h2>{chapter.title}</h2><p>{chapter.lead}</p></header>
          <div className="reasoning-grid">
            <section><span>OBSERVATION</span><p>{chapter.observation}</p></section>
            <section><span>WHAT WE INFERRED</span><p>{chapter.inference}</p></section>
            <section className="next-question"><span>NEXT QUESTION</span><p>{chapter.next}</p></section>
          </div>
          <footer>
            <div className="chapter-nuru"><span className="mini-nuru"><Image src="/nuru-guide.png" alt="" fill sizes="52px" /></span><p><b>NURU’S NOTE</b>{chapter.nuru}</p></div>
            <div className="chapter-controls"><button disabled={activeChapter === 0} onClick={() => setActiveChapter(activeChapter - 1)} aria-label="Previous chapter">←</button><button disabled={activeChapter === chapters.length - 1} onClick={() => setActiveChapter(activeChapter + 1)} aria-label="Next chapter">Next chapter <span>→</span></button></div>
          </footer>
        </article>
      </section>

      <section className="conservation" aria-labelledby="conservation-title">
        <div className="conservation-head"><span>THE ABDUCTIVE LEAP</span><h2 id="conservation-title">Certainty should not appear from nowhere.</h2><p>This is the proposed Epistemic Conservation Rule. It is an engineering hypothesis—not a scientific law or a novelty claim.</p></div>
        <div className="conservation-rule"><span>IF</span><p>A transformation increases action-relevant certainty</p><i>→</i><span>THEN REQUIRE</span><p>new authenticated, relevant, sufficiently independent evidence</p><i>→</i><span>OTHERWISE</span><p>the affected claim remains or returns to <b>UNKNOWN</b></p></div>
        <div className="conservation-states"><div><span className="state-dot confirmed" /><strong>CONFIRMED</strong><p>Evidence contract satisfied</p></div><div><span className="state-dot contradicted" /><strong>CONTRADICTED</strong><p>Credible evidence conflicts</p></div><div><span className="state-dot unknown-state" /><strong>UNKNOWN</strong><p>Positive confirmation absent</p></div></div>
      </section>

      <section className="evidence-console" id="evidence">
        <header><div><span>EVIDENCE CONSOLE</span><h2>What survived contact with testing?</h2></div><p>Agreement is not validation. Every result is kept with the weakness it exposed.</p></header>
        <div className="ledger-grid">{evidenceLedger.map((item, index) => <article key={item.label}><div><span>{String(index + 1).padStart(2, '0')}</span><i className={item.tone} /></div><h3>{item.label}</h3><strong>{item.value}</strong><p>{item.note}</p></article>)}</div>
        <div className="honesty-strip"><span>CURRENT VERDICT</span><p>The technical hypothesis survives. The architecture may be an integration of established practices. The commercial market remains unvalidated.</p></div>
      </section>

      <section className="mechanism-section">
        <div className="mechanism-copy"><span>THE WORKING MECHANISM</span><h2>From evidence<br />to permission.</h2><p>Not a better prediction engine. A contract that prevents epistemic meaning from silently disappearing before action.</p><a href="/audit">Enter the working prototype <b>↗</b></a></div>
        <div className="mechanism-flow" aria-label="Claim Evidence Action flow">{['Action intent', 'Required claims', 'Evidence lineage', 'Dependency test', 'Epistemic state', 'Action gate'].map((item, index) => <div key={item}><i>{String(index + 1).padStart(2, '0')}</i><strong>{item}</strong><span>{index < 5 ? '↓' : 'PERMIT / REVALIDATE / REVIEW / REFUSE'}</span></div>)}</div>
      </section>

      <section className="frontier-section" id="frontier">
        <div className="frontier-index"><span>NOW / THE GROUNDING PHASE</span><b>NO FALSE FINISH LINE</b></div>
        <div className="frontier-main"><h2>The next evidence must come from outside us.</h2><p>The public prototype is real. Its current case is curated. We still need a practitioner, a real non-operational decision artifact, an independent correction, and evidence that the result changes a decision enough to justify a pilot.</p></div>
        <div className="frontier-gates"><div><span>01</span><strong>10 qualified conversations</strong><small>OPEN</small></div><div><span>02</span><strong>3 real decision artifacts</strong><small>OPEN</small></div><div><span>03</span><strong>3 shadow audits</strong><small>OPEN</small></div><div><span>04</span><strong>1 payment or procurement signal</strong><small>OPEN</small></div></div>
      </section>

      <footer className="story-footer"><div><a className="story-wordmark" href="#top"><span />REALITY</a><p>Infrastructure for intelligent systems to interact with reality reliably.</p></div><div><a href="https://github.com/guardian-coder/reality" target="_blank" rel="noreferrer">Examine the open repository ↗</a><a href="/audit/review">Review the evidence boundary ↗</a></div><small>Developed in public by Brayan Lucas Mwangimba with AI collaborators · Tanzania · 2026</small></footer>
    </main>
  );
}
