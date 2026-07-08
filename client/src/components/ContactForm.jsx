import { useState } from 'react';
import { CheckmarkIcon } from './ui/Icons';
import './ContactForm.css';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', email: '', message: '' });
    }, 3000);
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
        <input id="contact-name" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Your name" />
      </div>
      <div className="form-group">
        <label htmlFor="contact-email">Email</label>
        <input id="contact-email" name="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="your@email.com" />
      </div>
      <div className="form-group">
        <label htmlFor="contact-message">Message</label>
        <textarea id="contact-message" name="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={4} placeholder="How can we help?" />
      </div>
      <button type="submit" className="btn btn-primary btn-lg">Send Message</button>
    </form>
  );
}
