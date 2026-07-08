import { Router } from 'express';
import pool from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { getFallbackShopSettings } from '../utils/fallback.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const r = await pool.query('SELECT key, value FROM shop_settings');
    const settings = {};
    for (const row of r.rows) {
      settings[row.key] = row.value;
    }
    res.json({
      tagline: settings.tagline || '',
      subtitle: settings.subtitle || '',
      phone: settings.phone || '',
      email: settings.email || '',
      whatsapp: settings.whatsapp || '',
      address: settings.address || '',
      hours: {
        'Mon-Sat': settings['hours_Mon-Sat'] || '',
        'Sun': settings['hours_Sun'] || '',
      },
    });
  } catch {
    const fb = getFallbackShopSettings();
    res.json(fb);
  }
});

router.put('/:key', requireAuth, async (req, res, next) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    if (value === undefined) return res.status(400).json({ error: 'Value required' });
    await pool.query(
      'INSERT INTO shop_settings (key, value, updated_at) VALUES ($1, $2, NOW()) ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()',
      [key, String(value)]
    );
    res.json({ message: 'Saved' });
  } catch (err) { next(err); }
});

export default router;
