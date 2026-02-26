/**
 * Use /api so Vite proxy forwards to medicine-service (proxy matches /api/medicines)
 */
const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

export async function getMedicines() {
  const url = `${API_BASE}/medicines`;
  const res = await fetch(url);
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    if (text.trim().toLowerCase().startsWith('<!')) {
      throw new Error('Backend returned a page instead of data. Is medicine-service running on port 8082?');
    }
    throw new Error(res.ok ? 'Invalid response from server' : `Request failed: ${res.status}`);
  }
  if (!res.ok) throw new Error('Failed to load medicines');
  return res.json();
}
