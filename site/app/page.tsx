const evidence = [
  { number: '01', label: 'OBSERVATION', title: 'Unknown quietly becomes true.', body: 'Across aviation, medicine, navigation, autonomous vehicles and defense, we found the same failure shape: missing confirmation was allowed to harden into permission to act.' },
  { number: '02', label: 'COMPLICATION', title: 'More sources do not guarantee independence.', body: 'Three sensors can still be one source of truth when they share power, calibration, communications or a common physical failure mode.' },
  { number: '03', label: 'WORKING PRIMITIVE', title: 'Claims should carry their evidence to the point of action.', body: 'A consequential action should be permitted only when its required claims satisfy an explicit evidence contract—without losing provenance, freshness, dependence or uncertainty on the way.' },
];

const tests = [
  ['Reality-failure atlas', '9 cases', 'The same missing-confirmation pattern survived across unrelated systems.'],
  ['Frozen evaluator scenarios', '7 / 7', 'The minimal contract can be evaluated deterministically.'],
  ['Adversarial control-flow tests', '0 / 6 open', 'False permission and false refusal paths were found, corrected and rerun.'],
  ['Metadata-integrity attacks', '7 / 7 reproduced', 'The gate is only as trustworthy as the dependency metadata it receives.'],
  ['Independent engineering review', 'Mixed', 'Reviewers found the same core dependencies, but one lost a known dependency while translating findings into rules.'],
];

const states = [
  ['CONFIRMED', 'Required evidence is present, current and sufficiently independent.'],
  ['CONTRADICTED', 'Credible evidence conflicts with the claim.'],
  ['UNKNOWN', 'Positive confirmation is absent or the evidence contract is not satisfied.'],
];

export default function Home() {
  return (
    <main>
      <nav className="nav shell" aria-label="Primary navigation">
        <a className="wordmark" href="#top" aria-label="Reality home"><span className="signal-dot" />REALITY</a>
        <div className="nav-links"><a href="#thesis">Thesis</a><a href="#evidence">Evidence</a><a href="#now">Now</a></div>
        <a className="repo-link" href="https://github.com/guardian-coder/reality" target="_blank" rel="noreferrer">Open repository <span aria-hidden="true">↗</span></a>
      </nav>

      <section className="hero shell" id="top">
        <div className="eyebrow"><span>OPEN RESEARCH</span><span>PROJECT 001</span><span>LAST UPDATED 05.09.2026</span></div>
        <h1>When intelligence<br />becomes cheap,</h1>
        <div className="hero-question"><span className="question-mark">?</span><p>what still stands between<br />a decision and reality?</p></div>
        <div className="hero-footer">
          <p>Reality is an open investigation into the infrastructure intelligent systems may need to act on the world without silently turning uncertainty into fact.</p>
          <a href="#thesis" className="down-link"><span>Read the current thesis</span><span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <section className="manifesto" id="thesis"><div className="shell two-col">
        <div className="section-index"><span>01</span><span>THE THESIS</span></div>
        <div className="manifesto-copy">
          <p className="lead">Intelligence can infer. It cannot make missing evidence exist.</p>
          <p>Our working thesis is that, as AI becomes more capable, a different bottleneck remains: establishing a defensible state of reality that is strong enough for consequential decisions.</p>
          <p className="uncertainty"><span>STATUS</span> This is a hypothesis under active falsification—not a proven company, market or new category.</p>
        </div>
      </div></section>

      <section className="journey shell" id="evidence">
        <div className="section-index"><span>02</span><span>THE CONNECTION WE FOUND</span></div>
        <div className="evidence-list">{evidence.map((item) => (
          <article className="evidence-row" key={item.number}><div className="evidence-number">{item.number}</div><div className="evidence-label">{item.label}</div><div><h2>{item.title}</h2><p>{item.body}</p></div></article>
        ))}</div>
      </section>

      <section className="contract"><div className="shell">
        <div className="section-index light"><span>03</span><span>THE WORKING MECHANISM</span></div>
        <div className="contract-head"><h2>Claim–Evidence–<br />Action Contract</h2><p>Not a better prediction engine. A runtime discipline that prevents epistemic information from disappearing before action.</p></div>
        <div className="pipeline" aria-label="Claim evidence action pipeline">{['Required claim', 'Evidence lineage', 'Dependency graph', 'Epistemic state', 'Action gate'].map((item, index) => (
          <div className="pipeline-step" key={item}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong>{index < 4 && <i aria-hidden="true">→</i>}</div>
        ))}</div>
        <div className="states">{states.map(([name, desc]) => <div key={name}><strong>{name}</strong><p>{desc}</p></div>)}</div>
      </div></section>

      <section className="tests shell">
        <div className="section-index"><span>04</span><span>WHAT WE HAVE TRIED TO BREAK</span></div>
        <div className="tests-intro"><h2>The project advances by surviving attacks—not by collecting agreement.</h2><p>Every result changes the thesis. Failures are kept because they are often more useful than clean demonstrations.</p></div>
        <div className="test-table">{tests.map(([name, result, finding]) => (
          <div className="test-row" key={name}><strong>{name}</strong><span>{result}</span><p>{finding}</p></div>
        ))}</div>
      </section>

      <section className="now" id="now"><div className="shell two-col">
        <div className="section-index light"><span>05</span><span>THE LIVE QUESTION</span></div>
        <div>
          <h2>Can evidence dependencies be captured honestly enough to govern real action?</h2>
          <p>The evaluator’s control flow is no longer the largest risk. The hard problem has moved upstream: metadata can be missing, mislabeled, fabricated, or lost when human findings are compressed into machine rules.</p>
          <p>We are now testing whether existing engineering documents and independent reviewers can recover those dependencies reliably—and whether another field has already solved this better.</p>
          <div className="open-questions"><span>OPEN</span><ul><li>How should dependency metadata earn trust?</li><li>Can failure effects change over time without being flattened?</li><li>Where does uncertainty disappear between sensing and action?</li></ul></div>
        </div>
      </div></section>

      <footer className="footer shell">
        <div><p className="footer-call">If this resembles something your field already knows, we want to hear that.</p><p>Reality is being developed in public by Brayan Lucas Mwangimba with AI collaborators. The repository contains the evidence, decision log, kill criteria, prototype and unresolved questions.</p></div>
        <div className="footer-actions"><a href="https://github.com/guardian-coder/reality" target="_blank" rel="noreferrer">Examine the work <span>↗</span></a><span className="smallprint">Tanzania · Open research · 2026</span></div>
      </footer>
    </main>
  );
}
