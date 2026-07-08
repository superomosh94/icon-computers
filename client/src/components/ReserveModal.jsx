import { useState, useEffect } from 'react';
import * as api from '../lib/api';
import Modal from './ui/Modal';
import { CheckmarkIcon, AlertIcon } from './ui/Icons';
import './ReserveModal.css';

export default function ReserveModal({ isOpen, onClose, laptop }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm({ name: '', phone: '', email: '' });
      setErrors({});
      setSubmitted(false);
    }
  }, [isOpen]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10)
      errs.phone = 'Valid phone number (10+ digits) is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSending(true);
    try {
      await api.createReservation({
        customerName: form.name.trim(),
        customerPhone: form.phone.trim(),
        customerEmail: form.email.trim(),
        laptopId: laptop?.id,
        laptopName: laptop ? `${laptop.brand} ${laptop.model}` : '',
        laptopSlug: laptop?.slug,
      });
      setSubmitted(true);
      setTimeout(() => onClose(), 3000);
    } catch {
      setErrors({ submit: 'Failed to send reservation. Please try again or call us.' });
    }
    setSending(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {submitted ? (
        <div className="reserve-success">
          <div className="reserve-success-icon">
            <CheckmarkIcon />
          </div>
          <h3 className="reserve-success-title">Reservation Sent!</h3>
          <p className="reserve-success-text">
            We will hold <strong>{laptop?.brand} {laptop?.model}</strong> for 24 hours. Visit our shop to test and purchase.
          </p>
        </div>
      ) : (
        <>
          <h2 className="reserve-title">Reserve This Laptop</h2>
          <p className="reserve-laptop-name">{laptop?.brand} {laptop?.model}</p>
          <div className="reserve-note">
            <AlertIcon />
            <span>We will hold this laptop for 24 hours for you. Please visit our shop to test and purchase.</span>
          </div>
          <form onSubmit={handleSubmit} className="reserve-form">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className={errors.name ? 'input-error' : ''} />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" className={errors.phone ? 'input-error' : ''} />
              {errors.phone && <span className="form-error">{errors.phone}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email (optional)</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" />
            </div>
            {errors.submit && <p className="form-error" style={{ textAlign: 'center' }}>{errors.submit}</p>}
            <div className="reserve-actions">
              <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 1 }} disabled={sending}>{sending ? 'Sending...' : 'Send Reservation'}</button>
              <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </>
      )}
    </Modal>
  );
}
