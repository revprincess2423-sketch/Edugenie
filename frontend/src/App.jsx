import { useState } from 'react';
import Dashboard from './components/Dashboard.jsx';
import Tutor from './components/Tutor.jsx';
import Explain from './components/Explain.jsx';
import Summarizer from './components/Summarizer.jsx';
import Quiz from './components/Quiz.jsx';
import Planner from './components/Planner.jsx';
import Flashcards from './components/Flashcards.jsx';

const NAV = [['dashboard', '🏠', 'Dashboard'], ['tutor', '🤖', 'AI Tutor'], ['explain', '💡', 'Explain Topic'], ['summarizer', '📄', 'Summarizer'], ['quiz', '📝', 'Quiz Generator'], ['planner', '📅', 'Study Planner'], ['flashcards', '🗂️', 'Flashcards']];

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState([]);
  const go = p => { setPage(p); setOpen(false); };
  const view = {
    dashboard: <Dashboard go={go} key={Date.now()} />,
    tutor: <Tutor chat={chat} setChat={setChat} />,
    explain: <Explain />, summarizer: <Summarizer />, quiz: <Quiz />, planner: <Planner />, flashcards: <Flashcards />
  }[page];
  return (
    <div className="app">
      <aside className={'side' + (open ? ' open' : '')}>
        <div className="brand"><h1>🎓 EduGenie</h1><p>Your AI-Powered Learning Companion</p></div>
        <nav>{NAV.map(([id, ic, label]) => <button key={id} className={page === id ? 'active' : ''} onClick={() => go(id)}>{ic} {label}</button>)}</nav>
      </aside>
      <main>
        <header><button className="menu" onClick={() => setOpen(!open)}>☰</button><h2>{NAV.find(n => n[0] === page)[2]}</h2></header>
        <div className="content">{view}</div>
      </main>
    </div>
  );
}
