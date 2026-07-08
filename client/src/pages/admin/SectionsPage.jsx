import { useState, useEffect, useCallback } from 'react';
import * as api from '../../lib/api';
import Modal from '../../components/ui/Modal';

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

const builtInTypes = ['hero', 'carousel', 'flash-deals', 'showcase', 'deals', 'top-picks', 'new-arrivals', 'top-rated', 'brands', 'benefits', 'location'];

function SectionPreview({ section }) {
  const style = {
    padding: 'var(--space-lg)',
    borderRadius: 'var(--radius-md)',
    textAlign: 'center',
    fontSize: '0.85rem',
    background: section.sectionType === 'hero' ? 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))' : 'var(--color-bg)',
    color: section.sectionType === 'hero' ? 'white' : 'var(--color-text)',
    minHeight: 100,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={style}>
      {section.title && <strong style={{ display: 'block', fontSize: '1rem', marginBottom: 4 }}>{section.title}</strong>}
      {section.subtitle && <span style={{ opacity: 0.8, fontSize: '0.8rem' }}>{section.subtitle}</span>}
      {section.content && <p style={{ opacity: 0.7, fontSize: '0.75rem', marginTop: 8, maxWidth: 400 }}>{section.content}</p>}
      {section.linkUrl && (
        <span style={{ display: 'inline-block', marginTop: 8, padding: '6px 16px', background: 'var(--color-accent)', color: 'white', borderRadius: 6, fontWeight: 700, fontSize: '0.75rem' }}>
          {section.linkText || 'Learn More'}
        </span>
      )}
      <span style={{ marginTop: 8, fontSize: '0.65rem', opacity: 0.4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {TYPE_LABELS[section.sectionType] || section.sectionType}
      </span>
    </div>
  );
}

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
  const updateField = useCallback((field, value) => setForm(prev => ({ ...prev, [field]: value })), []);

  const openEdit = (s) => {
    setEditing(s.id);
    setForm({
      sectionType: s.sectionType, title: s.title, subtitle: s.subtitle,
      content: s.content, linkUrl: s.linkUrl, linkText: s.linkText,
      isActive: s.isActive, sortOrder: s.sortOrder,
    });
  };

  const openNew = () => {
    setEditing('new');
    setForm({ sectionType: 'banner', title: '', subtitle: '', content: '', linkUrl: '', linkText: '', isActive: true, sortOrder: 0 });
  };

  const closeModal = () => setEditing(null);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editing && editing !== 'new') {
        await api.updateSection(editing, form);
        showToast('Section updated');
      } else {
        await api.createSection(form);
        showToast('Section created');
      }
      closeModal();
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

  const previewSection = editing ? {
    sectionType: form.sectionType,
    title: form.title,
    subtitle: form.subtitle,
    content: form.content,
    linkUrl: form.linkUrl,
    linkText: form.linkText,
    isActive: form.isActive,
  } : null;

  return (
    <div>
      {toast && <div className="admin-toast admin-toast-success">{toast}</div>}
      <div className="admin-page-header">
        <h1 className="admin-page-title">Landing Page Sections</h1>
        <button className="btn btn-primary btn-sm" onClick={openNew}>Add Section</button>
      </div>
      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
        Edit titles, subtitles, and visibility for every section. Add custom banners or text sections.
      </p>

      <Modal isOpen={!!editing} onClose={closeModal} wide>
        <div style={{ minWidth: 520, maxWidth: 640 }}>
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
            {editing === 'new' ? 'Add Custom Section' : `Edit: ${TYPE_LABELS[form.sectionType] || form.sectionType}`}
          </h2>

          {previewSection && (
            <div style={{ marginBottom: 'var(--space-lg)', border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <div style={{ padding: '4px 12px', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 0.5, background: 'var(--color-border)', color: 'var(--color-text-light)' }}>Live Preview</div>
              <SectionPreview section={previewSection} />
            </div>
          )}

          <form onSubmit={handleSave}>
            {editing === 'new' && (
              <div className="admin-form-group" style={{ marginBottom: 'var(--space-md)' }}>
                <label className="admin-form-label">Section Type</label>
                <select className="admin-form-input" value={form.sectionType} onChange={e => updateField('sectionType', e.target.value)}>
                  <option value="banner">Custom Banner (with CTA button)</option>
                  <option value="text">Rich Text Section</option>
                </select>
              </div>
            )}
            <div className="admin-form-group" style={{ marginBottom: 'var(--space-sm)' }}>
              <label className="admin-form-label">Title</label>
              <input className="admin-form-input" value={form.title} onChange={e => updateField('title', e.target.value)} placeholder="Section heading" />
            </div>
            <div className="admin-form-group" style={{ marginBottom: 'var(--space-sm)' }}>
              <label className="admin-form-label">Subtitle</label>
              <input className="admin-form-input" value={form.subtitle} onChange={e => updateField('subtitle', e.target.value)} placeholder="Short description below title" />
            </div>
            {!builtInTypes.includes(form.sectionType) && (
              <div className="admin-form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                <label className="admin-form-label">Content</label>
                <textarea className="admin-form-textarea" value={form.content} onChange={e => updateField('content', e.target.value)} rows={3} placeholder="Body text" />
              </div>
            )}
            {form.sectionType === 'banner' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Button URL</label>
                  <input className="admin-form-input" value={form.linkUrl} onChange={e => updateField('linkUrl', e.target.value)} placeholder="https://..." />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Button Text</label>
                  <input className="admin-form-input" value={form.linkText} onChange={e => updateField('linkText', e.target.value)} placeholder="Learn More" />
                </div>
              </div>
            )}
            <div className="admin-form-group" style={{ marginBottom: 'var(--space-md)' }}>
              <label className="admin-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={form.isActive} onChange={e => updateField('isActive', e.target.checked)} />
                Visible on landing page
              </label>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <button type="submit" className="btn btn-primary">{editing === 'new' ? 'Create' : 'Save Changes'}</button>
              <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
            </div>
          </form>
        </div>
      </Modal>

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
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(s)}>Edit</button>
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
