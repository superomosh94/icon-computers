import { useState, useRef } from 'react';
import { brands, ramOptions } from '../../data/laptops';
import { refurbActions } from '../../data/shop';
import * as api from '../../lib/api';
import './LaptopForm.css';

export default function LaptopForm({ initialData, onSave, onCancel }) {
  const isEditing = initialData !== null;

  const defaultForm = {
    brand: 'Dell',
    model: '',
    cpuBrand: 'Intel',
    cpuModel: 'Core i5',
    cpuGeneration: '11th Gen',
    cpuFull: '',
    cpuCores: 4,
    ram: '8GB',
    storage: '256GB SSD',
    screenSize: '14"',
    screenResolution: '1920x1080',
    gpu: '',
    os: 'Windows 11',
    price: '',
    purchaseCost: '',
    onSale: false,
    discountPercent: '',
    grade: 'Good',
    batteryHealth: '',
    batteryCycles: '',
    physicalNotes: '',
    refurbSelected: [],
    includedItems: ['Laptop', 'Charger'],
    status: 'Available',
  };

  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(
    initialData
      ? {
          brand: initialData.brand,
          model: initialData.model,
          cpuBrand: initialData.cpuBrand,
          cpuModel: initialData.cpuModel,
          cpuGeneration: initialData.cpuGeneration,
          cpuFull: initialData.cpuFull,
          cpuCores: initialData.cpuCores,
          ram: initialData.ram,
          storage: initialData.storage,
          screenSize: initialData.screenSize,
          screenResolution: initialData.screenResolution,
          gpu: initialData.gpu,
          os: initialData.os,
          price: String(initialData.price),
          purchaseCost: String(initialData.purchaseCost || ''),
          onSale: initialData.onSale || false,
          discountPercent: String(initialData.discountPercent || ''),
          grade: initialData.grade,
          batteryHealth: String(initialData.batteryHealth || ''),
          batteryCycles: String(initialData.batteryCycles || ''),
          physicalNotes: initialData.physicalNotes || '',
          refurbSelected: initialData.refurbActions || [],
          includedItems: initialData.includedItems || ['Laptop', 'Charger'],
          status: initialData.status,
        }
      : { ...defaultForm },
  );

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.cpuFull.trim()) errs.cpuFull = 'CPU Full Number is required';
    if (!form.price || Number(form.price) <= 0) errs.price = 'Price must be a positive number';
    const bh = Number(form.batteryHealth);
    if (form.batteryHealth === '' || bh < 0 || bh > 100) errs.batteryHealth = 'Battery health must be 0-100';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) {
      const errs = validate();
      setErrors(errs);
      if (Object.keys(errs).length > 0) return;
    }

    // Upload photos if any
    const files = fileInputRef.current?.files;
    let images = form.images || [];
    if (files && files.length > 0) {
      setUploading(true);
      try {
        const result = await api.uploadPhotos(Array.from(files));
        images = [...images, ...result.urls];
      } catch (err) {
        console.error('Upload failed:', err);
      }
      setUploading(false);
    }

    onSave({ ...form, images });
  };

  const toggleRefurb = (id) => {
    setForm(prev => ({
      ...prev,
      refurbSelected: prev.refurbSelected.includes(id)
        ? prev.refurbSelected.filter(r => r !== id)
        : [...prev.refurbSelected, id],
    }));
  };

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const storageOptions = ['128GB SSD', '256GB SSD', '512GB SSD', '1TB SSD', '1TB HDD', '2TB SSD'];
  const screenSizeOptions = ['13"', '13.3"', '13.6"', '14"', '14.2"', '15.6"', '16"', '17"'];
  const osOptions = ['Windows 10', 'Windows 11', 'macOS Sonoma', 'macOS Ventura', 'Linux', 'None'];
  const cpuBrandOptions = ['Intel', 'AMD', 'Apple'];
  const cpuModelOptions = ['Core i3', 'Core i5', 'Core i7', 'Core i9', 'Ryzen 3', 'Ryzen 5', 'Ryzen 7', 'M1', 'M1 Pro', 'M2'];
  const genOptions = ['8th Gen', '9th Gen', '10th Gen', '11th Gen', '12th Gen', '13th Gen', 'N/A'];
  const gradeOptions = ['Mint', 'Excellent', 'Good'];
  const statusOptions = ['Available', 'Reserved', 'Sold'];
  const brandOptions = brands.filter(b => b !== 'All');
  const ramOptionsFiltered = ramOptions.filter(r => r !== 'All');

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <div className="admin-form-section">
        <h2 className="admin-form-section-title">Basic Info</h2>
        <div className="admin-form-grid">
          <div className="form-group">
            <label>Brand</label>
            <select value={form.brand} onChange={(e) => update('brand', e.target.value)}>
              {brandOptions.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Model</label>
            <input value={form.model} onChange={(e) => update('model', e.target.value)} placeholder="XPS 15 9560" />
          </div>
          <div className="form-group">
            <label>CPU Brand</label>
            <select value={form.cpuBrand} onChange={(e) => update('cpuBrand', e.target.value)}>
              {cpuBrandOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>CPU Model</label>
            <select value={form.cpuModel} onChange={(e) => update('cpuModel', e.target.value)}>
              {cpuModelOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>CPU Generation</label>
            <select value={form.cpuGeneration} onChange={(e) => update('cpuGeneration', e.target.value)}>
              {genOptions.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>CPU Full Number *</label>
            <input
              value={form.cpuFull}
              onChange={(e) => update('cpuFull', e.target.value)}
              placeholder="i7-8565U"
            />
            {errors.cpuFull && <span className="form-error">{errors.cpuFull}</span>}
          </div>
          <div className="form-group">
            <label>CPU Cores</label>
            <input type="number" value={form.cpuCores} onChange={(e) => update('cpuCores', Number(e.target.value))} />
          </div>
        </div>
      </div>

      <div className="admin-form-section">
        <h2 className="admin-form-section-title">Specs</h2>
        <div className="admin-form-grid">
          <div className="form-group">
            <label>RAM</label>
            <select value={form.ram} onChange={(e) => update('ram', e.target.value)}>
              {ramOptionsFiltered.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Storage</label>
            <select value={form.storage} onChange={(e) => update('storage', e.target.value)}>
              {storageOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Screen Size</label>
            <select value={form.screenSize} onChange={(e) => update('screenSize', e.target.value)}>
              {screenSizeOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Screen Resolution</label>
            <input value={form.screenResolution} onChange={(e) => update('screenResolution', e.target.value)} placeholder="1920x1080" />
          </div>
          <div className="form-group">
            <label>GPU / Graphics</label>
            <input value={form.gpu} onChange={(e) => update('gpu', e.target.value)} placeholder="Intel UHD Graphics 620" />
          </div>
          <div className="form-group">
            <label>Operating System</label>
            <select value={form.os} onChange={(e) => update('os', e.target.value)}>
              {osOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="admin-form-section">
        <h2 className="admin-form-section-title">Condition</h2>
        <div className="admin-form-grid">
          <div className="form-group">
            <label>Grade</label>
            <select value={form.grade} onChange={(e) => update('grade', e.target.value)}>
              {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Battery Health % *</label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.batteryHealth}
              onChange={(e) => update('batteryHealth', e.target.value)}
              placeholder="87"
            />
            {errors.batteryHealth && <span className="form-error">{errors.batteryHealth}</span>}
          </div>
          <div className="form-group">
            <label>Battery Cycles</label>
            <input type="number" value={form.batteryCycles} onChange={(e) => update('batteryCycles', e.target.value)} placeholder="220" />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Physical Notes</label>
            <textarea value={form.physicalNotes} onChange={(e) => update('physicalNotes', e.target.value)} rows={2} placeholder="Minor shine on spacebar..." />
          </div>
        </div>
      </div>

      <div className="admin-form-section">
        <h2 className="admin-form-section-title">Refurbishment</h2>
        <div className="admin-form-checkbox-grid">
          {refurbActions.map(action => (
            <label key={action.id} className="admin-checkbox-label">
              <input
                type="checkbox"
                checked={form.refurbSelected.includes(action.id)}
                onChange={() => toggleRefurb(action.id)}
              />
              {action.label}
            </label>
          ))}
        </div>
      </div>

      <div className="admin-form-section">
        <h2 className="admin-form-section-title">Status & Photos</h2>
        <div className="admin-form-grid">
          <div className="form-group">
            <label>Status</label>
            <select value={form.status} onChange={(e) => update('status', e.target.value)}>
              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Selling Price *</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => update('price', e.target.value)}
              placeholder="649"
            />
            {errors.price && <span className="form-error">{errors.price}</span>}
          </div>
          <div className="form-group">
            <label>Purchase Cost</label>
            <input type="number" value={form.purchaseCost} onChange={(e) => update('purchaseCost', e.target.value)} placeholder="420" />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="admin-checkbox-label" style={{ fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={form.onSale}
                onChange={(e) => update('onSale', e.target.checked)}
              />
              Put on Sale
            </label>
            {form.onSale && (
              <div className="form-group" style={{ marginTop: 8 }}>
                <label>Discount Percentage</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={form.discountPercent}
                  onChange={(e) => update('discountPercent', e.target.value)}
                  placeholder="15"
                />
              </div>
            )}
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Photos (up to 5)</label>
            <input type="file" accept=".jpg,.jpeg,.png,.webp" multiple ref={fileInputRef} style={{ padding: '8px 0' }} />
            {uploading && <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)' }}>Uploading...</span>}
          </div>
        </div>
      </div>

      <div className="admin-form-actions">
        <button type="submit" className="btn btn-primary btn-lg">
          {isEditing ? 'Update Laptop' : 'Save / Publish'}
        </button>
        <button type="button" className="btn btn-outline btn-lg" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
