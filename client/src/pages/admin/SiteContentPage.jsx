import { useState, useEffect } from 'react';
import { store } from '../../lib/adminStore';

export default function SiteContentPage() {
  const [shop, setShop] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setShop(store.getShop());
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = (section) => {
    store.saveShop(shop);
    showToast(section + ' saved successfully');
  };

  const update = (key, value) => {
    setShop((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const updateNested = (parent, key, value) => {
    setShop((prev) => {
      if (!prev) return prev;
      const nested = prev[parent] ? { ...prev[parent] } : {};
      nested[key] = value;
      return { ...prev, [parent]: nested };
    });
  };

  if (!shop) return null;

  return (
    <div>
      {toast && (
        <div className="admin-toast admin-toast-success">{toast}</div>
      )}

      <div className="admin-page-header">
        <h1 className="admin-page-title">Site Content</h1>
      </div>

      {/* Hero Section */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Hero Section</h2>
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Tagline</label>
          <input
            className="admin-form-input"
            value={shop.tagline || ''}
            onChange={(e) => update('tagline', e.target.value)}
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Subtitle</label>
          <input
            className="admin-form-input"
            value={shop.subtitle || ''}
            onChange={(e) => update('subtitle', e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={() => handleSave('Hero section')}>
          Save
        </button>
      </div>

      {/* About Page */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">About Page</h2>
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">About Text</label>
          <textarea
            className="admin-form-textarea"
            value={shop.aboutText || ''}
            onChange={(e) => update('aboutText', e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={() => handleSave('About page')}>
          Save
        </button>
      </div>

      {/* Footer */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Footer</h2>
        </div>
        <div className="admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-form-label">Address</label>
            <input
              className="admin-form-input"
              value={shop.address || ''}
              onChange={(e) => update('address', e.target.value)}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Hours (Mon-Sat)</label>
            <input
              className="admin-form-input"
              value={(shop.hours && shop.hours['Mon-Sat']) || ''}
              onChange={(e) => updateNested('hours', 'Mon-Sat', e.target.value)}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Hours (Sunday)</label>
            <input
              className="admin-form-input"
              value={(shop.hours && shop.hours['Sun']) || ''}
              onChange={(e) => updateNested('hours', 'Sun', e.target.value)}
            />
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => handleSave('Footer')}>
          Save
        </button>
      </div>
    </div>
  );
}
