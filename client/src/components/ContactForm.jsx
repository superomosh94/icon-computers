import { useState } from 'react';
import * as api from '../lib/api';
import { CheckmarkIcon } from './ui/Icons';
import './ContactForm.css';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    if (!form.message.trim()) errs.message = 'Message is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSending(true);
    try {
      await api.sendContactMessage({ name: form.name.trim(), email: form.email.trim(), message: form.message.trim() });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ name: '', email: '', message: '' });
        setErrors({});
      }, 3000);
    } catch {
      setErrors({ submit: 'Failed to send. Please try again or call us.' });
    }
    setSending(false);
  };

  if (submitted) {
    return (
      <div className="contact-form-success">
        <div className="form-success-icon">
          <CheckmarkIcon />
        </div>
        <h3 className="form-success-title">Message Sent!</h3>
        <p className="form-success-text">We will get back to you as soon as possible.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="form-group">
        <label htmlFor="contact-name">Name</label>
        <input id="contact-name" name="name" value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: '' }); }} placeholder="Your name" className={errors.name ? 'input-error' : ''} />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="contact-email">Email</label>
        <input id="contact-email" name="email" type="email" value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); if (errors.email) setErrors({ ...errors, email: '' }); }} placeholder="your@email.com" className={errors.email ? 'input-error' : ''} />
        {errors.email && <span className="form-error">{errors.email}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="contact-message">Message</label>
        <textarea id="contact-message" name="message" value={form.message} onChange={(e) => { setForm({ ...form, message: e.target.value }); if (errors.message) setErrors({ ...errors, message: '' }); }} rows={4} placeholder="How can we help?" className={errors.message ? 'input-error' : ''} />
        {errors.message && <span className="form-error">{errors.message}</span>}
      </div>
      {errors.submit && <p className="form-error" style={{ textAlign: 'center' }}>{errors.submit}</p>}
      <button type="submit" className="btn btn-primary btn-lg" disabled={sending}>{sending ? 'Sending...' : 'Send Message'}</button>
    </form>
  );
}
