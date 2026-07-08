import { useState, useEffect, useCallback } from 'react';
import { store } from '../lib/adminStore';

export function useLaptops() {
  const [laptops, setLaptops] = useState([]);
  const refresh = useCallback(async () => {
    const data = await store.getLaptops();
    setLaptops(data);
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  return {
    laptops,
    refresh,
    saveLaptop: async (d) => { await store.saveLaptop(d); refresh(); },
    deleteLaptop: async (id) => { await store.deleteLaptop(id); refresh(); },
  };
}

export function useShop() {
  const [shop, setShop] = useState(null);
  useEffect(() => setShop(store.getShop()), []);
  return {
    shop,
    saveShop: (d) => { store.saveShop(d); setShop(d); },
  };
}
