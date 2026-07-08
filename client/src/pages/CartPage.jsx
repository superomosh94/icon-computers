import { Link } from 'react-router-dom';
import { shop } from '../data/shop';
import { WhatsAppIcon } from '../components/ui/Icons';
import './CartPage.css';

export default function CartPage() {
  return (
    <div className="cart-page section">
      <div className="container">
        <h1 className="section-title">Cart</h1>

        <div className="cart-empty">
          <div className="cart-empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="21" r="1" stroke="var(--color-text-light)" strokeWidth="2" />
              <circle cx="20" cy="21" r="1" stroke="var(--color-text-light)" strokeWidth="2" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="var(--color-text-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="cart-empty-title">Your cart is empty</h3>
          <p className="cart-empty-text">
            To purchase a laptop, simply browse our catalog and contact us on WhatsApp. We will help you place your order.
          </p>
          <div className="cart-actions">
            <Link to="/catalog" className="btn btn-primary btn-lg cart-action-btn">
              Browse Catalog
            </Link>
            <a
              href={`https://wa.me/${shop.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg cart-wa-btn"
            >
              <WhatsAppIcon size={20} />
              Contact Us on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
