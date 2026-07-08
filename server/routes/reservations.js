import { Router } from 'express';
import pool from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { sendReservationNotification, sendReservationConfirmation } from '../utils/email.js';

const router = Router();

// GET /api/reservations — list all (admin)
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM reservations';
    let params = [];
    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.json({ reservations: result.rows.map(formatReservation) });
  } catch (err) {
    next(err);
  }
});

// POST /api/reservations — create reservation
router.post('/', async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { customerName, customerPhone, customerEmail, laptopId, laptopName, laptopSlug } = req.body;

    if (!customerName || !customerPhone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }
    if (customerPhone.replace(/\D/g, '').length < 9) {
      return res.status(400).json({ error: 'Phone number must be at least 9 digits' });
    }

    await client.query('BEGIN');

    // Insert reservation
    const result = await client.query(`
      INSERT INTO reservations (customer_name, customer_phone, customer_email, laptop_id, laptop_name, laptop_slug, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'Pending')
      RETURNING *
    `, [customerName, customerPhone, customerEmail || '', laptopId, laptopName, laptopSlug]);

    // Update laptop status to Reserved
    if (laptopId) {
      await client.query(
        'UPDATE laptops SET status = $1, in_stock = $2, stock = 0, updated_at = NOW() WHERE id = $3 AND status = $4',
        ['Reserved', false, laptopId, 'Available']
      );
    }

    await client.query('COMMIT');

    // Send notifications (non-blocking)
    sendReservationNotification({ customerName, customerPhone, customerEmail, laptopName }).catch(console.error);
    sendReservationConfirmation({ customerName, customerEmail, laptopName }).catch(console.error);

    res.status(201).json({ reservation: formatReservation(result.rows[0]) });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

// PUT /api/reservations/:id — update status (admin)
router.put('/:id', requireAuth, async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Picked Up', 'Expired'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await client.query('BEGIN');

    const result = await client.query(`
      UPDATE reservations SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *
    `, [status, id]);

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Reservation not found' });
    }

    const reservation = result.rows[0];

    // If picked up or expired, release the laptop
    if (reservation.laptop_id && (status === 'Picked Up' || status === 'Expired')) {
      await client.query(
        'UPDATE laptops SET status = $1, in_stock = $2, stock = 1, updated_at = NOW() WHERE id = $3 AND status = $4',
        ['Available', true, reservation.laptop_id, 'Reserved']
      );
    }

    await client.query('COMMIT');

    res.json({ reservation: formatReservation(result.rows[0]) });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

// DELETE /api/reservations/:id — delete (admin)
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM reservations WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json({ message: 'Reservation deleted' });
  } catch (err) {
    next(err);
  }
});

function formatReservation(row) {
  return {
    id: row.id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email,
    laptopId: row.laptop_id,
    laptopName: row.laptop_name,
    laptopSlug: row.laptop_slug,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export default router;
