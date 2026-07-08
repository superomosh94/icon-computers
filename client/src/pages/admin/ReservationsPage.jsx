import { useState, useEffect } from 'react';
import * as api from '../../lib/api';
import { store } from '../../lib/adminStore';

const statusBadge = (status) => {
  const map = {
    Pending: 'admin-badge-yellow',
    'Picked Up': 'admin-badge-green',
    Expired: 'admin-badge-red',
  };
  return 'admin-badge ' + (map[status] || 'admin-badge-gray');
};

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    store.getReservations().then(setReservations);
  }, []);

  const activeCount = reservations.filter(r => r.status === 'Pending').length;

  const markAs = async (id, status) => {
    try {
      await api.updateReservation(id, { status });
    } catch { /* fallback handled by store */ }
    setReservations(prev =>
      prev.map(r => r.id === id ? { ...r, status } : r)
    );
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Reservations</h1>
        <div className="admin-active-badge">
          {activeCount} active today
        </div>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Laptop</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(r => (
              <tr key={r.id}>
                <td className="admin-cell-title">{r.customerName}</td>
                <td>{r.customerPhone}</td>
                <td className="admin-cell-date">{r.customerEmail || '-'}</td>
                <td>{r.laptopName}</td>
                <td className="admin-cell-date">
                  {new Date(r.createdAt).toLocaleString()}
                </td>
                <td>
                  <span className={statusBadge(r.status)}>{r.status}</span>
                </td>
                <td>
                  {r.status === 'Pending' && (
                    <div className="admin-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => markAs(r.id, 'Picked Up')}>
                        Mark as Picked Up
                      </button>
                      <button
                        className="btn btn-outline btn-sm admin-btn-danger"
                        onClick={() => markAs(r.id, 'Expired')}
                      >
                        Mark as Expired
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
