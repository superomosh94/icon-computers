import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let data = null;

function load() {
  if (!data) {
    const raw = fs.readFileSync(path.join(__dirname, '..', 'data-fallback.json'), 'utf8');
    data = JSON.parse(raw);
  }
  return data;
}

export function getFallbackLaptops() {
  return load().laptops || [];
}

export function getFallbackSections() {
  return load().sections || [];
}

export function getFallbackShopSettings() {
  return load().shopSettings || {};
}
