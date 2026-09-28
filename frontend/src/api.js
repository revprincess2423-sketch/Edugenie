export async function post(path, body) {
  let r;
  try {
    r = await fetch('/api/' + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  } catch { throw new Error('Cannot reach the EduGenie server. Is it running? (npm run dev)'); }
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || 'Something went wrong. Please try again.');
  return d;
}
export const health = () => fetch('/api/health').then(r => r.json()).catch(() => null);
