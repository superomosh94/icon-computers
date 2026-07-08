const API_BASE = import.meta.env.VITE_API_URL || '/api';

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

// ── Flash Sales ──

export async function getFlashSales() {
  return request('/flash-sales');
}

export async function createFlashSale(data) {
  return request('/flash-sales', { method: 'POST', body: data });
}

export async function updateFlashSale(id, data) {
  return request(`/flash-sales/${id}`, { method: 'PUT', body: data });
}

export async function deleteFlashSale(id) {
  return request(`/flash-sales/${id}`, { method: 'DELETE' });
}

// ── Shop Settings ──

export async function getShopSettings() {
  return request('/shop-settings');
}

export async function updateShopSetting(key, value) {
  return request(`/shop-settings/${encodeURIComponent(key)}`, { method: 'PUT', body: { value } });
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

// ── Sections ──

export async function getSections(params = {}) {
  const qs = new URLSearchParams(params);
  const q = qs.toString();
  return request(`/sections${q ? `?${q}` : ''}`);
}

export async function createSection(data) {
  return request('/sections', { method: 'POST', body: data });
}

export async function updateSection(id, data) {
  return request(`/sections/${id}`, { method: 'PUT', body: data });
}

export async function deleteSection(id) {
  return request(`/sections/${id}`, { method: 'DELETE' });
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
