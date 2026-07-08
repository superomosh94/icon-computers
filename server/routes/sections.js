import { Router } from 'express';
import pool from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { getFallbackSections } from '../utils/fallback.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { all } = req.query;
    const isAdmin = req.session?.userId;
    let query;
    if (isAdmin && all === 'true') {
      query = 'SELECT * FROM site_sections ORDER BY sort_order ASC, id ASC';
    } else {
      query = 'SELECT * FROM site_sections WHERE is_active = true ORDER BY sort_order ASC, id ASC';
    }
    const result = await pool.query(query);
    res.json({ sections: result.rows.map(formatSection) });
  } catch {
    const fb = getFallbackSections();
    const { all } = req.query;
    const filtered = all === 'true' ? fb : fb.filter(s => s.isActive !== false);
    res.json({ sections: filtered });
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { sectionType, title, subtitle, content, linkUrl, linkText, isActive, sortOrder } = req.body;
    const result = await pool.query(`
      INSERT INTO site_sections (section_type, title, subtitle, content, link_url, link_text, is_active, sort_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
    `, [
      sectionType || 'banner', title || '', subtitle || '', content || '',
      linkUrl || '', linkText || '', isActive !== false, sortOrder || 0,
    ]);
    res.status(201).json({ section: formatSection(result.rows[0]) });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = [];
    const params = [];
    let paramIndex = 1;

    const fieldMap = {
      sectionType: 'section_type', title: 'title', subtitle: 'subtitle',
      content: 'content', linkUrl: 'link_url', linkText: 'link_text',
      isActive: 'is_active', sortOrder: 'sort_order',
    };

    for (const [camel, db] of Object.entries(fieldMap)) {
      if (req.body[camel] !== undefined) {
        fields.push(`${db} = $${paramIndex++}`);
        params.push(req.body[camel]);
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    fields.push('updated_at = NOW()');
    params.push(id);

    const result = await pool.query(
      `UPDATE site_sections SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      params
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Section not found' });
    }

    res.json({ section: formatSection(result.rows[0]) });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM site_sections WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Section not found' });
    }
    res.json({ message: 'Section deleted' });
  } catch (err) {
    next(err);
  }
});

function formatSection(row) {
  return {
    id: row.id,
    sectionType: row.section_type,
    title: row.title,
    subtitle: row.subtitle,
    content: row.content,
    linkUrl: row.link_url,
    linkText: row.link_text,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export default router;
