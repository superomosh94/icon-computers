import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { shop } from '../../data/shop';
import laptops from '../../data/laptops';
import { SearchIcon, PhoneIcon } from '../ui/Icons';
import './Header.css';

const RECENT_SEARCHES_KEY = 'iconRecentSearches';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  const recentSearches = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]');

  const suggestions = search.trim()
    ? laptops
        .filter(l => {
          const q = search.toLowerCase();
          return l.brand.toLowerCase().includes(q) ||
                 l.model.toLowerCase().includes(q) ||
                 l.cpuFull.toLowerCase().includes(q);
        })
        .slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      const saved = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]');
      const updated = [search.trim(), ...saved.filter(s => s !== search.trim())].slice(0, 5);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      navigate(`/catalog?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (term) => {
    setSearch(term);
    setShowSuggestions(false);
    const saved = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]');
    const updated = [term, ...saved.filter(s => s !== term)].slice(0, 5);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    navigate(`/catalog?search=${encodeURIComponent(term)}`);
  };

  const clearRecent = (e) => {
    e.stopPropagation();
    localStorage.removeItem(RECENT_SEARCHES_KEY);
    setShowSuggestions(true);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/catalog', label: 'Catalog' },
    { to: '/about', label: 'About' },
    { to: '/faq', label: 'FAQ' },
    { to: '/contact', label: 'Contact' },
    { to: '/admin', label: 'Admin', className: 'header-nav-admin' },
  ];

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="header-logo">
          <img src="/icon-logo.png" alt="ICON" className="header-logo-img" />
        </Link>

        <div className="header-search" ref={searchRef}>
          <form onSubmit={handleSearch} className="header-search-form">
            <input
              type="text"
              placeholder="Search laptops by brand, model, or CPU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              className="header-search-input"
              aria-label="Search"
            />
            <button type="submit" className="header-search-btn" aria-label="Search">
              <SearchIcon />
            </button>
          </form>
          {showSuggestions && (
            <div className="header-search-dropdown">
              {search.trim() && suggestions.length > 0 ? (
                <>
                  <div className="header-search-dropdown-label">Suggestions</div>
                  {suggestions.map(l => (
                    <button
                      key={l.id}
                      className="header-search-suggestion"
                      onClick={() => handleSuggestionClick(l.brand + ' ' + l.model)}
                    >
                      <span className="header-search-suggestion-name">{l.brand} {l.model}</span>
                      <span className="header-search-suggestion-spec">{l.cpuFull} | {l.ram} | {l.storage}</span>
                    </button>
                  ))}
                </>
              ) : !search.trim() && recentSearches.length > 0 ? (
                <>
                  <div className="header-search-dropdown-label">
                    Recent Searches
                    <button className="header-search-clear" onClick={clearRecent}>Clear</button>
                  </div>
                  {recentSearches.map((term, i) => (
                    <button
                      key={i}
                      className="header-search-suggestion"
                      onClick={() => handleSuggestionClick(term)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {term}
                    </button>
                  ))}
                </>
              ) : (
                <div className="header-search-dropdown-empty">Type to search laptops</div>
              )}
            </div>
          )}
        </div>

        <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`header-nav-link${link.className ? ` ${link.className}` : ''}`}
              onClick={() => setMenuOpen(false)}
              aria-current={location.pathname === link.to ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <a href={`tel:${shop.phone}`} className="header-phone-btn">
          <PhoneIcon size={16} />
          Call Us
        </a>

        <button
          className={`header-hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      {menuOpen && <div className="header-overlay" onClick={() => setMenuOpen(false)} />}
    </header>
  );
}
