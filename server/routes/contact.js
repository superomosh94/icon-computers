import { Router } from 'express';
import pool from '../db/pool.js';
import { sendContactNotification } from '../utils/email.js';

const router = Router();

// POST /api/contact — contact form
router.post('/', async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ error: 'Name and message are required' });
    }

    const result = await pool.query(
      'INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3) RETURNING *',
      [name, email || '', message]
    );

    // Send notification (non-blocking)
    sendContactNotification({ name, email, message }).catch(console.error);

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
