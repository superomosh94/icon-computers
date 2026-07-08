import { Link } from 'react-router-dom';
import { shop } from '../../data/shop';
import { PhoneIcon, MailIcon, MapPinIcon, ClockIcon, WhatsAppIcon } from '../ui/Icons';
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
            <div className="footer-contact-list">
              <a href={`tel:${shop.phone}`} className="footer-contact-item">
                <PhoneIcon size={16} />
                <span>{shop.phone}</span>
              </a>
              <a href={`mailto:${shop.email}`} className="footer-contact-item">
                <MailIcon size={16} />
                <span>{shop.email}</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Links</h4>
            <Link to="/catalog">Catalog</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/faq">FAQ</Link>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Customer Service</h4>
            <Link to="/track-order">Track Order</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/faq">Shipping Info</Link>
            <Link to="/faq">Returns</Link>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Account</h4>
            <Link to="/">My Account</Link>
            <Link to="/">Order History</Link>
            <Link to="/">Wishlist</Link>
          </div>
        </div>

        {/* Newsletter */}
        <div className="footer-newsletter">
          <h4 className="footer-newsletter-title">Get the best deals first</h4>
          <form className="footer-newsletter-form">
            <input
              type="email"
              placeholder="Your email address"
              className="footer-newsletter-input"
            />
            <button type="submit" className="footer-newsletter-btn">Subscribe</button>
          </form>
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
        </div>

        {/* Payment methods */}
        <div className="footer-payments">
          <span className="footer-payments-label">We Accept</span>
          <div className="footer-payment-chips">
            <span className="footer-payment-chip">Visa</span>
            <span className="footer-payment-chip">Mastercard</span>
            <span className="footer-payment-chip">M-Pesa</span>
            <span className="footer-payment-chip">Bank Transfer</span>
          </div>
        </div>

        {/* Social links */}
        <div className="footer-social">
          <a href="#" className="footer-social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2z" />
            </svg>
          </a>
          <a href="#" className="footer-social-link" aria-label="Twitter / X" target="_blank" rel="noopener noreferrer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a href="#" className="footer-social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          <a href={`https://wa.me/${shop.whatsapp}`} className="footer-social-link" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon size={20} />
          </a>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <span className="footer-bottom-copy">
            &copy; {new Date().getFullYear()} {shop.name}. All rights reserved.
          </span>
          <div className="footer-bottom-links">
            <Link to="/">Privacy Policy</Link>
            <Link to="/">Terms &amp; Conditions</Link>
            <Link to="/">Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
