import { Router } from 'express';
import { pool } from '../db.js';
const router = Router();

// GET /api/skills
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id_skill, name, category, level FROM skills ORDER BY category, name'
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
