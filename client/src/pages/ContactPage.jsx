import { useState } from 'react';
import { shop } from '../lib/config';
import ContactForm from '../components/ContactForm';
import { MapPinIcon, PhoneIcon, MailIcon, ClockIcon, WhatsAppIcon } from '../components/ui/Icons';
import './ContactPage.css';

export default function ContactPage() {
  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title">Contact Us</h1>
        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon"><MapPinIcon size={24} /></span>
              <div>
                <strong>Address</strong>
                <p className="contact-text">{shop.address}</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon"><PhoneIcon size={24} /></span>
              <div>
                <strong>Phone</strong>
                <a href={`tel:${shop.phone}`} className="contact-link">{shop.phone}</a>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon"><MailIcon size={24} /></span>
              <div>
                <strong>Email</strong>
                <a href={`mailto:${shop.email}`} className="contact-link">{shop.email}</a>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon contact-icon--wa">
                <WhatsAppIcon size={22} />
              </span>
              <div>
                <strong>WhatsApp</strong>
                <a
                  href={`https://wa.me/${shop.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link contact-link--wa"
                >
                  Chat with us on WhatsApp
                </a>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon"><ClockIcon size={24} /></span>
              <div>
                <strong>Hours</strong>
                {Object.entries(shop.hours).map(([day, hours]) => (
                  <p key={day} className="contact-text">{day}: {hours}</p>
                ))}
              </div>
            </div>
          </div>
          <div className="contact-form-wrapper">
            <h2 className="contact-form-title">Send us a Message</h2>
            <ContactForm />
          </div>
        </div>
        <div className="contact-map">
          <iframe
            src={shop.googleMapsSrc}
            width="100%"
            height="400"
            style={{ border: 0, borderRadius: 'var(--radius-lg)' }}
            allowFullScreen
            loading="lazy"
            title="ICON Shop Location"
          />
        </div>
      </div>
    </div>
  );
}
