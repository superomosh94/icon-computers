import { useState } from 'react';
import { shop } from '../data/shop';
import { WhatsAppIcon } from '../components/ui/Icons';
import './TrackOrderPage.css';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = orderNumber.trim();

    if (!trimmed) {
      setError('Please enter an order number.');
      setSubmitted(false);
      return;
    }

    setError('');
    setSubmitted(true);
  };

  return (
    <div className="track-order-page section">
      <div className="container">
        <h1 className="section-title">Track Your Order</h1>
        <p className="track-order-subtitle">
          Enter your order number to check the current status of your purchase.
        </p>

        <div className="track-order-card">
          <form className="track-order-form" onSubmit={handleSubmit}>
            <div className="track-order-input-group">
              <label htmlFor="order-number" className="track-order-label">
                Order Number
              </label>
              <input
                id="order-number"
                type="text"
                className="track-order-input"
                placeholder="e.g. ICON-2024-1234"
                value={orderNumber}
                onChange={(e) => {
                  setOrderNumber(e.target.value);
                  if (error) setError('');
                  if (submitted) setSubmitted(false);
                }}
              />
              {error && <p className="track-order-error">{error}</p>}
            </div>
            <button type="submit" className="btn btn-primary btn-lg track-order-btn">
              Track
            </button>
          </form>

          {submitted && (
            <div className="track-order-result">
              <p className="track-order-result-text">
                Please reach out to us on WhatsApp for order updates. Our team responds within minutes.
              </p>
              <a
                href={`https://wa.me/${shop.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lg track-order-wa-btn"
              >
                <WhatsAppIcon size={20} />
                Contact Us on WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
