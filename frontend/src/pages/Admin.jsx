import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectToken } from '../store/slices/authSlice';
import { getPrescriptions, approvePrescription, rejectPrescription } from '../api/prescriptions';
import { addMedicine, getMedicines } from '../api/medicines';
import './Admin.css';

function Admin() {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionsLoading, setPrescriptionsLoading] = useState(true);
  const [prescriptionsError, setPrescriptionsError] = useState(null);
  const [addSuccess, setAddSuccess] = useState(null);
  const [addError, setAddError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [medicinesLoading, setMedicinesLoading] = useState(true);
  const [medicinesError, setMedicinesError] = useState(null);
  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    dosage: '',
    packaging: '',
    requiresPrescription: false,
  });

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    if (!token || !isAdmin) {
      navigate('/', { replace: true });
      return;
    }
    getPrescriptions(token)
      .then(setPrescriptions)
      .catch((e) => setPrescriptionsError(e.message))
      .finally(() => setPrescriptionsLoading(false));
  }, [token, isAdmin, navigate]);

  function loadMedicines() {
    setMedicinesLoading(true);
    getMedicines()
      .then(setMedicines)
      .catch((e) => setMedicinesError(e.message))
      .finally(() => setMedicinesLoading(false));
  }

  useEffect(() => {
    if (!isAdmin) return;
    loadMedicines();
  }, [isAdmin]);

  const handleApprove = async (id) => {
    try {
      const updated = await approvePrescription(token, id);
      setPrescriptions((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (e) {
      setPrescriptionsError(e.message);
    }
  };

  const handleReject = async (id) => {
    try {
      const updated = await rejectPrescription(token, id);
      setPrescriptions((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (e) {
      setPrescriptionsError(e.message);
    }
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    setAddError(null);
    setAddSuccess(null);
    setAdding(true);
    try {
      await addMedicine(token, {
        name: form.name,
        category: form.category || null,
        price: Number(form.price) || 0,
        stock: Number(form.stock) || 0,
        dosage: form.dosage || null,
        packaging: form.packaging || null,
        requiresPrescription: form.requiresPrescription,
      });
      setAddSuccess('Medicine added successfully.');
      setForm({ name: '', category: '', price: '', stock: '', dosage: '', packaging: '', requiresPrescription: false });
      loadMedicines();
    } catch (err) {
      setAddError(err.message);
    } finally {
      setAdding(false);
    }
  };

  if (!token) return null;

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">Admin Dashboard</h1>
      </div>

      <section className="admin-section">
        <h2 className="admin-section-title">All Medicines</h2>
        <p className="admin-section-desc">Catalog of all medicines in the store.</p>
        {medicinesLoading && <p className="admin-loading">Loading medicines…</p>}
        {medicinesError && <p className="admin-error">{medicinesError}</p>}
        {!medicinesLoading && !medicinesError && (
          <div className="admin-table-wrap">
            {medicines.length === 0 ? (
              <p className="admin-empty">No medicines in catalog yet.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Dosage</th>
                    <th>Packaging</th>
                    <th>Rx</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map((m) => (
                    <tr key={m.id}>
                      <td>{m.id}</td>
                      <td>{m.name}</td>
                      <td>{m.category || '—'}</td>
                      <td>${typeof m.price === 'number' ? m.price.toFixed(2) : m.price}</td>
                      <td>{m.stock ?? '—'}</td>
                      <td>{m.dosage || '—'}</td>
                      <td>{m.packaging || '—'}</td>
                      <td>{m.requiresPrescription ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </section>

      <section className="admin-section">
        <h2 className="admin-section-title">Prescriptions</h2>
        <p className="admin-section-desc">Review uploaded prescriptions and approve or reject.</p>
        {prescriptionsLoading && <p className="admin-loading">Loading prescriptions…</p>}
        {prescriptionsError && <p className="admin-error">{prescriptionsError}</p>}
        {!prescriptionsLoading && !prescriptionsError && (
          <div className="admin-table-wrap">
            {prescriptions.length === 0 ? (
              <p className="admin-empty">No prescriptions uploaded yet.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User ID</th>
                    <th>Medicine ID</th>
                    <th>Status</th>
                    <th>Prescription file</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.userId}</td>
                      <td>{p.medicineId}</td>
                      <td><span className={`admin-status admin-status-${(p.status || '').toLowerCase()}`}>{p.status}</span></td>
                      <td>
                        {p.fileUrl ? (
                          <a href={p.fileUrl} target="_blank" rel="noopener noreferrer" className="admin-link">View</a>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td>
                        {p.status === 'PENDING' && (
                          <>
                            <button type="button" className="admin-btn admin-btn-approve" onClick={() => handleApprove(p.id)}>Approve</button>
                            <button type="button" className="admin-btn admin-btn-reject" onClick={() => handleReject(p.id)}>Reject</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </section>

      <section className="admin-section">
        <h2 className="admin-section-title">Add Medicine</h2>
        <p className="admin-section-desc">Add a new medicine to the catalog.</p>
        {addSuccess && <p className="admin-success">{addSuccess}</p>}
        {addError && <p className="admin-error">{addError}</p>}
        <form onSubmit={handleAddMedicine} className="admin-form">
          <div className="admin-form-row">
            <label>Name *</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          </div>
          <div className="admin-form-row">
            <label>Category</label>
            <input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="e.g. Pain Relief" />
          </div>
          <div className="admin-form-row admin-form-row-inline">
            <div>
              <label>Price *</label>
              <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required />
            </div>
            <div>
              <label>Stock *</label>
              <input type="number" min="0" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} required />
            </div>
          </div>
          <div className="admin-form-row">
            <label>Dosage</label>
            <input value={form.dosage} onChange={(e) => setForm((f) => ({ ...f, dosage: e.target.value }))} placeholder="e.g. 500mg" />
          </div>
          <div className="admin-form-row">
            <label>Packaging</label>
            <input value={form.packaging} onChange={(e) => setForm((f) => ({ ...f, packaging: e.target.value }))} placeholder="e.g. Strip of 10" />
          </div>
          <div className="admin-form-row">
            <label className="admin-check-label">
              <input type="checkbox" checked={form.requiresPrescription} onChange={(e) => setForm((f) => ({ ...f, requiresPrescription: e.target.checked }))} />
              Requires prescription
            </label>
          </div>
          <button type="submit" className="admin-submit" disabled={adding}>{adding ? 'Adding…' : 'Add medicine'}</button>
        </form>
      </section>
    </div>
  );
}

export default Admin;
