import { useState } from 'react';
export function useRun() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const run = async fn => {
    setLoading(true); setError('');
    try { return await fn(); } catch (e) { setError(e.message); } finally { setLoading(false); }
  };
  return { loading, error, setError, run };
}
export const Status = ({ loading, error, label = 'Gemini is thinking…' }) => (
  <>
    {loading && <div className="loader"><span className="spin" />{label}</div>}
    {error && <div className="err">⚠️ {error}</div>}
  </>
);
export const Card = ({ title, children }) => <section className="card">{title && <h3>{title}</h3>}{children}</section>;
export const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
