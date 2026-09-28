import { useState } from 'react';
import { post } from '../api.js';
import { track } from '../stats.js';
import { useRun, Status, Card, LEVELS } from './ui.jsx';
export default function Explain() {
  const [topic, setTopic] = useState(''), [level, setLevel] = useState('Beginner'), [out, setOut] = useState('');
  const { loading, error, setError, run } = useRun();
  const go = async e => {
    e.preventDefault();
    if (!topic.trim()) return setError('Please enter a topic.');
    const d = await run(() => post('explain', { topic, level }));
    if (d) { setOut(d.text); track('explain', topic); }
  };
  return (
    <>
      <Card title="Explain a Topic">
        <form onSubmit={go} className="row">
          <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Photosynthesis" />
          <select value={level} onChange={e => setLevel(e.target.value)}>{LEVELS.map(l => <option key={l}>{l}</option>)}</select>
          <button className="btn" disabled={loading}>Explain</button>
        </form>
        <Status loading={loading} error={error} />
      </Card>
      {out && <Card title={`${topic} — ${level}`}><div className="text">{out}</div></Card>}
    </>
  );
}
