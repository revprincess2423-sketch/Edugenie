import { useState } from 'react';
import { post } from '../api.js';
import { track } from '../stats.js';
import { useRun, Status, Card } from './ui.jsx';
export default function Flashcards() {
  const [input, setInput] = useState(''), [cards, setCards] = useState(null), [i, setI] = useState(0), [flip, setFlip] = useState(false);
  const { loading, error, setError, run } = useRun();
  const go = async e => {
    e.preventDefault();
    if (!input.trim()) return setError('Please enter a topic or paste notes.');
    const d = await run(() => post('flashcards', { input }));
    if (d) { setCards(d.cards); setI(0); setFlip(false); track('flashcards', input); }
  };
  const move = n => { setI(i + n); setFlip(false); };
  return (
    <>
      <Card title="Flashcard Generator">
        <textarea rows="4" value={input} onChange={e => setInput(e.target.value)} placeholder="Enter a topic or paste notes…" />
        <button className="btn" onClick={go} disabled={loading}>Generate flashcards</button>
        <Status loading={loading} error={error} label="Making flashcards…" />
      </Card>
      {cards && (
        <div className="fc-wrap">
          <div className={'flash' + (flip ? ' flip' : '')} onClick={() => setFlip(!flip)}>
            <div className="face front"><small>Question · tap to flip</small>{cards[i].front}</div>
            <div className="face back"><small>Answer</small>{cards[i].back}</div>
          </div>
          <div className="row center">
            <button className="btn ghost" disabled={i === 0} onClick={() => move(-1)}>← Previous</button>
            <span>{i + 1} / {cards.length}</span>
            <button className="btn" disabled={i === cards.length - 1} onClick={() => move(1)}>Next →</button>
          </div>
        </div>
      )}
    </>
  );
}
