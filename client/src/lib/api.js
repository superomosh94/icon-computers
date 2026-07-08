const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function request(endpoint, options = {}) {
  const config = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  // Don't set Content-Type for FormData (browser sets it with boundary)
  if (config.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  const res = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Request failed: ${res.status}`);
  }

  return data;
}

// ── Laptops ──

export async function getLaptops(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') qs.set(k, v);
  });
  const q = qs.toString();
  return request(`/laptops${q ? `?${q}` : ''}`);
}

export async function getFeaturedLaptops() {
  return request('/laptops/featured');
}

export async function getLaptopBySlug(slug) {
  return request(`/laptops/${encodeURIComponent(slug)}`);
}

export async function createLaptop(data) {
  return request('/laptops', { method: 'POST', body: data });
}

export async function updateLaptop(id, data) {
  return request(`/laptops/${id}`, { method: 'PUT', body: data });
}

export async function deleteLaptop(id) {
  return request(`/laptops/${id}`, { method: 'DELETE' });
}

// ── Reservations ──

export async function getReservations(params = {}) {
  const qs = new URLSearchParams(params);
  const q = qs.toString();
  return request(`/reservations${q ? `?${q}` : ''}`);
}

export async function createReservation(data) {
  return request('/reservations', { method: 'POST', body: data });
}

export async function updateReservation(id, data) {
  return request(`/reservations/${id}`, { method: 'PUT', body: data });
}

export async function deleteReservation(id) {
  return request(`/reservations/${id}`, { method: 'DELETE' });
}

// ── Contact ──

export async function sendContactMessage(data) {
  return request('/contact', { method: 'POST', body: data });
}

// ── Auth ──

export async function login(username, password) {
  return request('/auth/login', { method: 'POST', body: { username, password } });
}

export async function logout() {
  return request('/auth/logout', { method: 'POST' });
}

export async function getMe() {
  return request('/auth/me');
}

// ── Upload ──

export async function uploadPhotos(files) {
  const formData = new FormData();
  files.forEach((file) => formData.append('photos', file));
  return request('/upload', { method: 'POST', body: formData });
}

export async function uploadSinglePhoto(file) {
  const formData = new FormData();
  formData.append('photo', file);
  return request('/upload/single', { method: 'POST', body: formData });
}
