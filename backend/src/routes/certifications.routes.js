import { Router } from 'express';
import { pool } from '../db.js';
const router = Router();

// GET /api/certifications
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id_certification, id_user, title, issuer, issue_date, expire_date,
              credential_id, credential_url, description, created_at, updated_at
       FROM certifications
       ORDER BY issue_date DESC, id_certification DESC`
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
