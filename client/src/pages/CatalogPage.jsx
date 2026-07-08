import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { brands, ramOptions, sortOptions } from '../data/laptops';
import * as api from '../lib/api';
import LaptopCard from '../components/laptop/LaptopCard';
import Pagination from '../components/ui/Pagination';
import BackToTop from '../components/ui/BackToTop';
import { ChevronDownIcon, CloseIcon } from '../components/ui/Icons';
import './CatalogPage.css';

const ITEMS_PER_PAGE = 24;

function FilterSection({ title, open, onToggle, children }) {
  return (
    <div className="filter-section">
      <button className="filter-section-header" onClick={onToggle}>
        <span>{title}</span>
        <span className={`filter-chevron ${open ? 'open' : ''}`}>
          <ChevronDownIcon />
        </span>
      </button>
      {open && <div className="filter-section-body">{children}</div>}
    </div>
  );
}

export default function CatalogPage() {
  const [searchParams] = useSearchParams();
  const [laptops, setLaptops] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('newest');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRam, setSelectedRam] = useState([]);
  const [selectedStorage, setSelectedStorage] = useState([]);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(999999);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filterOpen, setFilterOpen] = useState({
    brand: true,
    price: true,
    ram: true,
    storage: false,
  });
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [available, setAvailable] = useState([]);

  // Fetch all available laptops for filter options (once)
  useEffect(() => {
    api.getLaptops({ status: 'Available', all: 'true' })
      .then(data => setAvailable(data.laptops))
      .catch(() => import('../data/laptops').then(m => setAvailable(m.default.filter(l => l.status !== 'Sold'))));
  }, []);

  useEffect(() => {
    const brand = searchParams.get('brand');
    if (brand) setSelectedBrands([brand]);
  }, [searchParams]);

  const storageOptions = useMemo(
    () => [...new Set(available.map((l) => l.storage))].sort(),
    [available]
  );

  const priceRange = useMemo(() => {
    const prices = available.map((l) => l.price);
    const max = Math.max(...prices, 1);
    return { min: 0, max: Math.ceil(max / 500) * 500 || 1500 };
  }, [available]);

  // Sync priceMax with computed max on mount
  useEffect(() => {
    if (priceMax === 999999 && priceRange.max > 0) {
      setPriceMax(priceRange.max);
    }
  }, [priceRange.max, priceMax]);

  // Reset displayCount and page when any filter changes
  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
    setPage(1);
  }, [search, sort, selectedBrands, selectedRam, selectedStorage, priceMin, priceMax]);

  // Fetch laptops from API with filters
  useEffect(() => {
    setLoading(true);
    const params = {
      sort,
      search: search || undefined,
      brand: selectedBrands.length > 0 ? selectedBrands.join(',') : undefined,
      ram: selectedRam.length > 0 ? selectedRam.join(',') : undefined,
      storage: selectedStorage.length > 0 ? selectedStorage.join(',') : undefined,
      page,
      limit: displayCount,
    };

    api.getLaptops(params)
      .then(data => {
        setLaptops(data.laptops);
        setTotal(data.total);
      })
      .catch(() => {
        // Fallback: filter locally
        import('../data/laptops').then(m => {
          let result = m.default.filter(l => l.status !== 'Sold');
          if (search) {
            const q = search.toLowerCase();
            result = result.filter(l => l.brand.toLowerCase().includes(q) || l.model.toLowerCase().includes(q) || l.cpuFull.toLowerCase().includes(q));
          }
          if (selectedBrands.length) result = result.filter(l => selectedBrands.includes(l.brand));
          if (selectedRam.length) result = result.filter(l => selectedRam.includes(l.ram));
          if (selectedStorage.length) result = result.filter(l => selectedStorage.includes(l.storage));
          if (priceMin > 0) result = result.filter(l => l.price >= priceMin);
          if (priceMax < priceRange.max) result = result.filter(l => l.price <= priceMax);
          switch (sort) {
            case 'price-asc': result.sort((a, b) => a.price - b.price); break;
            case 'price-desc': result.sort((a, b) => b.price - a.price); break;
            default: result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
          }
          setTotal(result.length);
          setLaptops(result.slice(0, displayCount));
        });
      })
      .finally(() => setLoading(false));
  }, [sort, selectedBrands, selectedRam, selectedStorage, priceMin, priceMax, search, page, displayCount, priceRange.max]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const hasMore = displayCount < total;

  // Contextual filter counts
  const getContextualCount = (category, value) => {
    let result = [...available];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(l => l.brand.toLowerCase().includes(q) || l.model.toLowerCase().includes(q) || l.cpuFull.toLowerCase().includes(q));
    }
    if (category !== 'brand' && selectedBrands.length > 0) result = result.filter(l => selectedBrands.includes(l.brand));
    if (category !== 'ram' && selectedRam.length > 0) result = result.filter(l => selectedRam.includes(l.ram));
    if (category !== 'storage' && selectedStorage.length > 0) result = result.filter(l => selectedStorage.includes(l.storage));
    if (priceMin > 0) result = result.filter(l => l.price >= priceMin);
    if (priceMax < priceRange.max) result = result.filter(l => l.price <= priceMax);
    if (category === 'brand') result = result.filter(l => l.brand === value);
    else if (category === 'ram') result = result.filter(l => l.ram === value);
    else if (category === 'storage') result = result.filter(l => l.storage === value);
    return result.length;
  };

  const toggleFilter = (field, value) => {
    setPage(1);
    if (field === 'brand') {
      setSelectedBrands((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      );
    } else if (field === 'ram') {
      setSelectedRam((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      );
    } else if (field === 'storage') {
      setSelectedStorage((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      );
    }
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedRam([]);
    setSelectedStorage([]);
    setPriceMin(0);
    setPriceMax(priceRange.max);
    setSearch('');
    setPage(1);
  };

  const handleLoadMore = () => {
    const next = displayCount + ITEMS_PER_PAGE;
    setDisplayCount(next);
    setPage(Math.ceil(next / ITEMS_PER_PAGE));
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setDisplayCount(newPage * ITEMS_PER_PAGE);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePriceMinChange = (e) => {
    const val = Number(e.target.value);
    if (val <= priceMax) {
      setPriceMin(val);
      setPage(1);
    }
  };

  const handlePriceMaxChange = (e) => {
    const val = Number(e.target.value);
    if (val >= priceMin) {
      setPriceMax(val);
      setPage(1);
    }
  };

  const priceActive = priceMin > 0 || priceMax < priceRange.max;
  const activeFilterCount =
    selectedBrands.length +
    selectedRam.length +
    selectedStorage.length +
    (priceActive ? 1 : 0);

  const filterContent = (
    <>
      <FilterSection
        title="Brand"
        open={filterOpen.brand}
        onToggle={() => setFilterOpen((f) => ({ ...f, brand: !f.brand }))}
      >
        <div className="filter-options">
          {brands
            .filter((b) => b !== 'All')
            .map((b) => (
              <label
                key={b}
                className={`filter-check ${selectedBrands.includes(b) ? 'checked' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(b)}
                  onChange={() => toggleFilter('brand', b)}
                />
                <span>{b}</span>
                <span className="filter-count">
                  ({getContextualCount('brand', b)})
                </span>
              </label>
            ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Price Range"
        open={filterOpen.price}
        onToggle={() => setFilterOpen((f) => ({ ...f, price: !f.price }))}
      >
        <div className="filter-slider-group">
          <div className="filter-slider-values">
            <span>KSh {priceMin.toLocaleString()}</span>
            <span>KSh {priceMax.toLocaleString()}</span>
          </div>
          <div className="filter-slider-inputs">
            <input
              type="range"
              min={0}
              max={priceRange.max}
              step={50}
              value={priceMin}
              onChange={handlePriceMinChange}
              className="filter-slider filter-slider-min"
              aria-label="Minimum price"
            />
            <input
              type="range"
              min={0}
              max={priceRange.max}
              step={50}
              value={priceMax}
              onChange={handlePriceMaxChange}
              className="filter-slider filter-slider-max"
              aria-label="Maximum price"
            />
          </div>
        </div>
      </FilterSection>

      <FilterSection
        title="RAM"
        open={filterOpen.ram}
        onToggle={() => setFilterOpen((f) => ({ ...f, ram: !f.ram }))}
      >
        <div className="filter-options">
          {ramOptions
            .filter((r) => r !== 'All')
            .map((r) => (
              <label
                key={r}
                className={`filter-check ${selectedRam.includes(r) ? 'checked' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={selectedRam.includes(r)}
                  onChange={() => toggleFilter('ram', r)}
                />
                <span>{r}</span>
                <span className="filter-count">
                  ({getContextualCount('ram', r)})
                </span>
              </label>
            ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Storage"
        open={filterOpen.storage}
        onToggle={() =>
          setFilterOpen((f) => ({ ...f, storage: !f.storage }))
        }
      >
        <div className="filter-options">
          {storageOptions.map((s) => (
            <label
              key={s}
              className={`filter-check ${selectedStorage.includes(s) ? 'checked' : ''}`}
            >
              <input
                type="checkbox"
                checked={selectedStorage.includes(s)}
                onChange={() => toggleFilter('storage', s)}
              />
              <span>{s}</span>
              <span className="filter-count">
                ({getContextualCount('storage', s)})
              </span>
            </label>
          ))}
        </div>
      </FilterSection>
    </>
  );

  return (
    <div className="catalog-page section">
      <div className="container">
        <div className="catalog-top">
          <h1 className="section-title">Catalog</h1>
          <div className="catalog-top-controls">
            <div className="catalog-search">
              <input
                type="text"
                placeholder="Search laptops..."
                value={search}
                aria-label="Search"
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="catalog-search-input"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="catalog-sort"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <button
              className="btn btn-outline btn-sm catalog-filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters{' '}
              {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
          </div>
        </div>

        {/* Mobile filter overlay */}
        {showFilters && (
          <div
            className="filter-overlay"
            onClick={() => setShowFilters(false)}
          />
        )}

        {/* Mobile filter drawer */}
        <div className={`filter-drawer ${showFilters ? 'open' : ''}`}>
          <div className="filter-drawer-header">
            <h3>Filters</h3>
            <button
              className="filter-drawer-close"
              onClick={() => setShowFilters(false)}
            >
              <CloseIcon size={18} />
            </button>
          </div>
          <div className="filter-drawer-body">
            {filterContent}
            {activeFilterCount > 0 && (
              <div className="filter-drawer-clear">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={clearFilters}
                  style={{ width: '100%' }}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="catalog-layout">
          {/* Desktop sidebar */}
          <aside className="catalog-sidebar">
            <div className="filter-header">
              <h3>Filters</h3>
              {activeFilterCount > 0 && (
                <button className="filter-clear" onClick={clearFilters}>
                  Clear All
                </button>
              )}
            </div>
            {filterContent}
          </aside>

          <div className="catalog-main">
            <div className="catalog-result-bar">
              <span className="catalog-result-count">
                {total} product
                {total !== 1 ? 's' : ''} found
              </span>
              {activeFilterCount > 0 && (
                <div className="catalog-active-filters">
                  {selectedBrands.map((b) => (
                    <button
                      key={b}
                      className="active-filter-chip"
                      onClick={() => toggleFilter('brand', b)}
                    >
                      {b} &times;
                    </button>
                  ))}
                  {selectedRam.map((r) => (
                    <button
                      key={r}
                      className="active-filter-chip"
                      onClick={() => toggleFilter('ram', r)}
                    >
                      {r} &times;
                    </button>
                  ))}
                  {selectedStorage.map((s) => (
                    <button
                      key={s}
                      className="active-filter-chip"
                      onClick={() => toggleFilter('storage', s)}
                    >
                      {s} &times;
                    </button>
                  ))}
                  {priceActive && (
                    <button
                      className="active-filter-chip"
                      onClick={() => {
                        setPriceMin(0);
                        setPriceMax(priceRange.max);
                        setPage(1);
                      }}
                    >
                      Price &times;
                    </button>
                  )}
                </div>
              )}
            </div>

            {loading ? (
              <div className="empty-state">
                <h3>Loading laptops...</h3>
              </div>
            ) : laptops.length > 0 ? (
              <>
                <div className="catalog-grid">
                  {laptops.map((laptop) => (
                    <LaptopCard key={laptop.id} laptop={laptop} />
                  ))}
                </div>

                {hasMore && (
                  <div className="load-more-wrap">
                    <button
                      className="btn btn-outline load-more-btn"
                      onClick={handleLoadMore}
                    >
                      Load More ({total - displayCount} remaining)
                    </button>
                  </div>
                )}

                {!hasMore && totalPages > 1 && (
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              <div className="empty-state">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms.</p>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={clearFilters}
                  style={{ marginTop: 'var(--space-md)' }}
                >
                  Clear Filters
                </button>
              </div>
            )}
            <BackToTop />
          </div>
        </div>
      </div>
    </div>
  );
}
