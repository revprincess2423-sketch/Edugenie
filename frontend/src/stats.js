const K = 'edugenie-stats';
const empty = () => ({ asked: 0, scores: [], sessions: 0, log: [] });
export const getStats = () => { try { return JSON.parse(localStorage.getItem(K)) || empty(); } catch { return empty(); } };
export function track(type, detail, score) {
  const s = getStats();
  if (type === 'ask') s.asked++;
  if (type === 'quiz') s.scores.push(score);
  s.sessions++;
  s.log = [{ type, detail: String(detail).slice(0, 60), time: new Date().toLocaleString() }, ...s.log].slice(0, 8);
  try { localStorage.setItem(K, JSON.stringify(s)); } catch {}
}
