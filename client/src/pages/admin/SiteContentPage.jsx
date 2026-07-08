import { useState, useEffect, useCallback } from 'react';
import { store } from '../../lib/adminStore';
import * as api from '../../lib/api';
import Modal from '../../components/ui/Modal';

function PhoneFrame({ children, label }) {
  return (
    <div style={{
      width: '100%', maxWidth: 320, margin: '0 auto',
      border: '3px solid #222', borderRadius: 24,
      overflow: 'hidden', background: '#fff',
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    }}>
      <div style={{ height: 28, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 10, color: '#999' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#e74c3c' }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f1c40f' }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2ecc71' }} />
      </div>
      <div style={{ maxHeight: 460, overflowY: 'auto' }}>
        {children}
      </div>
      <div style={{ height: 24, background: '#f5f5f5' }} />
    </div>
  );
}

function FullSitePreview({ shop, sections, editing, form }) {
  const tagline = (editing === 'hero' && form?.tagline) || shop?.tagline || '';
  const subtitle = (editing === 'hero' && form?.subtitle) || shop?.subtitle || '';
  const phone = (editing === 'contact' && form?.phone) || shop?.phone || '';
  const email = (editing === 'contact' && form?.email) || shop?.email || '';
  const address = (editing === 'contact' && form?.address) || shop?.address || '';
  const wa = (editing === 'contact' && form?.whatsapp) || shop?.whatsapp || '';
  const monSat = (editing === 'hours' && form?.['Mon-Sat']) || shop?.hours?.['Mon-Sat'] || '';
  const sun = (editing === 'hours' && form?.['Sun']) || shop?.hours?.['Sun'] || '';

  return (
    <PhoneFrame>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))', padding: '24px 16px', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4, lineHeight: 1.2 }}>{tagline}</h1>
        <p style={{ fontSize: 10, opacity: 0.85 }}>{subtitle}</p>
      </div>

      {/* Section titles */}
      {sections.filter(s => s.isActive && s.sectionType !== 'hero' && s.sectionType !== 'carousel' && s.sectionType !== 'location').slice(0, 4).map(s => (
        <div key={s.id} style={{ padding: '14px 16px', borderBottom: '1px solid #eee' }}>
          {s.title && <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', marginBottom: 2 }}>{s.title}</div>}
          {s.subtitle && <div style={{ fontSize: 10, color: '#4a5568' }}>{s.subtitle}</div>}
        </div>
      ))}

      {/* Footer contact strip */}
      <div style={{ padding: '12px 16px', background: '#f5f7fa', fontSize: 10, color: '#4a5568', textAlign: 'center' }}>
        <div>{address}</div>
        <div>{phone} | {email}</div>
        <div style={{ marginTop: 4 }}>Mon-Sat: {monSat} | Sun: {sun}</div>
      </div>
    </PhoneFrame>
  );
}

export default function SiteContentPage() {
  const [shop, setShop] = useState(null);
  const [sections, setSections] = useState([]);
  const [toast, setToast] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    store.getShop().then(data => setShop(data));
    api.getSections().then(d => setSections(d.sections)).catch(() => {});
  }, []);

  const refreshShop = () => store.getShop().then(setShop);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const updateField = useCallback((field, value) => setForm(prev => ({ ...prev, [field]: value })), []);

  const openEdit = (section) => {
    setEditing(section);
    if (section === 'hero') setForm({ tagline: shop.tagline || '', subtitle: shop.subtitle || '' });
    else if (section === 'contact') setForm({ phone: shop.phone || '', email: shop.email || '', whatsapp: shop.whatsapp || '', address: shop.address || '' });
    else if (section === 'hours') setForm({ 'Mon-Sat': (shop.hours && shop.hours['Mon-Sat']) || '', 'Sun': (shop.hours && shop.hours['Sun']) || '' });
  };

  const handleSave = async () => {
    if (editing === 'hero') {
      await store.saveShopField('tagline', form.tagline);
      await store.saveShopField('subtitle', form.subtitle);
      showToast('Hero content saved');
    } else if (editing === 'contact') {
      await store.saveShopField('phone', form.phone);
      await store.saveShopField('email', form.email);
      await store.saveShopField('whatsapp', form.whatsapp);
      await store.saveShopField('address', form.address);
      showToast('Contact info saved');
    } else if (editing === 'hours') {
      await store.saveShopField('hours_Mon-Sat', form['Mon-Sat']);
      await store.saveShopField('hours_Sun', form['Sun']);
      showToast('Hours saved');
    }
    await refreshShop();
    setEditing(null);
  };

  if (!shop) return null;

  return (
    <div>
      {toast && <div className="admin-toast admin-toast-success">{toast}</div>}
      <div className="admin-page-header">
        <h1 className="admin-page-title">Site Content</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-lg)', alignItems: 'start' }}>
        <div>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
            Edit your site content. Changes save locally and update the site immediately.
          </p>

          {/* Hero Card */}
          <div className="admin-card" style={{ marginBottom: 'var(--space-md)' }}>
            <div className="admin-card-header">
              <h2 className="admin-card-title">Hero Banner</h2>
              <button className="btn btn-outline btn-sm" onClick={() => openEdit('hero')}>Edit</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', padding: 'var(--space-md)' }}>
              <div><strong style={{ fontSize: 'var(--font-size-sm)' }}>Tagline</strong><p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{shop.tagline}</p></div>
              <div><strong style={{ fontSize: 'var(--font-size-sm)' }}>Subtitle</strong><p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{shop.subtitle}</p></div>
            </div>
            <div style={{ padding: '0 var(--space-md) var(--space-md)' }}>
              <div style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))', borderRadius: 8, padding: '14px 16px', textAlign: 'center', color: 'white' }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{shop.tagline}</div>
                <div style={{ fontSize: 10, opacity: 0.85 }}>{shop.subtitle}</div>
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="admin-card" style={{ marginBottom: 'var(--space-md)' }}>
            <div className="admin-card-header">
              <h2 className="admin-card-title">Contact Details</h2>
              <button className="btn btn-outline btn-sm" onClick={() => openEdit('contact')}>Edit</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', padding: 'var(--space-md)' }}>
              <div><strong style={{ fontSize: 'var(--font-size-sm)' }}>Phone</strong><p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{shop.phone}</p></div>
              <div><strong style={{ fontSize: 'var(--font-size-sm)' }}>Email</strong><p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{shop.email}</p></div>
              <div><strong style={{ fontSize: 'var(--font-size-sm)' }}>WhatsApp</strong><p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{shop.whatsapp}</p></div>
              <div><strong style={{ fontSize: 'var(--font-size-sm)' }}>Address</strong><p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{shop.address}</p></div>
            </div>
            <div style={{ padding: '0 var(--space-md) var(--space-md)', fontSize: 10, color: 'var(--color-text-secondary)' }}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <span>📞 {shop.phone}</span>
                <span>✉️ {shop.email}</span>
                <span>📍 {shop.address}</span>
              </div>
            </div>
          </div>

          {/* Hours Card */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">Shop Hours</h2>
              <button className="btn btn-outline btn-sm" onClick={() => openEdit('hours')}>Edit</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', padding: 'var(--space-md)' }}>
              <div><strong style={{ fontSize: 'var(--font-size-sm)' }}>Mon-Sat</strong><p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{shop.hours?.['Mon-Sat']}</p></div>
              <div><strong style={{ fontSize: 'var(--font-size-sm)' }}>Sunday</strong><p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{shop.hours?.['Sun']}</p></div>
            </div>
          </div>
        </div>

        {/* Full live preview */}
        <div style={{ position: 'sticky', top: 'calc(var(--header-height) + var(--space-lg))' }}>
          <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--color-text-light)', marginBottom: 'var(--space-md)', textAlign: 'center' }}>
            Full Mobile Preview
          </div>
          <FullSitePreview shop={shop} sections={sections} editing={editing} form={form} />
        </div>
      </div>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} wide>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 'var(--space-lg)', alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-md)', textTransform: 'capitalize' }}>Edit {editing}</h2>

            {editing === 'hero' && (
              <>
                <div className="admin-form-group" style={{ marginBottom: 'var(--space-sm)' }}><label className="admin-form-label">Tagline</label><input className="admin-form-input" value={form.tagline || ''} onChange={e => updateField('tagline', e.target.value)} /></div>
                <div className="admin-form-group" style={{ marginBottom: 'var(--space-sm)' }}><label className="admin-form-label">Subtitle</label><input className="admin-form-input" value={form.subtitle || ''} onChange={e => updateField('subtitle', e.target.value)} /></div>
              </>
            )}
            {editing === 'contact' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
                <div className="admin-form-group"><label className="admin-form-label">Phone</label><input className="admin-form-input" value={form.phone || ''} onChange={e => updateField('phone', e.target.value)} /></div>
                <div className="admin-form-group"><label className="admin-form-label">WhatsApp</label><input className="admin-form-input" value={form.whatsapp || ''} onChange={e => updateField('whatsapp', e.target.value)} /></div>
                <div className="admin-form-group"><label className="admin-form-label">Email</label><input className="admin-form-input" value={form.email || ''} onChange={e => updateField('email', e.target.value)} /></div>
                <div className="admin-form-group"><label className="admin-form-label">Address</label><input className="admin-form-input" value={form.address || ''} onChange={e => updateField('address', e.target.value)} /></div>
              </div>
            )}
            {editing === 'hours' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
                <div className="admin-form-group"><label className="admin-form-label">Mon-Sat</label><input className="admin-form-input" value={form['Mon-Sat'] || ''} onChange={e => updateField('Mon-Sat', e.target.value)} placeholder="9:00 AM - 7:00 PM" /></div>
                <div className="admin-form-group"><label className="admin-form-label">Sunday</label><input className="admin-form-input" value={form['Sun'] || ''} onChange={e => updateField('Sun', e.target.value)} placeholder="Closed" /></div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
              <button className="btn btn-primary" onClick={handleSave}>Save</button>
              <button className="btn btn-outline" onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--color-text-light)', marginBottom: 'var(--space-sm)', textAlign: 'center' }}>Live Preview</div>
            {editing === 'hero' && (
              <PhoneFrame>
                <div style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))', padding: '32px 20px', textAlign: 'center', color: 'white' }}>
                  <h1 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6, lineHeight: 1.2 }}>{form.tagline || 'Your tagline'}</h1>
                  <p style={{ fontSize: 11, opacity: 0.85 }}>{form.subtitle || 'Your subtitle'}</p>
                </div>
              </PhoneFrame>
            )}
            {editing === 'contact' && (
              <PhoneFrame>
                <div style={{ padding: '24px 20px' }}>
                  <div style={{ marginBottom: 12 }}><span style={{ fontSize: 10, color: '#999' }}>Phone</span><p style={{ fontSize: 13, fontWeight: 600 }}>{form.phone || shop?.phone}</p></div>
                  <div style={{ marginBottom: 12 }}><span style={{ fontSize: 10, color: '#999' }}>WhatsApp</span><p style={{ fontSize: 13, fontWeight: 600 }}>{form.whatsapp || shop?.whatsapp}</p></div>
                  <div style={{ marginBottom: 12 }}><span style={{ fontSize: 10, color: '#999' }}>Email</span><p style={{ fontSize: 13, fontWeight: 600 }}>{form.email || shop?.email}</p></div>
                  <div><span style={{ fontSize: 10, color: '#999' }}>Address</span><p style={{ fontSize: 13, fontWeight: 600 }}>{form.address || shop?.address}</p></div>
                </div>
              </PhoneFrame>
            )}
            {editing === 'hours' && (
              <PhoneFrame>
                <div style={{ padding: '24px 20px' }}>
                  <div style={{ marginBottom: 12 }}><span style={{ fontSize: 10, color: '#999' }}>Mon-Sat</span><p style={{ fontSize: 13, fontWeight: 600 }}>{form['Mon-Sat'] || shop?.hours?.['Mon-Sat']}</p></div>
                  <div><span style={{ fontSize: 10, color: '#999' }}>Sunday</span><p style={{ fontSize: 13, fontWeight: 600 }}>{form['Sun'] || shop?.hours?.['Sun']}</p></div>
                </div>
              </PhoneFrame>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
