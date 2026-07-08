import './AboutPage.css';

function WrenchIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="10" r="3" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const reasons = [
  {
    icon: <WrenchIcon />,
    title: 'We Personally Test Every Laptop',
    text: 'Before any laptop is listed, we run it through a full diagnostic. We check the battery health, test every port, inspect the screen for dead pixels, and verify the keyboard and trackpad. If it does not meet our standards, we do not sell it.',
  },
  {
    icon: <MapPinIcon />,
    title: 'Serving Nairobi Since 2020',
    text: 'We are a Nairobi-based shop with a physical location on Moi Avenue. You can visit us in person, see the exact unit you are buying, and test it before you pay. No drop-shipping, no middlemen.',
  },
  {
    icon: <ShieldIcon />,
    title: '6-Month Warranty on Every Laptop',
    text: 'Every laptop we sell comes with a minimum 6-month walk-in warranty covering hardware defects. If something goes wrong, bring it back to our shop and we will take care of it.',
  },
];

export default function AboutPage() {
  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title">About ICON</h1>
        <p className="section-subtitle">Kenya's trusted destination for quality refurbished laptops.</p>

        <div className="about-story">
          <div className="about-story-content">
            <h2 className="about-story-heading">Our Story</h2>
            <p>
              ICON was founded with a simple mission: make quality laptops accessible
              and affordable in Kenya. We saw how difficult it was to find reliable,
              fairly priced laptops, so we set out to change that.
            </p>
            <p>
              Today, we are a Kenyan electronics shop specialising in high-quality
              refurbished laptops. Every unit we sell has been carefully sourced,
              professionally refurbished, and rigorously tested to ensure it meets
              our standards. From our shop in Nairobi to customers across the country, we
              help Kenyans get the technology they need at prices they can trust.
            </p>
            <p>
              We believe in transparency, integrity, and building lasting relationships
              with our customers. That is why we provide detailed condition reports,
              real battery health readings, and a walk-in warranty on every purchase.
              When you buy from ICON, you are not just getting a laptop, you are
              getting peace of mind.
            </p>
          </div>
          <div className="about-story-stats">
            <div className="about-stat">
              <span className="about-stat-number">Trusted</span>
              <span className="about-stat-label">by customers across Kenya</span>
            </div>
            <div className="about-stat">
              <span className="about-stat-number">6 Months</span>
              <span className="about-stat-label">Walk-in Warranty</span>
            </div>
            <div className="about-stat">
              <span className="about-stat-number">Since 2020</span>
              <span className="about-stat-label">Serving Nairobi</span>
            </div>
            <div className="about-stat">
              <span className="about-stat-number">100%</span>
              <span className="about-stat-label">Tested Before Listing</span>
            </div>
          </div>
        </div>

        <div className="about-reasons">
          <h2 className="about-section-title">Why Choose ICON</h2>
          <div className="about-reasons-grid">
            {reasons.map((r, i) => (
              <div key={i} className="about-reason-card">
                <span className="about-reason-icon">{r.icon}</span>
                <h3 className="about-reason-title">{r.title}</h3>
                <p className="about-reason-text">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
