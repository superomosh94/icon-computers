import { useState, useEffect } from 'react';
import { store } from '../../lib/adminStore';

export default function BestDealsPage() {
  const [laptops, setLaptops] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    store.getLaptops().then(setLaptops).catch(() => setLaptops([]));
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const toggleSale = async (laptop) => {
    const updated = { ...laptop, onSale: !laptop.onSale };
    await store.saveLaptop(updated);
    setLaptops((prev) =>
      prev.map((l) => (l.id === laptop.id ? updated : l))
    );
    showToast((updated.onSale ? 'Enabled' : 'Disabled') + ' sale for ' + laptop.brand + ' ' + laptop.model);
  };

  const updateDiscount = async (laptop, value) => {
    const pct = Math.min(100, Math.max(0, Number(value) || 0));
    const updated = { ...laptop, discountPercent: pct };
    await store.saveLaptop(updated);
    setLaptops((prev) =>
      prev.map((l) => (l.id === laptop.id ? updated : l))
    );
  };

  return (
    <div>
      {toast && <div className="admin-toast admin-toast-success">{toast}</div>}

      <div className="admin-page-header">
        <h1 className="admin-page-title">Best Deals</h1>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Per-Product Sale Toggle</h2>
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
                  <td className="admin-cell-title">{laptop.brand} {laptop.model}</td>
                  <td>KSh {laptop.price?.toLocaleString()}</td>
                  <td>
                    <button type="button" className={'admin-toggle' + (laptop.onSale ? ' active' : '')} onClick={() => toggleSale(laptop)}>
                      <span className="admin-toggle-knob" />
                    </button>
                  </td>
                  <td>
                    <input type="number" min="0" max="100" className="admin-form-input" style={{ width: 80 }} value={laptop.discountPercent || 0} onChange={(e) => updateDiscount(laptop, e.target.value)} disabled={!laptop.onSale} />
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
