import { Router } from 'express';
import { pool } from '../db.js';
const router = Router();

// GET /api/cvs?active=1
router.get('/', async (req, res) => {
  const { active } = req.query;
  try {
    const where = active ? 'WHERE is_active = 1' : '';
    const [rows] = await pool.query(
      `SELECT id_cv, id_user, label, locale, file_url, is_active, created_at, updated_at
       FROM cvs ${where}
       ORDER BY is_active DESC, created_at DESC`
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
