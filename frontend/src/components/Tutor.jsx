import { useState, useRef, useEffect } from 'react';
import { post } from '../api.js';
import { track } from '../stats.js';
import { useRun, Status } from './ui.jsx';
export default function Tutor({ chat, setChat }) {
  const [input, setInput] = useState('');
  const { loading, error, setError, run } = useRun();
  const end = useRef();
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }); }, [chat, loading]);
  const send = async e => {
    e.preventDefault();
    if (!input.trim()) return setError('Please type a question first.');
    const msgs = [...chat, { role: 'user', text: input.trim() }];
    setChat(msgs); setInput('');
    const d = await run(() => post('chat', { messages: msgs }));
    if (d) { setChat([...msgs, { role: 'ai', text: d.text }]); track('ask', msgs[msgs.length - 1].text); }
  };
  return (
    <div className="card chat">
      <div className="msgs">
        {!chat.length && <p className="muted">Ask me anything — e.g. “Why is the sky blue?” You can ask follow-ups too.</p>}
        {chat.map((m, i) => <div key={i} className={'msg ' + m.role}><small>{m.role === 'user' ? 'You' : 'EduGenie'}</small>{m.text}</div>)}
        <Status loading={loading} error={error} />
        <div ref={end} />
      </div>
      <form onSubmit={send} className="row">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask a question…" />
        <button className="btn" disabled={loading}>Send</button>
      </form>
    </div>
  );
}
