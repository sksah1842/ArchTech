const API = import.meta.env.VITE_API_BASE ?? '';

function headers(token) {
  const h = { 'Content-Type': 'application/json' };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

export async function getPrescriptions(token) {
  const res = await fetch(`${API}/api/prescriptions`, {
    headers: headers(token),
  });
  if (!res.ok) throw new Error('Failed to load prescriptions');
  return res.json();
}

export async function approvePrescription(token, id) {
  const res = await fetch(`${API}/api/prescriptions/${id}/approve`, {
    method: 'PUT',
    headers: headers(token),
  });
  if (!res.ok) throw new Error('Failed to approve');
  return res.json();
}

export async function rejectPrescription(token, id) {
  const res = await fetch(`${API}/api/prescriptions/${id}/reject`, {
    method: 'PUT',
    headers: headers(token),
  });
  if (!res.ok) throw new Error('Failed to reject');
  return res.json();
}

/** Upload a prescription for a medicine (user must be logged in). Backend sets userId from JWT. */
export async function uploadPrescription(token, medicineId) {
  const res = await fetch(`${API}/api/prescriptions`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ medicineId }),
  });
  if (!res.ok) throw new Error('Failed to upload prescription');
  return res.json();
}
