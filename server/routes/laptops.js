import { Router } from 'express';
import pool from '../db/pool.js';
import { generateSlug } from '../utils/slug.js';
import { requireAuth } from '../middleware/auth.js';
import { createError } from '../middleware/errorHandler.js';
import { getFallbackLaptops } from '../utils/fallback.js';

const router = Router();

// GET /api/laptops — list available (with filters, sort, pagination)
router.get('/', async (req, res, next) => {
  try {
    const {
      status = 'Available',
      sort = 'newest',
      brand,
      ram,
      storage,
      search,
      featured,
      flashSale,
      page = 1,
      limit = 24,
    } = req.query;

    let where = ['1=1'];
    let params = [];
    let paramIndex = 1;

    // Non-admin: only show Available; admin: can filter by any status
    const isAdmin = req.session?.userId;
    if (!isAdmin || !status || status === 'Available') {
      where.push(`status = $${paramIndex++}`);
      params.push('Available');
    } else if (status && status !== 'all') {
      where.push(`status = $${paramIndex++}`);
      params.push(status);
    }

    if (search) {
      where.push(`(LOWER(brand) LIKE $${paramIndex} OR LOWER(model) LIKE $${paramIndex} OR LOWER(cpu_full) LIKE $${paramIndex})`);
      params.push(`%${search.toLowerCase()}%`);
      paramIndex++;
    }

    if (brand) {
      const brands = brand.split(',');
      const placeholders = brands.map((_, i) => `$${paramIndex + i}`);
      where.push(`brand IN (${placeholders.join(',')})`);
      params.push(...brands);
      paramIndex += brands.length;
    }

    if (ram) {
      const rams = ram.split(',');
      const placeholders = rams.map((_, i) => `$${paramIndex + i}`);
      where.push(`ram IN (${placeholders.join(',')})`);
      params.push(...rams);
      paramIndex += rams.length;
    }

    if (storage) {
      const storages = storage.split(',');
      const placeholders = storages.map((_, i) => `$${paramIndex + i}`);
      where.push(`storage IN (${placeholders.join(',')})`);
      params.push(...storages);
      paramIndex += storages.length;
    }

    if (featured === 'true') {
      where.push('featured = true');
    }

    if (flashSale === 'true') {
      where.push('flash_sale = true');
    }

    const priceMinVal = req.query.priceMin;
    const priceMaxVal = req.query.priceMax;
    if (priceMinVal && !isNaN(priceMinVal)) {
      where.push(`price >= $${paramIndex++}`);
      params.push(parseFloat(priceMinVal));
    }
    if (priceMaxVal && !isNaN(priceMaxVal)) {
      where.push(`price <= $${paramIndex++}`);
      params.push(parseFloat(priceMaxVal));
    }

    const whereClause = where.join(' AND ');

    // Get total count
    const countResult = await pool.query(`SELECT COUNT(*) FROM laptops WHERE ${whereClause}`, params);
    const total = parseInt(countResult.rows[0].count);

    // Sort
    let orderBy;
    switch (sort) {
      case 'price-asc':
        orderBy = 'price ASC';
        break;
      case 'price-desc':
        orderBy = 'price DESC';
        break;
      default:
        orderBy = 'created_at DESC';
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    // "All" query — no limit
    const isAll = req.query.all === 'true';

    let queryText;
    if (isAll) {
      queryText = `SELECT * FROM laptops WHERE ${whereClause} ORDER BY ${orderBy}`;
    } else {
      queryText = `SELECT * FROM laptops WHERE ${whereClause} ORDER BY ${orderBy} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(limitNum, offset);
    }

    const result = await pool.query(queryText, params);

    // Transform to camelCase for frontend
    const laptops = result.rows.map(formatLaptop);

    res.json({
      laptops,
      total,
      page: isAll ? 1 : pageNum,
      limit: isAll ? total : limitNum,
      totalPages: isAll ? 1 : Math.ceil(total / limitNum),
    });
  } catch {
    const fallback = getFallbackLaptops().filter(l => l.status !== 'Sold');
    res.json({ laptops: fallback, total: fallback.length, page: 1, limit: fallback.length, totalPages: 1 });
  }
});

// GET /api/laptops/featured — featured laptops (max 6)
router.get('/featured', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM laptops WHERE featured = true AND status = $1 ORDER BY created_at DESC LIMIT 6',
      ['Available']
    );
    res.json({ laptops: result.rows.map(formatLaptop) });
  } catch {
    const featured = getFallbackLaptops().filter(l => l.featured && l.status === 'Available').slice(0, 6);
    res.json({ laptops: featured });
  }
});

// GET /api/laptops/:slug — single laptop
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const result = await pool.query('SELECT * FROM laptops WHERE slug = $1', [slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Laptop not found' });
    }
    res.json({ laptop: formatLaptop(result.rows[0]) });
  } catch {
    const laptop = getFallbackLaptops().find(l => l.slug === req.params.slug);
    if (!laptop) return res.status(404).json({ error: 'Laptop not found' });
    res.json({ laptop });
  }
});

// POST /api/laptops — create (admin)
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const data = req.body;
    const slug = generateSlug(data.brand, data.model);

    // Check slug uniqueness
    const existing = await pool.query('SELECT id FROM laptops WHERE slug = $1', [slug]);
    if (existing.rows.length > 0) {
      data.model = `${data.model} ${Date.now()}`;
    }

    const result = await pool.query(`
      INSERT INTO laptops (brand, model, slug, cpu_brand, cpu_model, cpu_generation, cpu_full, cpu_cores,
        cpu_base_clock, cpu_boost_clock, ram, storage, screen_size, screen_resolution, gpu, os,
        price, original_price, purchase_cost, grade, battery_health, battery_cycles,
        physical_notes, refurb_actions, included_items, status, on_sale, discount_percent,
        flash_sale, featured, rating, review_count, in_stock, stock)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34)
      RETURNING *
    `, [
      data.brand, data.model, slug,
      data.cpuBrand || 'Intel', data.cpuModel, data.cpuGeneration,
      data.cpuFull, data.cpuCores, data.cpuBaseClock, data.cpuBoostClock,
      data.ram, data.storage, data.screenSize, data.screenResolution,
      data.gpu, data.os, data.price, data.originalPrice, data.purchaseCost,
      data.grade, data.batteryHealth, data.batteryCycles,
      data.physicalNotes || '',
      data.refurbActions || [], data.includedItems || ['Laptop', 'Charger'],
      data.status || 'Available', data.onSale || false, data.discountPercent || 0,
      data.flashSale || false, data.featured || false,
      data.rating || 0, data.reviewCount || 0,
      data.inStock !== undefined ? data.inStock : true,
      data.stock || 0,
    ]);

    res.status(201).json({ laptop: formatLaptop(result.rows[0]) });
  } catch (err) {
    next(err);
  }
});

// PUT /api/laptops/:id — update (admin)
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const fields = [];
    const params = [];
    let paramIndex = 1;

    const fieldMap = {
      brand: 'brand', model: 'model', cpuBrand: 'cpu_brand', cpuModel: 'cpu_model',
      cpuGeneration: 'cpu_generation', cpuFull: 'cpu_full', cpuCores: 'cpu_cores',
      cpuBaseClock: 'cpu_base_clock', cpuBoostClock: 'cpu_boost_clock',
      ram: 'ram', storage: 'storage', screenSize: 'screen_size',
      screenResolution: 'screen_resolution', gpu: 'gpu', os: 'os',
      price: 'price', originalPrice: 'original_price', purchaseCost: 'purchase_cost',
      grade: 'grade', batteryHealth: 'battery_health', batteryCycles: 'battery_cycles',
      physicalNotes: 'physical_notes', refurbActions: 'refurb_actions',
      includedItems: 'included_items', status: 'status',
      onSale: 'on_sale', discountPercent: 'discount_percent',
      flashSale: 'flash_sale', featured: 'featured',
      rating: 'rating', reviewCount: 'review_count',
      inStock: 'in_stock', stock: 'stock',
    };

    for (const [camel, db] of Object.entries(fieldMap)) {
      if (data[camel] !== undefined) {
        fields.push(`${db} = $${paramIndex++}`);
        params.push(data[camel]);
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    fields.push(`updated_at = NOW()`);
    params.push(id);

    const result = await pool.query(
      `UPDATE laptops SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      params
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Laptop not found' });
    }

    res.json({ laptop: formatLaptop(result.rows[0]) });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/laptops/:id — delete (admin)
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM laptops WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Laptop not found' });
    }
    res.json({ message: 'Laptop deleted' });
  } catch (err) {
    next(err);
  }
});

function formatLaptop(row) {
  return {
    id: row.id,
    brand: row.brand,
    model: row.model,
    slug: row.slug,
    cpuBrand: row.cpu_brand,
    cpuModel: row.cpu_model,
    cpuGeneration: row.cpu_generation,
    cpuFull: row.cpu_full,
    cpuCores: row.cpu_cores,
    cpuBaseClock: row.cpu_base_clock,
    cpuBoostClock: row.cpu_boost_clock,
    ram: row.ram,
    storage: row.storage,
    screenSize: row.screen_size,
    screenResolution: row.screen_resolution,
    gpu: row.gpu,
    os: row.os,
    price: parseFloat(row.price),
    originalPrice: row.original_price ? parseFloat(row.original_price) : null,
    purchaseCost: row.purchase_cost ? parseFloat(row.purchase_cost) : null,
    grade: row.grade,
    batteryHealth: row.battery_health,
    batteryCycles: row.battery_cycles,
    physicalNotes: row.physical_notes || '',
    refurbActions: row.refurb_actions || [],
    includedItems: row.included_items || [],
    status: row.status,
    onSale: row.on_sale,
    discountPercent: row.discount_percent,
    flashSale: row.flash_sale,
    featured: row.featured,
    rating: parseFloat(row.rating) || 0,
    reviewCount: row.review_count || 0,
    inStock: row.in_stock,
    stock: row.stock,
    images: row.images || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export default router;
