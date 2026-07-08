import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { store } from '../../lib/adminStore';

const statusBadge = (status) => {
  const map = { Available: 'admin-badge-green', Reserved: 'admin-badge-yellow', Sold: 'admin-badge-gray', Pending: 'admin-badge-yellow' };
  return 'admin-badge ' + (map[status] || 'admin-badge-gray');
};

const gradeBadge = (grade) => {
  const map = { Mint: 'admin-badge-green', Excellent: 'admin-badge-green', Good: 'admin-badge-yellow', Fair: 'admin-badge-red' };
  return 'admin-badge ' + (map[grade] || 'admin-badge-gray');
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterSale, setFilterSale] = useState('');
  const [toast, setToast] = useState(null);

  const loadProducts = () => {
    store.getProducts().then(setProducts);
  };

  useEffect(() => { loadProducts(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleDelete = async (id, name) => {
    if (!window.confirm('Delete "' + name + '" permanently?')) return;
    await store.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('"' + name + '" deleted');
  };

  const handleDuplicate = async (laptop) => {
    const clone = { ...laptop, id: null, model: laptop.model + ' (Copy)', slug: laptop.slug + '-copy-' + Date.now(), createdAt: new Date().toISOString() };
    await store.saveLaptop(clone);
    loadProducts();
    showToast('Duplicated as "' + clone.brand + ' ' + clone.model + '"');
  };

  const handleToggleSale = async (laptop) => {
    const updated = { ...laptop, onSale: !laptop.onSale };
    if (updated.onSale && !updated.discountPercent) updated.discountPercent = 10;
    await store.saveLaptop(updated);
    setProducts((prev) => prev.map((p) => (p.id === laptop.id ? updated : p)));
    showToast(updated.onSale ? 'Sale activated' : 'Sale removed');
  };

  const brands = [...new Set(products.map(p => p.brand))].sort();
  const statuses = [...new Set(products.map(p => p.status))].sort();
  const grades = [...new Set(products.map(p => p.grade))].sort();

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        if (!p.brand?.toLowerCase().includes(q) && !p.model?.toLowerCase().includes(q) && !p.cpuFull?.toLowerCase().includes(q) && !String(p.id).includes(q)) return false;
      }
      if (filterBrand && p.brand !== filterBrand) return false;
      if (filterStatus && p.status !== filterStatus) return false;
      if (filterGrade && p.grade !== filterGrade) return false;
      if (filterSale === 'sale' && !p.onSale) return false;
      if (filterSale === 'no-sale' && p.onSale) return false;
      return true;
    });
  }, [products, search, filterBrand, filterStatus, filterGrade, filterSale]);

  const stockColor = (stock) => {
    if (stock <= 0) return '#e74c3c';
    if (stock <= 3) return '#f39c12';
    return '#27ae60';
  };

  const total = products.length;
  const availableCount = products.filter(p => p.status === 'Available').length;
  const onSaleCount = products.filter(p => p.onSale).length;
  const soldCount = products.filter(p => p.status === 'Sold').length;

  return (
    <div>
      {toast && <div className="admin-toast admin-toast-success">{toast}</div>}

      <div className="admin-page-header">
        <h1 className="admin-page-title">Products</h1>
        <Link to="/admin/add" className="btn btn-primary">Add New Product</Link>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}><strong style={{ color: 'var(--color-text)' }}>{total}</strong> total</span>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}><strong style={{ color: '#27ae60' }}>{availableCount}</strong> available</span>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}><strong style={{ color: '#e74c3c' }}>{onSaleCount}</strong> on sale</span>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}><strong style={{ color: 'var(--color-text-light)' }}>{soldCount}</strong> sold</span>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}><strong style={{ color: 'var(--color-text)' }}>{filtered.length}</strong> shown</span>
      </div>

      <div className="admin-table-controls">
        <input className="admin-search-input" type="text" placeholder="Search by brand, model, CPU or ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="admin-filter-select" value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)}>
          <option value="">All Brands</option>
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select className="admin-filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="admin-filter-select" value={filterGrade} onChange={(e) => setFilterGrade(e.target.value)}>
          <option value="">All Grades</option>
          {grades.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <select className="admin-filter-select" value={filterSale} onChange={(e) => setFilterSale(e.target.value)}>
          <option value="">All Sales</option>
          <option value="sale">On Sale</option>
          <option value="no-sale">Not on Sale</option>
        </select>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Title</th>
              <th>Price</th>
              <th>Sale</th>
              <th>Stock</th>
              <th>Grade</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={9}><div className="admin-empty"><p>{search ? 'No products match your filters.' : 'No products found.'}</p></div></td></tr>
            )}
            {filtered.map((laptop) => (
              <tr key={laptop.id}>
                <td><img src={laptop.images?.[0] || ''} alt="" className="admin-thumb" /></td>
                <td className="admin-cell-title">{laptop.brand} {laptop.model}</td>
                <td>KSh {laptop.price?.toLocaleString()}</td>
                <td>
                  {laptop.onSale && laptop.discountPercent > 0 ? (
                    <span className="admin-badge admin-badge-red">-{laptop.discountPercent}%</span>
                  ) : (
                    <span className="admin-badge admin-badge-gray">None</span>
                  )}
                </td>
                <td>
                  <span style={{ color: stockColor(laptop.stock ?? 0), fontWeight: 600, fontSize: '0.85rem' }}>
                    {laptop.stock ?? '--'}
                  </span>
                </td>
                <td><span className={gradeBadge(laptop.grade)}>{laptop.grade}</span></td>
                <td><span className={statusBadge(laptop.status)}>{laptop.status}</span></td>
                <td className="admin-cell-date">{laptop.createdAt ? new Date(laptop.createdAt).toLocaleDateString() : '--'}</td>
                <td>
                  <div className="admin-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => handleToggleSale(laptop)} title={laptop.onSale ? 'Remove from sale' : 'Put on sale'} style={{ color: laptop.onSale ? 'var(--color-green)' : 'var(--color-text-light)' }}>
                      {laptop.onSale ? 'On Sale' : 'Not on Sale'}
                    </button>
                    <Link to={'/admin/edit/' + laptop.id} className="btn btn-outline btn-sm">Edit</Link>
                    <button className="btn btn-outline btn-sm" onClick={() => handleDuplicate(laptop)}>Clone</button>
                    <button className="btn btn-outline btn-sm admin-btn-danger" onClick={() => handleDelete(laptop.id, laptop.brand + ' ' + laptop.model)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
