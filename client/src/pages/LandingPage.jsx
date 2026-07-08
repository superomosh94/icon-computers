import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { shop } from '../data/shop';
import * as api from '../lib/api';
import LaptopCard from '../components/laptop/LaptopCard';
import { ChevronRightIcon, PhoneIcon, ChevronLeftIcon } from '../components/ui/Icons';
import './LandingPage.css';

export default function LandingPage() {
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getLaptops({ status: 'Available', all: 'true' })
      .then(data => setLaptops(data.laptops))
      .catch(() => import('../data/laptops').then(m => setLaptops(m.default.filter(l => l.status === 'Available'))))
      .finally(() => setLoading(false));
  }, []);

  const showcaseRef = useRef(null);
  const slideW = 276;

  useEffect(() => {
    const interval = setInterval(() => {
      const el = showcaseRef.current;
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= max - 30) {
        el.scrollLeft = 0;
      } else {
        el.scrollBy({ left: slideW, behavior: 'smooth' });
      }
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const available = laptops;
  const onSale = available.filter(l => l.onSale).slice(0, 3);
  const featured = available.filter(l => l.featured).slice(0, 8);
  const flashSales = available.filter(l => l.flashSale).slice(0, 4);
  const newArrivals = [...available].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
  const brands = [...new Set(available.map(l => l.brand))];

  const showcaseItems = [...available, ...available, ...available];

  const scrollShowcase = (dir) => {
    if (!showcaseRef.current) return;
    const el = showcaseRef.current;
    const max = el.scrollWidth - el.clientWidth;
    const next = el.scrollLeft + (dir * slideW);
    if (next < 0) {
      el.scrollLeft = max;
    } else if (next > max) {
      el.scrollLeft = 0;
    } else {
      el.scrollBy({ left: dir * slideW, behavior: 'smooth' });
    }
  };

  if (loading) return <div className="section"><div className="container"><p>Loading...</p></div></div>;

  return (
    <div className="landing">
      <section className="hero" style={{ '--hero-bg': 'url(https://i.pinimg.com/736x/38/65/94/386594135756b1c8572b20991e9dd963.jpg)' }}>
        <div className="hero-overlay" />
        <div className="container hero-content">
          <h1 className="hero-title">{shop.tagline}</h1>
          <p className="hero-subtitle">{shop.subtitle}</p>
          <div className="hero-actions">
            <Link to="/catalog" className="btn btn-primary btn-sm">
              Browse All Laptops <ChevronRightIcon />
            </Link>
            <a href={`tel:${shop.phone}`} className="btn btn-outline hero-call-btn">
              <PhoneIcon size={14} /> Call Us
            </a>
          </div>
        </div>
      </section>

      <section className="carousel-bar">
        <div className="carousel-bar-track">
          <div className="carousel-bar-content">
            {[...available, ...available, ...available].map((laptop, i) => (
              <div key={`${laptop.id}-${i}`} className="carousel-bar-slide">
                <LaptopCard laptop={laptop} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {flashSales.length > 0 && (
        <section className="section section-flash">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">Flash Sales</h2>
                <p className="section-subtitle">Limited time offers — grab them fast</p>
              </div>
            </div>
            <div className="row-4">
              {flashSales.map(laptop => <LaptopCard key={laptop.id} laptop={laptop} />)}
            </div>
          </div>
        </section>
      )}

      <section className="section showcase-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Browse All Laptops</h2>
              <p className="section-subtitle">Swipe through our full collection</p>
            </div>
          </div>
          <div className="showcase-wrapper">
            <button className="showcase-arrow showcase-arrow-left" onClick={() => scrollShowcase(-1)}><ChevronLeftIcon size={22} /></button>
            <div className="showcase-viewport" ref={showcaseRef}>
              <div className="showcase-track">
                {showcaseItems.map((laptop, i) => (
                  <div key={`${laptop.id}-${i}`} className="showcase-slide">
                    <LaptopCard laptop={laptop} />
                  </div>
                ))}
              </div>
            </div>
            <button className="showcase-arrow showcase-arrow-right" onClick={() => scrollShowcase(1)}><ChevronRightIcon size={22} /></button>
          </div>
        </div>
      </section>

      {onSale.length > 0 && (
        <section className="section section-deals">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">Best Deals</h2>
                <p className="section-subtitle">Save on these laptops</p>
              </div>
              <Link to="/catalog" className="btn btn-outline btn-sm">View All <ChevronRightIcon /></Link>
            </div>
            <div className="row-3">
              {onSale.map(laptop => <LaptopCard key={laptop.id} laptop={laptop} />)}
            </div>
          </div>
        </section>
      )}



      <section className="section section-benefits">
        <div className="container">
          <h2 className="section-title">Why Shop With ICON</h2>
          <p className="section-subtitle">We make buying a laptop simple and safe</p>
          <div className="benefits-grid">
            <div className="benefit-card">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <h3>6-Month Warranty</h3>
              <p>Every laptop comes with a 6-month walk-in warranty. If something goes wrong, we fix it at no cost.</p>
            </div>
            <div className="benefit-card">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <h3>Test Before You Pay</h3>
              <p>Walk into our shop and inspect the exact unit you are buying. Run any test you want — no pressure.</p>
            </div>
            <div className="benefit-card">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <h3>Call or WhatsApp</h3>
              <p>Reach us by phone or WhatsApp. We respond quickly and answer all your questions before you buy.</p>
            </div>
            <div className="benefit-card">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <h3>Real Photos. Real Specs.</h3>
              <p>We photograph the actual unit you are buying and list accurate specs. No stock photos, no surprises.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-featured">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Laptops</h2>
              <p className="section-subtitle">Hand-picked and fully tested</p>
            </div>
            <Link to="/catalog" className="btn btn-outline btn-sm">View All <ChevronRightIcon /></Link>
          </div>
          <div className="row-4">
            {featured.map(laptop => <LaptopCard key={laptop.id} laptop={laptop} />)}
          </div>
        </div>
      </section>

      <section className="section section-arrivals">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Just Arrived</h2>
              <p className="section-subtitle">Fresh stock added recently</p>
            </div>
          </div>
          <div className="row-4">
            {newArrivals.map(laptop => <LaptopCard key={laptop.id} laptop={laptop} />)}
          </div>
        </div>
      </section>

      {available.filter(l => l.rating >= 4.5).length > 0 && (
        <section className="section section-top-rated">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">Top Rated</h2>
                <p className="section-subtitle">Our highest rated laptops</p>
              </div>
            </div>
            <div className="row-4">
              {available.filter(l => l.rating >= 4.5).slice(0, 4).map(laptop => <LaptopCard key={laptop.id} laptop={laptop} />)}
            </div>
          </div>
        </section>
      )}

      <section className="section section-brands">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Shop by Brand</h2>
              <p className="section-subtitle">Browse laptops from top manufacturers</p>
            </div>
          </div>
          <div className="brands-grid">
            {brands.map(brand => (
              <Link key={brand} to={`/catalog?brand=${brand}`} className="brand-card">
                <span className="brand-name">{brand}</span>
                <span className="brand-count">{available.filter(l => l.brand === brand).length} units</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
