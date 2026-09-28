import { useState } from 'react';
import { post } from '../api.js';
import { track } from '../stats.js';
import { useRun, Status, Card, LEVELS } from './ui.jsx';
export default function Quiz() {
  const [f, setF] = useState({ topic: '', count: 5, level: 'Beginner' });
  const [qs, setQs] = useState(null), [i, setI] = useState(0), [picks, setPicks] = useState([]), [done, setDone] = useState(false);
  const { loading, error, setError, run } = useRun();
  const start = async e => {
    e.preventDefault();
    if (!f.topic.trim()) return setError('Please enter a subject or topic.');
    const d = await run(() => post('quiz', f));
    if (d) { setQs(d.questions); setI(0); setPicks([]); setDone(false); }
  };
  const next = () => {
    if (i + 1 < qs.length) return setI(i + 1);
    const score = Math.round(picks.filter((p, k) => p === qs[k].answer).length / qs.length * 100);
    track('quiz', `${f.topic} (${score}%)`, score); setDone(true);
  };
  if (qs && done) {
    const right = picks.filter((p, k) => p === qs[k].answer).length;
    return (
      <Card title={`Score: ${right}/${qs.length} (${Math.round(right / qs.length * 100)}%)`}>
        {qs.map((q, k) => (
          <div key={k} className={'review ' + (picks[k] === q.answer ? 'ok' : 'bad')}>
            <b>{k + 1}. {q.question}</b>
            <p>Your answer: {q.options[picks[k]] ?? '—'}</p>
            <p>Correct answer: {q.options[q.answer]}</p>
            <small>{q.explanation}</small>
          </div>
        ))}
        <button className="btn" onClick={() => setQs(null)}>New quiz</button>
      </Card>
    );
  }
  if (qs) {
    const q = qs[i];
    return (
      <Card title={`Question ${i + 1} of ${qs.length}`}>
        <div className="bar"><i style={{ width: `${(i / qs.length) * 100}%` }} /></div>
        <p className="q">{q.question}</p>
        {q.options.map((o, k) => <button key={k} className={'opt' + (picks[i] === k ? ' sel' : '')} onClick={() => { const p = [...picks]; p[i] = k; setPicks(p); }}>{String.fromCharCode(65 + k)}. {o}</button>)}
        <button className="btn" disabled={picks[i] === undefined} onClick={next}>{i + 1 < qs.length ? 'Next' : 'Finish'}</button>
      </Card>
    );
  }
  return (
    <Card title="Quiz Generator">
      <form onSubmit={start} className="row">
        <input value={f.topic} onChange={e => setF({ ...f, topic: e.target.value })} placeholder="Subject or topic" />
        <select value={f.count} onChange={e => setF({ ...f, count: +e.target.value })}>{[3, 5, 10, 15].map(n => <option key={n} value={n}>{n} questions</option>)}</select>
        <select value={f.level} onChange={e => setF({ ...f, level: e.target.value })}>{LEVELS.map(l => <option key={l}>{l}</option>)}</select>
        <button className="btn" disabled={loading}>Generate</button>
      </form>
      <Status loading={loading} error={error} label="Building your quiz…" />
    </Card>
  );
}
