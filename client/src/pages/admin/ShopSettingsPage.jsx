import { useState, useEffect } from 'react';
import { store } from '../../lib/adminStore';

const socialFields = [
  { key: 'facebook', label: 'Facebook URL' },
  { key: 'twitter', label: 'Twitter URL' },
  { key: 'instagram', label: 'Instagram URL' },
];

export default function ShopSettingsPage() {
  const [shop, setShop] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setShop(store.getShop());
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const update = (key, value) => {
    setShop((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const updateSocial = (key, value) => {
    setShop((prev) => {
      if (!prev) return prev;
      const social = prev.social ? { ...prev.social } : {};
      social[key] = value;
      return { ...prev, social };
    });
  };

  const handleSave = () => {
    store.saveShop(shop);
    showToast('Shop settings saved successfully');
  };

  if (!shop) return null;

  return (
    <div>
      {toast && (
        <div className="admin-toast admin-toast-success">{toast}</div>
      )}

      <div className="admin-page-header">
        <h1 className="admin-page-title">Shop Settings</h1>
        <button className="btn btn-primary" onClick={handleSave}>
          Save All Settings
        </button>
      </div>

      {/* Contact Details */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Contact Details</h2>
        </div>
        <div className="admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-form-label">Phone Number</label>
            <input
              className="admin-form-input"
              value={shop.phone || ''}
              onChange={(e) => update('phone', e.target.value)}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">WhatsApp Number</label>
            <input
              className="admin-form-input"
              value={shop.whatsapp || ''}
              onChange={(e) => update('whatsapp', e.target.value)}
            />
          </div>
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Email</label>
          <input
            className="admin-form-input"
            value={shop.email || ''}
            onChange={(e) => update('email', e.target.value)}
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Address</label>
          <input
            className="admin-form-input"
            value={shop.address || ''}
            onChange={(e) => update('address', e.target.value)}
          />
        </div>
      </div>

      {/* Social Media */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Social Media Links</h2>
        </div>
        <div className="admin-grid-2">
          {socialFields.map((f) => (
            <div className="admin-form-group" key={f.key}>
              <label className="admin-form-label">{f.label}</label>
              <input
                className="admin-form-input"
                value={(shop.social && shop.social[f.key]) || ''}
                onChange={(e) => updateSocial(f.key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
