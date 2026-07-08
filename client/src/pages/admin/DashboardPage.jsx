import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { store } from '../../lib/adminStore';
import Badge from '../../components/ui/Badge';

/* ── Stats card SVG icons ── */
function BoxIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

/* ── Stat card ── */
function StatCard({ icon, label, value, accent }) {
  return (
    <div className="dashboard-card">
      <div className={`dashboard-card-icon ${accent}`}>{icon}</div>
      <div className="dashboard-card-body">
        <span className="dashboard-card-value">{value}</span>
        <span className="dashboard-card-label">{label}</span>
      </div>
    </div>
  );
}

/* ── Dashboard Page ── */
export default function DashboardPage() {
  const [stats, setStats] = useState({ totalProducts: 0, activeSales: 0, flashSalesRunning: 0, pendingReservations: 0 });
  const [recentProducts, setRecentProducts] = useState([]);
  const [pendingReservations, setPendingReservations] = useState([]);

  useEffect(() => {
    Promise.all([
      store.getStats(),
      store.getRecentProducts(5),
      store.getPendingReservations(),
    ]).then(([s, r, p]) => {
      setStats(s);
      setRecentProducts(r);
      setPendingReservations(p);
    });
  }, []);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="dashboard-subtitle">Overview of your shop performance</p>
        </div>
        <Link to="/admin/products" className="btn btn-primary btn-sm">
          Manage Products
        </Link>
      </div>

      {/* ── Stats Grid ── */}
      <div className="dashboard-stats-grid">
        <StatCard
          icon={<BoxIcon />}
          label="Total Products"
          value={stats.totalProducts}
          accent="accent-blue"
        />
        <StatCard
          icon={<TagIcon />}
          label="Active Sales"
          value={stats.activeSales}
          accent="accent-green"
        />
        <StatCard
          icon={<ZapIcon />}
          label="Flash Sales Running"
          value={stats.flashSalesRunning}
          accent="accent-amber"
        />
        <StatCard
          icon={<ClockIcon />}
          label="Pending Reservations"
          value={stats.pendingReservations}
          accent="accent-rose"
        />
      </div>

      {/* ── Recent Products ── */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">Recent Products</h2>
          <Link to="/admin/products" className="dashboard-view-all">View All</Link>
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Title</th>
                <th>Price</th>
                <th>Sale</th>
                <th>Grade</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="dashboard-empty-row">No products found.</td>
                </tr>
              )}
              {recentProducts.map((laptop) => (
                <tr key={laptop.id}>
                  <td>
                    <img
                      src={laptop.images?.[0] || ''}
                      alt=""
                      className="admin-thumb"
                    />
                  </td>
                  <td className="admin-cell-title">
                    {laptop.brand} {laptop.model}
                  </td>
                  <td>KSh {laptop.price?.toLocaleString()}</td>
                  <td>
                    {laptop.onSale ? (
                      <Badge>-{laptop.discountPercent}%</Badge>
                    ) : (
                      <span className="dashboard-muted">&mdash;</span>
                    )}
                  </td>
                  <td><Badge>{laptop.grade}</Badge></td>
                  <td><Badge>{laptop.status}</Badge></td>
                  <td className="admin-cell-date">
                    {laptop.createdAt
                      ? new Date(laptop.createdAt).toLocaleDateString()
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Pending Reservations ── */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">Pending Reservations</h2>
          <Link to="/admin/reservations" className="dashboard-view-all">View All</Link>
        </div>
        {pendingReservations.length === 0 ? (
          <div className="dashboard-empty-state">
            <p>No pending reservations. All clear.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Laptop</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingReservations.map((r) => (
                  <tr key={r.id}>
                    <td className="admin-cell-title">{r.customerName}</td>
                    <td>{r.customerPhone}</td>
                    <td>{r.laptopName}</td>
                    <td className="admin-cell-date">
                      {new Date(r.createdAt).toLocaleString()}
                    </td>
                    <td><Badge>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
