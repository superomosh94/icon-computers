import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import { shop } from '../../lib/config';
import { WhatsAppIcon } from '../ui/Icons';
import './LaptopCard.css';

export default function LaptopCard({ laptop }) {
  const waMsg = encodeURIComponent(
    `Is this available?\n\n${laptop.brand} ${laptop.model}\nCPU: ${laptop.cpuFull}\nRAM: ${laptop.ram}\nStorage: ${laptop.storage}\nPrice: KSh ${laptop.price.toLocaleString()}\nGrade: ${laptop.grade}\n\nFrom ICON Laptop Shop`
  );

  return (
    <div className="laptop-card">
      <Link to={`/laptop/${laptop.slug}`} className="laptop-card-link">
        <div className="laptop-card-image">
          <img src={laptop.images[0]} alt={`${laptop.brand} ${laptop.model}`} loading="lazy" />

          {laptop.onSale && laptop.discountPercent > 0 && (
            <div className="laptop-card-discount-badge">-{laptop.discountPercent}%</div>
          )}
          {laptop.flashSale && (
            <div className="laptop-card-flash-badge">Flash Sale</div>
          )}
          {laptop.status !== 'Available' && (
            <div className="laptop-card-status-overlay">
              <span className="laptop-card-oos-stamp">OUT OF STOCK</span>
            </div>
          )}
        </div>
        <div className="laptop-card-body">
          <h3 className="laptop-card-title">{laptop.brand} {laptop.model}</h3>
          <div className="laptop-card-chips">
            <span className="laptop-card-chip">{laptop.cpuFull}</span>
            <span className="laptop-card-chip">{laptop.ram}</span>
            <span className="laptop-card-chip">{laptop.storage}</span>
          </div>
          <div className="laptop-card-price-row">
            <div className="laptop-card-price-left">
              <span className="laptop-card-price">KSh {laptop.price.toLocaleString()}</span>
              {laptop.originalPrice && (
                <span className="laptop-card-original">KSh {laptop.originalPrice.toLocaleString()}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
      {laptop.status === 'Available' && (
        <a
          href={`https://wa.me/${shop.whatsapp}?text=${waMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="laptop-card-wa-btn"
        >
          <WhatsAppIcon size={16} />
          Check Availability
        </a>
      )}
    </div>
  );
}
