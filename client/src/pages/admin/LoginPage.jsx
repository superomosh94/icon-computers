import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../../lib/api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.login(username, password);
      navigate('/admin');
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <img src="/icon-logo.png" alt="ICON Laptops" />
          <h1 className="login-title">
            ICON <span>Admin</span>
          </h1>
          <p className="login-subtitle">Sign in to manage your shop</p>
        </div>

        {error && (
          <div className="login-error">{error}</div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="username">Username</label>
            <input
              id="username"
              className="admin-form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="password">Password</label>
            <input
              id="password"
              className="admin-form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary login-btn">
            Sign In
          </button>
        </form>

        <div className="login-dev-info">
          <button type="button" className="login-dev-btn" onClick={() => { setUsername('admin'); setPassword('admin123'); }}>
            Dev Quick Fill
          </button>
          <span className="login-dev-creds">admin / admin123</span>
        </div>
      </div>
    </div>
  );
}
