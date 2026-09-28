import { useState } from 'react';
import { post } from '../api.js';
import { track } from '../stats.js';
import { useRun, Status, Card, LEVELS } from './ui.jsx';
export default function Planner() {
  const [f, setF] = useState({ subject: '', examDate: '', hours: 2, level: 'Beginner' });
  const [days, setDays] = useState(null);
  const { loading, error, setError, run } = useRun();
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const go = async e => {
    e.preventDefault();
    if (!f.subject.trim() || !f.examDate) return setError('Please enter a subject and exam date.');
    if (!(+f.hours > 0 && +f.hours <= 16)) return setError('Study hours per day must be between 1 and 16.');
    const d = await run(() => post('plan', f));
    if (d) { setDays(d.days); track('plan', f.subject); }
  };
  return (
    <>
      <Card title="Study Plan Generator">
        <form onSubmit={go} className="row">
          <input value={f.subject} onChange={set('subject')} placeholder="Subject" />
          <input type="date" value={f.examDate} onChange={set('examDate')} />
          <input type="number" min="1" max="16" step="0.5" value={f.hours} onChange={set('hours')} title="Hours per day" />
          <select value={f.level} onChange={set('level')}>{LEVELS.map(l => <option key={l}>{l}</option>)}</select>
          <button className="btn" disabled={loading}>Create plan</button>
        </form>
        <Status loading={loading} error={error} label="Planning your days…" />
      </Card>
      {days && <div className="grid">{days.map((d, i) => <div className="card day" key={i}><small>{d.day} · {d.date}</small><h4>{d.focus}</h4><ul>{d.tasks?.map((t, k) => <li key={k}>{t}</li>)}</ul></div>)}</div>}
    </>
  );
}
