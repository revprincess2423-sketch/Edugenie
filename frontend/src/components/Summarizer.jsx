import { useState } from 'react';
import { post } from '../api.js';
import { track } from '../stats.js';
import { useRun, Status, Card } from './ui.jsx';
export default function Summarizer() {
  const [text, setText] = useState(''), [out, setOut] = useState(null);
  const { loading, error, setError, run } = useRun();
  const go = async () => {
    if (!text.trim()) return setError('Please paste some notes to summarize.');
    const d = await run(() => post('summarize', { text }));
    if (d) { setOut(d); track('summary', text); }
  };
  return (
    <>
      <Card title="Text Summarizer">
        <textarea rows="8" value={text} onChange={e => setText(e.target.value)} placeholder="Paste your study material or notes here…" />
        <button className="btn" onClick={go} disabled={loading}>Summarize</button>
        <Status loading={loading} error={error} />
      </Card>
      {out && <>
        <Card title="Short Summary"><p>{out.summary}</p></Card>
        <Card title="Key Points"><ul>{out.keyPoints?.map((k, i) => <li key={i}>{k}</li>)}</ul></Card>
        <Card title="Important Terms"><dl>{out.terms?.map((t, i) => <div key={i}><dt>{t.term}</dt><dd>{t.meaning}</dd></div>)}</dl></Card>
      </>}
    </>
  );
}
