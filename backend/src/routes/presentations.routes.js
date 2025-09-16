import { Router } from 'express';
import { pool } from '../db.js';
const router = Router();

// GET /api/presentations?locale=fr
router.get('/', async (req, res) => {
  const { locale } = req.query;
  try {
    const sql = `
      SELECT id_presentation, id_user, locale, headline, content_md, updated_at
      FROM presentations
      ${locale ? 'WHERE locale = ?' : ''}
      ORDER BY updated_at DESC
    `;
    const [rows] = await pool.query(sql, locale ? [locale] : []);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
