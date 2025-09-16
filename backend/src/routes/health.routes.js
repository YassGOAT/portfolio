import { Router } from 'express';
import { pool } from '../db.js';
const router = Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ status: 'ok', db: rows[0].ok === 1 ? 'connected' : 'unknown' });
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

export default router;
