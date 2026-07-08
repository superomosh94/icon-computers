import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { shop } from '../lib/config';
import * as api from '../lib/api';
import ImageGallery from '../components/laptop/ImageGallery';
import SpecsTable from '../components/laptop/SpecsTable';
import BatteryGauge from '../components/ui/BatteryGauge';
import RefurbReport from '../components/laptop/RefurbReport';
import Badge from '../components/ui/Badge';
import InTheBox from '../components/laptop/InTheBox';
import ReserveModal from '../components/ReserveModal';
import LaptopCard from '../components/laptop/LaptopCard';
import { CheckIcon, WhatsAppIcon, PhoneIcon } from '../components/ui/Icons';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [laptop, setLaptop] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);

    api.getLaptopBySlug(slug)
      .then(data => {
        setLaptop(data.laptop);
        api.getLaptops({ brand: data.laptop.brand, all: 'true' }).then(r => {
          setRelated(r.laptops.filter(l => l.id !== data.laptop.id).slice(0, 4));
        }).catch(() => {});
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (notFound || (!loading && !laptop)) {
    return (
      <div className="section">
        <div className="container empty-state">
          <h3>Laptop not found</h3>
          <p>This laptop may have been removed or the link is incorrect.</p>
          <Link to="/catalog" className="btn btn-primary" style={{ marginTop: 'var(--space-lg)' }}>
            Browse Catalog
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="product-page">
        <div className="container">
          <div className="pdp-skeleton">
            <div className="pdp-skeleton-grid">
              <div className="pdp-skeleton-main">
                <div className="skeleton-block skeleton-image" />
                <div className="skeleton-row">
                  <div className="skeleton-block skeleton-thumb" />
                  <div className="skeleton-block skeleton-thumb" />
                  <div className="skeleton-block skeleton-thumb" />
                  <div className="skeleton-block skeleton-thumb" />
                </div>
              </div>
              <div className="pdp-skeleton-side">
                <div className="skeleton-block skeleton-title" />
                <div className="skeleton-block skeleton-text-short" />
                <div className="skeleton-block skeleton-price" />
                <div className="skeleton-block skeleton-text" />
                <div className="skeleton-block skeleton-text" />
                <div className="skeleton-block skeleton-btn" />
                <div className="skeleton-block skeleton-btn-secondary" />
              </div>
            </div>
            <div className="pdp-skeleton-details">
              <div className="skeleton-block skeleton-section" />
              <div className="skeleton-block skeleton-section" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const savings = laptop.originalPrice ? laptop.originalPrice - laptop.price : 0;
  const savingsPercent = laptop.originalPrice ? Math.round((savings / laptop.originalPrice) * 100) : 0;

  const waMsg = encodeURIComponent(
    `Is this available?\n\n${laptop.brand} ${laptop.model}\nCPU: ${laptop.cpuBrand} ${laptop.cpuFull} (${laptop.cpuGeneration})\nRAM: ${laptop.ram}\nStorage: ${laptop.storage}\nScreen: ${laptop.screenSize} ${laptop.screenResolution}\nGPU: ${laptop.gpu}\nOS: ${laptop.os}\nGrade: ${laptop.grade}\nPrice: KSh ${laptop.price.toLocaleString()}\n\nFrom ICON Laptop Shop`
  );

  return (
    <div className="product-page">
      <div className="container">
        <nav className="detail-breadcrumb" aria-label="Breadcrumb">
          <Link to="/catalog">Catalog</Link>
          <span className="breadcrumb-sep">/</span>
          <span>{laptop.brand} {laptop.model}</span>
        </nav>

        <div className="detail-grid">
          <div className="detail-gallery">
            <ImageGallery images={laptop.images} alt={`${laptop.brand} ${laptop.model}`} />
          </div>

          <div className="detail-info">
            <div className="detail-header">
              <div>
                <h1 className="detail-title">{laptop.brand} {laptop.model}</h1>
                <p className="detail-cpu">{laptop.cpuBrand} {laptop.cpuFull}</p>
              </div>
              <Badge>{laptop.status}</Badge>
            </div>

            <div className="detail-pricing">
              <span className="detail-price-now">KSh {laptop.price.toLocaleString()}</span>
              {laptop.originalPrice && (
                <>
                  <span className="detail-original">KSh {laptop.originalPrice.toLocaleString()}</span>
                  <span className="save-badge">
                    Save KSh {savings.toLocaleString()} ({savingsPercent}%)
                  </span>
                </>
              )}
            </div>

            <div className="detail-chips">
              <span className="detail-chip">{laptop.cpuFull}</span>
              <span className="detail-chip">{laptop.ram}</span>
              <span className="detail-chip">{laptop.storage}</span>
              <span className="detail-chip">{laptop.screenSize}</span>
            </div>

            <div className="detail-badges">
              <div className="detail-grade-box">
                <span className="detail-label">Condition</span>
                <Badge>{laptop.grade}</Badge>
              </div>
              <BatteryGauge health={laptop.batteryHealth} cycles={laptop.batteryCycles} />
            </div>

            <div className="detail-trust">
              <div className="detail-trust-item">
                <CheckIcon />
                <span>6-Month Walk-in Warranty</span>
              </div>
              <div className="detail-trust-item">
                <CheckIcon />
                <span>See the Exact Unit You Buy</span>
              </div>
              <div className="detail-trust-item">
                <CheckIcon />
                <span>Test Before You Pay</span>
              </div>
            </div>

            {laptop.refurbActions && laptop.refurbActions.length > 0 && (
              <RefurbReport actions={laptop.refurbActions} />
            )}

            {laptop.physicalNotes && (
              <div className="detail-notes-box">
                <p className="detail-notes-box-title">Physical Notes</p>
                <p className="detail-notes-box-text">{laptop.physicalNotes}</p>
              </div>
            )}

            <div className="detail-actions">
              <button className="btn btn-primary btn-lg" onClick={() => setReserveOpen(true)} style={{ width: '100%', justifyContent: 'center' }}>
                Reserve for In-Store Viewing
              </button>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)', textAlign: 'center', margin: 0 }}>We will hold this laptop for 24 hours.</p>
              <a
                href={`https://wa.me/${shop.whatsapp}?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lg detail-wa-btn"
              >
                <WhatsAppIcon size={24} />
                Check Availability on WhatsApp
              </a>
              <a href={`tel:${shop.phone}`} className="btn btn-secondary btn-lg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-sm)' }}>
                <PhoneIcon size={18} />
                Call Us
              </a>
            </div>

          </div>
        </div>

        <div className="detail-sections">
          <section className="detail-section">
            <h2>Full Specifications</h2>
            <SpecsTable laptop={laptop} />
          </section>

          <section className="detail-section">
            <h2>What is in the Box</h2>
            <InTheBox items={laptop.includedItems} />
          </section>
        </div>

        {related.length > 0 && (
          <section className="related-section">
            <h2 className="related-section-title">Related Laptops</h2>
            <p className="related-section-subtitle">More {laptop.brand} laptops you might be interested in</p>
            <div className="related-grid">
              {related.map(l => (
                <LaptopCard key={l.id} laptop={l} />
              ))}
            </div>
          </section>
        )}
      </div>

      <ReserveModal isOpen={reserveOpen} onClose={() => setReserveOpen(false)} laptop={laptop} />
    </div>
  );
}
