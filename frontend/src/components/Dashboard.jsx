import { useEffect, useState } from 'react';
import { getStats } from '../stats.js';
import { health } from '../api.js';
import { Card } from './ui.jsx';
export default function Dashboard({ go }) {
  const s = getStats();
  const [ok, setOk] = useState(null);
  useEffect(() => { health().then(h => setOk(h ? h.keyConfigured : 'down')); }, []);
  const avg = s.scores.length ? Math.round(s.scores.reduce((a, b) => a + b, 0) / s.scores.length) + '%' : '—';
  const stats = [['💬', 'Questions Asked', s.asked], ['📝', 'Quizzes Completed', s.scores.length], ['🎯', 'Average Quiz Score', avg], ['⏱️', 'Study Sessions', s.sessions]];
  return (
    <>
      <div className="hero">
        <h2>Welcome to EduGenie 👋</h2>
        <p>Ask questions, summarize notes, take quizzes and plan your studies — powered by Google Gemini.</p>
        <button className="btn light" onClick={() => go('tutor')}>Start learning</button>
      </div>
      {ok === false && <div className="err">🔑 Gemini API key not found. Copy <code>.env.example</code> to <code>.env</code>, add your key as <code>GEMINI_API_KEY</code>, then restart <code>npm run dev</code>.</div>}
      {ok === 'down' && <div className="err">⚠️ The backend isn't running. Start the app with <code>npm run dev</code>.</div>}
      <div className="grid">{stats.map(([i, l, v]) => <div className="card stat" key={l}><span>{i}</span><b>{v}</b><small>{l}</small></div>)}</div>
      <Card title="Recent Activities">
        {s.log.length ? <ul className="log">{s.log.map((a, i) => <li key={i}><b>{a.type}</b> {a.detail}<small>{a.time}</small></li>)}</ul> : <p className="muted">No activity yet — try the AI Tutor or generate a quiz!</p>}
      </Card>
    </>
  );
}
