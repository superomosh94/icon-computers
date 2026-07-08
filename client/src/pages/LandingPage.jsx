import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { shop } from '../lib/config';
import * as api from '../lib/api';
import LaptopCard from '../components/laptop/LaptopCard';
import { ChevronRightIcon, PhoneIcon, ChevronLeftIcon, MapPinIcon, ClockIcon, WhatsAppIcon } from '../components/ui/Icons';
import './LandingPage.css';

const BENEFIT_ICONS = [
  '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />',
  '<circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />',
  '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />',
  '<path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />',
];

const DEFAULT_BENEFITS = [
  { title: '6-Month Walk-in Warranty', text: 'We stand behind every laptop we sell. If anything goes wrong, bring it back and we fix it at no cost to you.' },
  { title: 'Test Before You Pay', text: 'Walk into our shop and inspect the exact unit you are buying. Run any test you want — no pressure.' },
  { title: 'Same-Day Response', text: 'Call, WhatsApp, or walk in. We answer every inquiry within minutes and you can test any laptop in person.' },
  { title: 'Real Photos. Real Specs.', text: 'We photograph the actual unit you are buying and list accurate specs. No stock photos, no surprises.' },
];

export default function LandingPage() {
  const [laptops, setLaptops] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getLaptops({ status: 'Available', all: 'true' }),
      api.getSections(),
    ]).then(([laptopsData, sectionsData]) => {
      setLaptops(laptopsData.laptops);
      setSections(sectionsData.sections);
    }).catch(() => setLaptops([]))
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
    if (next < 0) { el.scrollLeft = max; }
    else if (next > max) { el.scrollLeft = 0; }
    else { el.scrollBy({ left: dir * slideW, behavior: 'smooth' }); }
  };

  function sec(type) {
    return sections.find(s => s.sectionType === type);
  }

  if (loading) return <div className="section"><div className="container"><p>Loading...</p></div></div>;

  const rendered = [];

  sections.forEach(s => {
    switch (s.sectionType) {
      case 'hero':
        rendered.push(
          <section key={s.id} className="hero">
            <div className="container hero-content">
              <h1 className="hero-title">{s.title || shop.tagline}</h1>
              <p className="hero-subtitle">{s.subtitle || shop.subtitle}</p>
              <div className="hero-actions">
                <Link to="/catalog" className="btn btn-primary btn-sm">Browse All Laptops <ChevronRightIcon /></Link>
                <a href={`tel:${shop.phone}`} className="btn btn-outline hero-call-btn"><PhoneIcon size={14} /> Call Us</a>
              </div>
            </div>
          </section>
        );
        break;

      case 'carousel':
        rendered.push(
          <section key={s.id} className="carousel-bar">
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
        );
        break;

      case 'flash-deals':
        if (flashSales.length > 0) rendered.push(
          <section key={s.id} className="section section-flash">
            <div className="container">
              <div className="section-header">
                <div>
                  <h2 className="section-title">{s.title || 'Flash Deals'}</h2>
                  <p className="section-subtitle">{s.subtitle || ''}</p>
                </div>
              </div>
              <div className="row-4">{flashSales.map(l => <LaptopCard key={l.id} laptop={l} />)}</div>
            </div>
          </section>
        );
        break;

      case 'showcase':
        rendered.push(
          <section key={s.id} className="section showcase-section">
            <div className="container">
              <div className="section-header">
                <div>
                  <h2 className="section-title">{s.title || 'Browse All Laptops'}</h2>
                  <p className="section-subtitle">{s.subtitle || ''}</p>
                </div>
              </div>
              <div className="showcase-wrapper">
                <button className="showcase-arrow showcase-arrow-left" onClick={() => scrollShowcase(-1)}><ChevronLeftIcon size={22} /></button>
                <div className="showcase-viewport" ref={showcaseRef}>
                  <div className="showcase-track">
                    {showcaseItems.map((laptop, i) => (
                      <div key={`${laptop.id}-${i}`} className="showcase-slide"><LaptopCard laptop={laptop} /></div>
                    ))}
                  </div>
                </div>
                <button className="showcase-arrow showcase-arrow-right" onClick={() => scrollShowcase(1)}><ChevronRightIcon size={22} /></button>
              </div>
            </div>
          </section>
        );
        break;

      case 'deals':
        if (onSale.length > 0) rendered.push(
          <section key={s.id} className="section section-deals">
            <div className="container">
              <div className="section-header">
                <div>
                  <h2 className="section-title">{s.title || 'Best Value Picks'}</h2>
                  <p className="section-subtitle">{s.subtitle || ''}</p>
                </div>
                <Link to="/catalog" className="btn btn-outline btn-sm">View All <ChevronRightIcon /></Link>
              </div>
              <div className="row-3">{onSale.map(l => <LaptopCard key={l.id} laptop={l} />)}</div>
            </div>
          </section>
        );
        break;

      case 'top-picks':
        rendered.push(
          <section key={s.id} className="section section-featured">
            <div className="container">
              <div className="section-header">
                <div>
                  <h2 className="section-title">{s.title || 'Top Picks'}</h2>
                  <p className="section-subtitle">{s.subtitle || ''}</p>
                </div>
                <Link to="/catalog" className="btn btn-outline btn-sm">View All <ChevronRightIcon /></Link>
              </div>
              <div className="row-4">{featured.map(l => <LaptopCard key={l.id} laptop={l} />)}</div>
            </div>
          </section>
        );
        break;

      case 'new-arrivals':
        rendered.push(
          <section key={s.id} className="section section-arrivals">
            <div className="container">
              <div className="section-header">
                <div>
                  <h2 className="section-title">{s.title || 'New Stock Alert'}</h2>
                  <p className="section-subtitle">{s.subtitle || ''}</p>
                </div>
              </div>
              <div className="row-4">{newArrivals.map(l => <LaptopCard key={l.id} laptop={l} />)}</div>
            </div>
          </section>
        );
        break;

      case 'top-rated':
        if (available.filter(l => l.rating >= 4.5).length > 0) rendered.push(
          <section key={s.id} className="section section-top-rated">
            <div className="container">
              <div className="section-header">
                <div>
                  <h2 className="section-title">{s.title || 'Top Rated'}</h2>
                  <p className="section-subtitle">{s.subtitle || ''}</p>
                </div>
              </div>
              <div className="row-4">{available.filter(l => l.rating >= 4.5).slice(0, 4).map(l => <LaptopCard key={l.id} laptop={l} />)}</div>
            </div>
          </section>
        );
        break;

      case 'brands':
        rendered.push(
          <section key={s.id} className="section section-brands">
            <div className="container">
              <div className="section-header">
                <div>
                  <h2 className="section-title">{s.title || 'Browse by Brand'}</h2>
                  <p className="section-subtitle">{s.subtitle || ''}</p>
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
        );
        break;

      case 'benefits':
        rendered.push(
          <section key={s.id} className="section section-benefits">
            <div className="container">
              <h2 className="section-title section-title--center">{s.title || 'Why Shop With ICON'}</h2>
              <p className="section-subtitle" style={{ textAlign: 'center' }}>{s.subtitle || ''}</p>
              <div className="benefits-grid">
                {DEFAULT_BENEFITS.map((b, i) => (
                  <div key={i} className="benefit-card">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: BENEFIT_ICONS[i] || '' }} />
                    <h3>{b.title}</h3>
                    <p>{b.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
        break;

      case 'location':
        rendered.push(
          <section key={s.id} className="section section-location">
            <div className="container">
              <div className="location-content">
                <div className="location-info">
                  <h2 className="section-title--center" style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, marginBottom: 'var(--space-sm)', textAlign: 'center' }}>{s.title || 'Visit Our Shop'}</h2>
                  <p className="location-subtitle" style={{ textAlign: 'center' }}>{s.subtitle || ''}</p>
                  <div className="location-details">
                    <div className="location-detail"><MapPinIcon size={20} /><span>{shop.address}</span></div>
                    <div className="location-detail"><ClockIcon size={20} /><span>Mon-Sat: {shop.hours["Mon-Sat"]}</span></div>
                    <div className="location-detail"><PhoneIcon size={20} /><a href={`tel:${shop.phone}`}>{shop.phone}</a></div>
                    <a href={`https://wa.me/${shop.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary"><WhatsAppIcon size={18} /> WhatsApp Us</a>
                  </div>
                </div>
                <div className="location-map">
                  <iframe src={shop.googleMapsSrc} width="100%" height="320" style={{ border: 0, borderRadius: 'var(--radius-lg)' }} allowFullScreen loading="lazy" title="ICON Shop Location" />
                </div>
              </div>
            </div>
          </section>
        );
        break;

      case 'banner':
        rendered.push(
          <section key={s.id} className="section" style={{ background: 'var(--color-surface)' }}>
            <div className="container" style={{ textAlign: 'center' }}>
              {s.title && <h2 className="section-title section-title--center">{s.title}</h2>}
              {s.subtitle && <p className="section-subtitle" style={{ textAlign: 'center' }}>{s.subtitle}</p>}
              {s.content && <p style={{ color: 'var(--color-text-secondary)', maxWidth: 640, margin: '0 auto var(--space-lg)', lineHeight: 1.7 }}>{s.content}</p>}
              {s.linkUrl && <a href={s.linkUrl} className="btn btn-primary" target="_blank" rel="noopener noreferrer">{s.linkText || 'Learn More'}</a>}
            </div>
          </section>
        );
        break;

      case 'text':
        rendered.push(
          <section key={s.id} className="section" style={{ background: 'var(--color-bg)' }}>
            <div className="container" style={{ textAlign: 'center' }}>
              {s.title && <h2 className="section-title section-title--center">{s.title}</h2>}
              {s.subtitle && <p className="section-subtitle" style={{ textAlign: 'center' }}>{s.subtitle}</p>}
              {s.content && <p style={{ color: 'var(--color-text-secondary)', maxWidth: 640, margin: '0 auto', lineHeight: 1.7 }}>{s.content}</p>}
            </div>
          </section>
        );
        break;
    }
  });

  return <div className="landing">{rendered}</div>;
}
