import { useState, useEffect, useMemo } from 'react';
import { store } from '../../lib/adminStore';

export default function BestDealsPage() {
  const [laptops, setLaptops] = useState([]);
  const [flashSales, setFlashSales] = useState([]);
  const [toast, setToast] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newSale, setNewSale] = useState({
    name: '',
    discount: '',
    startDate: '',
    endDate: '',
    productIds: '',
  });

  useEffect(() => {
    setLaptops(store.getLaptops());
    setFlashSales(store.getFlashSales());
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleSale = (laptop) => {
    const updated = { ...laptop, onSale: !laptop.onSale };
    store.saveLaptop(updated);
    setLaptops((prev) =>
      prev.map((l) => (l.id === laptop.id ? updated : l))
    );
    showToast(
      (updated.onSale ? 'Enabled' : 'Disabled') +
        ' sale for ' + laptop.brand + ' ' + laptop.model
    );
  };

  const updateDiscount = (laptop, value) => {
    const pct = Math.min(100, Math.max(0, Number(value) || 0));
    const updated = { ...laptop, discountPercent: pct };
    store.saveLaptop(updated);
    setLaptops((prev) =>
      prev.map((l) => (l.id === laptop.id ? updated : l))
    );
  };

  const handleAddFlashSale = (e) => {
    e.preventDefault();
    if (!newSale.name.trim()) {
      showToast('Flash sale name is required', 'error');
      return;
    }
    const sale = {
      id: Date.now(),
      name: newSale.name.trim(),
      discount: Number(newSale.discount) || 0,
      startDate: newSale.startDate,
      endDate: newSale.endDate,
      productIds: newSale.productIds
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map(Number),
      active: true,
      createdAt: new Date().toISOString(),
    };
    store.saveFlashSale(sale);
    setFlashSales(store.getFlashSales());
    setNewSale({ name: '', discount: '', startDate: '', endDate: '', productIds: '' });
    setShowForm(false);
    showToast('Flash sale "' + sale.name + '" added');
  };

  const toggleFlashActive = (sale) => {
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

  const deleteFlashSale = (id) => {
    if (!window.confirm('Delete this flash sale?')) return;
    store.deleteFlashSale(id);
    setFlashSales((prev) => prev.filter((f) => f.id !== id));
    showToast('Flash sale deleted');
  };

  const laptopOptions = useMemo(() => {
    return laptops.map((l) => ({
      id: l.id,
      label: l.brand + ' ' + l.model + ' (KSh ' + l.price.toLocaleString() + ')',
    }));
  }, [laptops]);

  return (
    <div>
      {toast && (
        <div className={'admin-toast ' + (toast.type === 'error' ? 'admin-toast-error' : 'admin-toast-success')}>
          {toast.msg}
        </div>
      )}

      <div className="admin-page-header">
        <h1 className="admin-page-title">Best Deals & Flash Sales</h1>
      </div>

      {/* Best Deals Section */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Best Deals (Per-Product Sale Toggle)</h2>
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>On Sale</th>
                <th>Discount %</th>
              </tr>
            </thead>
            <tbody>
              {laptops.map((laptop) => (
                <tr key={laptop.id}>
                  <td className="admin-cell-title">
                    {laptop.brand} {laptop.model}
                  </td>
                  <td>KSh {laptop.price.toLocaleString()}</td>
                  <td>
                    <button
                      type="button"
                      className={'admin-toggle' + (laptop.onSale ? ' active' : '')}
                      onClick={() => toggleSale(laptop)}
                    >
                      <span className="admin-toggle-knob" />
                    </button>
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="admin-form-input"
                      style={{ width: 80 }}
                      value={laptop.discountPercent || 0}
                      onChange={(e) => updateDiscount(laptop, e.target.value)}
                      disabled={!laptop.onSale}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Flash Sales Section */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Flash Sales</h2>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Add New Flash Sale'}
          </button>
        </div>

        {showForm && (
          <div className="admin-card" style={{ background: '#f8f9fa', marginBottom: 20 }}>
            <form onSubmit={handleAddFlashSale}>
              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-form-label">Sale Name</label>
                  <input
                    className="admin-form-input"
                    value={newSale.name}
                    onChange={(e) =>
                      setNewSale((p) => ({ ...p, name: e.target.value }))
                    }
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
                    value={newSale.discount}
                    onChange={(e) =>
                      setNewSale((p) => ({ ...p, discount: e.target.value }))
                    }
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Start Date</label>
                  <input
                    className="admin-form-input"
                    type="date"
                    value={newSale.startDate}
                    onChange={(e) =>
                      setNewSale((p) => ({ ...p, startDate: e.target.value }))
                    }
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">End Date</label>
                  <input
                    className="admin-form-input"
                    type="date"
                    value={newSale.endDate}
                    onChange={(e) =>
                      setNewSale((p) => ({ ...p, endDate: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">
                  Product IDs (comma-separated)
                </label>
                <p style={{ fontSize: 12, color: 'var(--color-text-light)', marginBottom: 6 }}>
                  Available: {laptopOptions.map((o) => o.id + ' (' + o.label.split(' (')[0] + ')').join(', ')}
                </p>
                <input
                  className="admin-form-input"
                  value={newSale.productIds}
                  onChange={(e) =>
                    setNewSale((p) => ({ ...p, productIds: e.target.value }))
                  }
                  placeholder="e.g. 1, 3, 5"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Add Flash Sale
              </button>
            </form>
          </div>
        )}

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
                  <td colSpan={7} style={{ textAlign: 'center', padding: 32, color: 'var(--color-text-light)' }}>
                    No flash sales yet. Click "Add New Flash Sale" to create one.
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
                        onClick={() => toggleFlashActive(sale)}
                      >
                        {sale.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        className="btn btn-outline btn-sm admin-btn-danger"
                        onClick={() => deleteFlashSale(sale.id)}
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
