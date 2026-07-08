import { Link } from 'react-router-dom';
import { shop } from '../../lib/config';
import { PhoneIcon, MapPinIcon, ClockIcon, WhatsAppIcon } from '../ui/Icons';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-columns">
          {/* Brand column */}
          <div className="footer-col footer-col-brand">
            <div className="footer-logo">
              <img src="/icon-logo.png" alt="ICON" className="footer-logo-img" />
            </div>
            <p className="footer-tagline">{shop.tagline}</p>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Links</h4>
            <Link to="/catalog">Catalog</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/faq">FAQ</Link>
          </div>
        </div>

        {/* Location strip */}
        <div className="footer-location">
          <span className="footer-location-item">
            <MapPinIcon size={16} />
            <span>{shop.address}</span>
          </span>
          <span className="footer-location-item">
            <ClockIcon size={16} />
            <span>{shop.hours["Mon-Sat"]} (Mon-Sat)</span>
          </span>
          <span className="footer-location-item">
            <PhoneIcon size={16} />
            <span>{shop.phone}</span>
          </span>
          <a href={`https://wa.me/${shop.whatsapp}`} className="footer-location-item" target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon size={16} />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <span className="footer-bottom-copy">
            &copy; {new Date().getFullYear()} {shop.name}. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
