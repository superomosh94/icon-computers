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
    const data = await api.getFlashSales();
    return data.flashSales;
  },

  async saveFlashSale(sale) {
    if (sale.id) {
      await api.updateFlashSale(sale.id, sale);
    } else {
      await api.createFlashSale(sale);
    }
  },

  async deleteFlashSale(id) {
    await api.deleteFlashSale(id);
  },

  async getShop() {
    const data = await api.getShopSettings();
    return {
      tagline: data.tagline || '',
      subtitle: data.subtitle || '',
      phone: data.phone || '',
      email: data.email || '',
      whatsapp: data.whatsapp || '',
      address: data.address || '',
      hours: data.hours || { 'Mon-Sat': '', 'Sun': '' },
    };
  },

  async saveShopField(key, value) {
    await api.updateShopSetting(key, value);
  },

  async saveShopFull(shop) {
    const fields = ['tagline', 'subtitle', 'phone', 'email', 'whatsapp', 'address'];
    for (const f of fields) {
      if (shop[f] !== undefined) await api.updateShopSetting(f, shop[f]);
    }
    if (shop.hours) {
      if (shop.hours['Mon-Sat'] !== undefined) await api.updateShopSetting('hours_Mon-Sat', shop.hours['Mon-Sat']);
      if (shop.hours['Sun'] !== undefined) await api.updateShopSetting('hours_Sun', shop.hours['Sun']);
    }
  },

  saveShop(shop) {
    return this.saveShopFull(shop);
  },

  async getStats() {
    const [products, reservations, flashSales] = await Promise.all([
      this.getProducts(),
      this.getReservations(),
      this.getFlashSales(),
    ]);
    return {
      totalProducts: products.length,
      activeSales: products.filter((p) => p.onSale).length,
      flashSalesRunning: flashSales.filter((f) => f.isActive).length,
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
