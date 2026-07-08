import { useState, useEffect, useCallback } from 'react';
import * as api from '../../lib/api';

const TYPE_LABELS = {
  hero: 'Hero Banner',
  carousel: 'Laptop Carousel',
  'flash-deals': 'Flash Deals Section',
  showcase: 'Browse All Showcase',
  deals: 'Best Value Picks Section',
  'top-picks': 'Top Picks Section',
  'new-arrivals': 'New Stock Alert Section',
  'top-rated': 'Top Rated Section',
  brands: 'Browse by Brand Section',
  benefits: 'Why Shop With ICON',
  location: 'Visit Our Shop Section',
  banner: 'Custom Banner (with CTA)',
  text: 'Rich Text Section',
};

export default function SectionsPage() {
  const [sections, setSections] = useState([]);
  const [toast, setToast] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    sectionType: 'banner', title: '', subtitle: '', content: '',
    linkUrl: '', linkText: '', isActive: true, sortOrder: 0,
  });

  useEffect(() => {
    api.getSections({ all: 'true' }).then(d => setSections(d.sections)).catch(() => {});
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const updateField = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = () => {
    setEditing(null);
    setForm({ sectionType: 'banner', title: '', subtitle: '', content: '', linkUrl: '', linkText: '', isActive: true, sortOrder: 0 });
  };

  const handleEdit = (s) => {
    setEditing(s.id);
    setForm({
      sectionType: s.sectionType, title: s.title, subtitle: s.subtitle,
      content: s.content, linkUrl: s.linkUrl, linkText: s.linkText,
      isActive: s.isActive, sortOrder: s.sortOrder,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.updateSection(editing, form);
        showToast('Section updated');
      } else {
        await api.createSection(form);
        showToast('Section created');
      }
      resetForm();
      const d = await api.getSections({ all: 'true' });
      setSections(d.sections);
    } catch { showToast('Failed to save'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this section?')) return;
    try {
      await api.deleteSection(id);
      setSections(prev => prev.filter(s => s.id !== id));
      showToast('Section deleted');
    } catch { showToast('Failed to delete'); }
  };

  const handleToggle = async (s) => {
    try {
      await api.updateSection(s.id, { isActive: !s.isActive });
      setSections(prev => prev.map(x => x.id === s.id ? { ...x, isActive: !x.isActive } : x));
    } catch {}
  };

  const builtInTypes = ['hero', 'carousel', 'flash-deals', 'showcase', 'deals', 'top-picks', 'new-arrivals', 'top-rated', 'brands', 'benefits', 'location'];
  const isBuiltIn = builtInTypes.includes(form.sectionType);

  return (
    <div>
      {toast && <div className="admin-toast admin-toast-success">{toast}</div>}
      <div className="admin-page-header">
        <h1 className="admin-page-title">Landing Page Sections</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          {editing !== 'new' && <button className="btn btn-primary btn-sm" onClick={() => setEditing('new')}>Add Custom Section</button>}
        </div>
      </div>
      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
        Edit the title, subtitle, and visibility of every section on the landing page. Add custom banner or text sections.
      </p>

      {(editing === 'new' || editing > 0) && (
        <div className="admin-card" style={{ marginBottom: 20 }}>
          <div className="admin-card-header">
            <h2 className="admin-card-title">
              {editing === 'new' ? 'Add Custom Section' : `Edit: ${TYPE_LABELS[form.sectionType] || form.sectionType}`}
            </h2>
            <button className="btn btn-outline btn-sm" onClick={resetForm}>Cancel</button>
          </div>
          <form onSubmit={handleSave}>
            <div className="admin-grid-2">
              {editing === 'new' && (
                <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="admin-form-label">Section Type</label>
                  <select className="admin-form-input" value={form.sectionType} onChange={e => updateField('sectionType', e.target.value)}>
                    <option value="banner">Custom Banner (with CTA button)</option>
                    <option value="text">Rich Text Section</option>
                  </select>
                </div>
              )}
              {isBuiltIn && <input type="hidden" />}
              <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="admin-form-label">Title</label>
                <input className="admin-form-input" value={form.title} onChange={e => updateField('title', e.target.value)} placeholder="Section heading" />
              </div>
              <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="admin-form-label">Subtitle</label>
                <input className="admin-form-input" value={form.subtitle} onChange={e => updateField('subtitle', e.target.value)} placeholder="Short description below title" />
              </div>
              {!isBuiltIn && (
                <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="admin-form-label">Content</label>
                  <textarea className="admin-form-textarea" value={form.content} onChange={e => updateField('content', e.target.value)} rows={3} placeholder="Body text" />
                </div>
              )}
              {form.sectionType === 'banner' && (
                <>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Button URL</label>
                    <input className="admin-form-input" value={form.linkUrl} onChange={e => updateField('linkUrl', e.target.value)} placeholder="https://..." />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Button Text</label>
                    <input className="admin-form-input" value={form.linkText} onChange={e => updateField('linkText', e.target.value)} placeholder="Learn More" />
                  </div>
                </>
              )}
              {!editing && (
                <div className="admin-form-group">
                  <label className="admin-form-label">Sort Order</label>
                  <input className="admin-form-input" type="number" value={form.sortOrder} onChange={e => updateField('sortOrder', Number(e.target.value))} />
                </div>
              )}
              <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="admin-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={form.isActive} onChange={e => updateField('isActive', e.target.checked)} />
                  Visible on landing page
                </label>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">{editing === 'new' ? 'Create Section' : 'Update Section'}</button>
          </form>
        </div>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Type</th>
              <th>Title</th>
              <th>Visible</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((s, idx) => (
              <tr key={s.id}>
                <td style={{ color: 'var(--color-text-light)', fontSize: 'var(--font-size-sm)' }}>{idx + 1}</td>
                <td><span className="admin-badge" style={{ background: builtInTypes.includes(s.sectionType) ? 'var(--color-excellent-bg)' : 'var(--color-accent-light)', color: builtInTypes.includes(s.sectionType) ? 'var(--color-excellent)' : 'var(--color-accent)' }}>{TYPE_LABELS[s.sectionType] || s.sectionType}</span></td>
                <td className="admin-cell-title">{s.title || '(no title)'}</td>
                <td>
                  <button className={'admin-toggle' + (s.isActive ? ' active' : '')} onClick={() => handleToggle(s)}>
                    <span className="admin-toggle-knob" />
                  </button>
                </td>
                <td>
                  <div className="admin-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => handleEdit(s)}>Edit</button>
                    {!builtInTypes.includes(s.sectionType) && (
                      <button className="btn btn-outline btn-sm admin-btn-danger" onClick={() => handleDelete(s.id)}>Delete</button>
                    )}
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
