import * as api from './api';

const STORAGE_KEY = 'icon_shop_admin';

// Fallback mock data for development without backend
import mockLaptops from '../data/laptops';
import mockReservations from '../data/reservations';

function getFallback() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        products: Array.isArray(parsed.products) ? parsed.products : mockLaptops,
        reservations: Array.isArray(parsed.reservations) ? parsed.reservations : mockReservations,
        flashSales: Array.isArray(parsed.flashSales) ? parsed.flashSales : [],
        bestDeals: Array.isArray(parsed.bestDeals) ? parsed.bestDeals : [],
      };
    }
  } catch { /* ignore */ }
  return { products: mockLaptops, reservations: mockReservations, flashSales: [], bestDeals: [] };
}

function persistFallback(data) {
  const existing = getFallback();
  const merged = { ...existing, ...data };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch { /* ignore */ }
}

export const store = {
  async getProducts(params = {}) {
    try {
      const data = await api.getLaptops({ ...params, all: 'true' });
      return data.laptops;
    } catch {
      return getFallback().products;
    }
  },

  async getLaptops(params = {}) {
    return this.getProducts(params);
  },

  async saveLaptop(laptop) {
    try {
      if (laptop.id) {
        const data = await api.updateLaptop(laptop.id, laptop);
        return data.laptop;
      } else {
        const data = await api.createLaptop(laptop);
        return data.laptop;
      }
    } catch {
      const data = getFallback();
      if (laptop.id) {
        const idx = data.products.findIndex((p) => p.id === laptop.id);
        if (idx >= 0) data.products[idx] = laptop;
      } else {
        laptop.id = Date.now();
        data.products.push(laptop);
      }
      persistFallback({ products: data.products });
      return laptop;
    }
  },

  async deleteProduct(id) {
    try {
      await api.deleteLaptop(id);
    } catch {
      const data = getFallback();
      data.products = data.products.filter((p) => p.id !== id);
      persistFallback({ products: data.products });
    }
  },

  async getReservations(params = {}) {
    try {
      const data = await api.getReservations(params);
      return data.reservations;
    } catch {
      return getFallback().reservations;
    }
  },

  async getFlashSales() {
    return getFallback().flashSales;
  },

  saveFlashSale(sale) {
    const data = getFallback();
    const idx = data.flashSales.findIndex((f) => f.id === sale.id);
    if (idx >= 0) data.flashSales[idx] = sale;
    else data.flashSales.push(sale);
    persistFallback({ flashSales: data.flashSales });
  },

  deleteFlashSale(id) {
    const data = getFallback();
    data.flashSales = data.flashSales.filter((f) => f.id !== id);
    persistFallback({ flashSales: data.flashSales });
  },

  getBestDeals() {
    return getFallback().bestDeals;
  },

  getShop() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY + '_shop');
      if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
    return {
      tagline: 'Premium Refurbished Laptops',
      subtitle: 'Quality tested, certified pre-owned laptops at unbeatable prices',
      aboutText: 'ICON Laptops is a premier refurbished laptop retailer...',
      address: '123 Tech Street, Nairobi, Kenya',
      phone: '+254 700 123 456',
      email: 'info@iconlaptops.co.ke',
      whatsapp: '+254 700 123 456',
      hours: { 'Mon-Sat': '9:00 AM - 6:00 PM', Sun: 'Closed' },
      social: { facebook: '', twitter: '', instagram: '' },
    };
  },

  saveShop(shop) {
    try {
      localStorage.setItem(STORAGE_KEY + '_shop', JSON.stringify(shop));
    } catch { /* ignore */ }
  },

  async getStats() {
    try {
      const [products, reservations] = await Promise.all([
        this.getProducts(),
        this.getReservations(),
      ]);
      return {
        totalProducts: products.length,
        activeSales: products.filter((p) => p.onSale).length,
        flashSalesRunning: 0,
        pendingReservations: reservations.filter((r) => r.status === 'Pending').length,
      };
    } catch {
      const data = getFallback();
      return {
        totalProducts: data.products.length,
        activeSales: data.products.filter((p) => p.onSale).length,
        flashSalesRunning: 0,
        pendingReservations: data.reservations.filter((r) => r.status === 'Pending').length,
      };
    }
  },

  async getRecentProducts(count = 5) {
    try {
      const data = await api.getLaptops({ sort: 'newest', all: 'true' });
      return data.laptops.slice(0, count);
    } catch {
      const products = getFallback().products;
      return [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, count);
    }
  },

  async getPendingReservations() {
    try {
      const data = await api.getReservations({ status: 'Pending' });
      return data.reservations;
    } catch {
      return getFallback().reservations.filter((r) => r.status === 'Pending');
    }
  },
};
