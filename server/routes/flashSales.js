import { Router } from 'express';
import pool from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM flash_sales ORDER BY created_at DESC');
    res.json({ flashSales: result.rows.map(format) });
  } catch (err) { next(err); }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { name, discountPercent, startDate, endDate, productIds, isActive } = req.body;
    const result = await pool.query(
      'INSERT INTO flash_sales (name, discount_percent, start_date, end_date, product_ids, is_active) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [name || '', discountPercent || 0, startDate || null, endDate || null, productIds || [], isActive !== false]
    );
    res.status(201).json({ flashSale: format(result.rows[0]) });
  } catch (err) { next(err); }
});

router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const fields = []; const params = []; let i = 1;
    const map = { name: 'name', discountPercent: 'discount_percent', startDate: 'start_date', endDate: 'end_date', productIds: 'product_ids', isActive: 'is_active' };
    for (const [c, d] of Object.entries(map)) {
      if (req.body[c] !== undefined) { fields.push(`${d}=$${i++}`); params.push(req.body[c]); }
    }
    if (!fields.length) return res.status(400).json({ error: 'No fields' });
    fields.push('updated_at=NOW()');
    params.push(req.params.id);
    const r = await pool.query(`UPDATE flash_sales SET ${fields.join(',')} WHERE id=$${i} RETURNING *`, params);
    if (!r.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json({ flashSale: format(r.rows[0]) });
  } catch (err) { next(err); }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const r = await pool.query('DELETE FROM flash_sales WHERE id=$1 RETURNING id', [req.params.id]);
    if (!r.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
});

function format(r) {
  return { id: r.id, name: r.name, discountPercent: r.discount_percent, startDate: r.start_date, endDate: r.end_date, productIds: r.product_ids || [], isActive: r.is_active, createdAt: r.created_at, updatedAt: r.updated_at };
}

export default router;
