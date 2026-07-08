import * as api from './api';

export const store = {
  async getProducts(params = {}) {
    const data = await api.getLaptops({ ...params, all: 'true' });
    return data.laptops;
  },

  async getLaptops(params = {}) {
    return this.getProducts(params);
  },

  async saveLaptop(laptop) {
    if (laptop.id) {
      const data = await api.updateLaptop(laptop.id, laptop);
      return data.laptop;
    } else {
      const data = await api.createLaptop(laptop);
      return data.laptop;
    }
  },

  async deleteProduct(id) {
    await api.deleteLaptop(id);
  },

  async getReservations(params = {}) {
    const data = await api.getReservations(params);
    return data.reservations;
  },

  async getFlashSales() {
    return [];
  },

  saveFlashSale() {},

  deleteFlashSale() {},

  getBestDeals() {
    return [];
  },

  getShop() {
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

  saveShop() {},

  async getStats() {
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
  },

  async getRecentProducts(count = 5) {
    const data = await api.getLaptops({ sort: 'newest', all: 'true' });
    return data.laptops.slice(0, count);
  },

  async getPendingReservations() {
    const data = await api.getReservations({ status: 'Pending' });
    return data.reservations;
  },
};
