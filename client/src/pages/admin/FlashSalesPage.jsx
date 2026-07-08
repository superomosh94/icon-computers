import { useState, useEffect } from 'react';
import { store } from '../../lib/adminStore';

export default function FlashSalesPage() {
  const [flashSales, setFlashSales] = useState([]);
  const [toast, setToast] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    discount: '',
    startDate: '',
    endDate: '',
    productIds: '',
  });

  useEffect(() => {
    setFlashSales(store.getFlashSales());
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const resetForm = () => {
    setForm({ name: '', discount: '', startDate: '', endDate: '', productIds: '' });
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast('Sale name is required', 'error');
      return;
    }
    const sale = {
      id: Date.now(),
      name: form.name.trim(),
      discount: Number(form.discount) || 0,
      startDate: form.startDate,
      endDate: form.endDate,
      productIds: form.productIds
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map(Number),
      active: true,
      createdAt: new Date().toISOString(),
    };
    store.saveFlashSale(sale);
    setFlashSales(store.getFlashSales());
    resetForm();
    showToast('Flash sale "' + sale.name + '" created');
  };

  const toggleActive = (sale) => {
    const updated = { ...sale, active: !sale.active };
    store.saveFlashSale(updated);
    setFlashSales((prev) =>
      prev.map((f) => (f.id === sale.id ? updated : f))
    );
    showToast(
      (updated.active ? 'Activated' : 'Deactivated') +
        ' flash sale "' + sale.name + '"'
    );
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this flash sale permanently?')) return;
    store.deleteFlashSale(id);
    setFlashSales((prev) => prev.filter((f) => f.id !== id));
    showToast('Flash sale deleted');
  };

  return (
    <div>
      {toast && (
        <div className={'admin-toast ' + (toast.type === 'error' ? 'admin-toast-error' : 'admin-toast-success')}>
          {toast.msg}
        </div>
      )}

      <div className="admin-page-header">
        <h1 className="admin-page-title">Flash Sales</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Flash Sale'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">New Flash Sale</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-form-label">Sale Name</label>
                <input
                  className="admin-form-input"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Weekend Flash"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Discount %</label>
                <input
                  className="admin-form-input"
                  type="number"
                  min="0"
                  max="100"
                  value={form.discount}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, discount: e.target.value }))
                  }
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Start Date</label>
                <input
                  className="admin-form-input"
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, startDate: e.target.value }))
                  }
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">End Date</label>
                <input
                  className="admin-form-input"
                  type="date"
                  value={form.endDate}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, endDate: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Product IDs (comma-separated, leave empty for all)</label>
              <input
                className="admin-form-input"
                value={form.productIds}
                onChange={(e) =>
                  setForm((p) => ({ ...p, productIds: e.target.value }))
                }
                placeholder="e.g. 1, 3, 5"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Create Flash Sale
            </button>
          </form>
        </div>
      )}

      {/* Flash Sales Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">All Flash Sales</h2>
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Discount</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Products</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {flashSales.length === 0 && (
                <tr>
                  <td colSpan={7} className="admin-empty" style={{ border: 'none' }}>
                    <p>No flash sales yet.</p>
                  </td>
                </tr>
              )}
              {flashSales.map((sale) => (
                <tr key={sale.id}>
                  <td className="admin-cell-title">{sale.name}</td>
                  <td>{sale.discount}%</td>
                  <td className="admin-cell-date">
                    {sale.startDate
                      ? new Date(sale.startDate).toLocaleDateString()
                      : '--'}
                  </td>
                  <td className="admin-cell-date">
                    {sale.endDate
                      ? new Date(sale.endDate).toLocaleDateString()
                      : '--'}
                  </td>
                  <td>
                    {sale.productIds && sale.productIds.length > 0
                      ? sale.productIds.join(', ')
                      : 'All'}
                  </td>
                  <td>
                    <span className={'admin-badge ' + (sale.active ? 'admin-badge-green' : 'admin-badge-gray')}>
                      {sale.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => toggleActive(sale)}
                      >
                        {sale.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        className="btn btn-outline btn-sm admin-btn-danger"
                        onClick={() => handleDelete(sale.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
