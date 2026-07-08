import { useState, useEffect } from 'react';
import { store } from '../../lib/adminStore';

export default function ShopSettingsPage() {
  const [shop, setShop] = useState(null);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { store.getShop().then(setShop); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const update = (key, value) => setShop(prev => prev ? { ...prev, [key]: value } : prev);
  const updateNested = (parent, key, value) => setShop(prev => {
    if (!prev) return prev;
    const nested = prev[parent] ? { ...prev[parent] } : {};
    nested[key] = value;
    return { ...prev, [parent]: nested };
  });

  const handleSave = async () => {
    if (!shop) return;
    setSaving(true);
    try {
      await store.saveShopFull(shop);
      showToast('Shop settings saved');
    } catch { showToast('Failed to save'); }
    setSaving(false);
  };

  if (!shop) return null;

  return (
    <div>
      {toast && <div className="admin-toast admin-toast-success">{toast}</div>}
      <div className="admin-page-header">
        <h1 className="admin-page-title">Shop Settings</h1>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Contact Details</h2>
        </div>
        <div className="admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-form-label">Phone Number</label>
            <input className="admin-form-input" value={shop.phone || ''} onChange={e => update('phone', e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">WhatsApp Number</label>
            <input className="admin-form-input" value={shop.whatsapp || ''} onChange={e => update('whatsapp', e.target.value)} />
          </div>
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Email</label>
          <input className="admin-form-input" value={shop.email || ''} onChange={e => update('email', e.target.value)} />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Address</label>
          <input className="admin-form-input" value={shop.address || ''} onChange={e => update('address', e.target.value)} />
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Shop Hours</h2>
        </div>
        <div className="admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-form-label">Mon-Sat</label>
            <input className="admin-form-input" value={(shop.hours && shop.hours['Mon-Sat']) || ''} onChange={e => updateNested('hours', 'Mon-Sat', e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Sunday</label>
            <input className="admin-form-input" value={(shop.hours && shop.hours['Sun']) || ''} onChange={e => updateNested('hours', 'Sun', e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
}
