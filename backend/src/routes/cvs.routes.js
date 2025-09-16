import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth, requireRole } from '../middlewares/authJwt.js';

const router = Router();

/**
 * GET /api/cvs?active=1
 * Public: liste des CVs (option: seulement l'actif)
 */
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

/**
 * GET /api/cvs/:id
 * Public: détail d'un CV
 */
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' });

    const [rows] = await pool.query(
      `SELECT id_cv, id_user, label, locale, file_url, is_active, created_at, updated_at
       FROM cvs WHERE id_cv = ? LIMIT 1`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'CV not found' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * POST /api/cvs
 * Body: { label, locale, file_url, is_active }
 * Admin only
 */
router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { label, locale = 'fr', file_url, is_active = 0 } = req.body || {};
    if (!file_url || typeof file_url !== 'string') {
      return res.status(400).json({ error: 'file_url is required' });
    }

    const id_user = req.user.id_user;

    // Un seul CV actif par user
    if (is_active) {
      await pool.query(`UPDATE cvs SET is_active = 0 WHERE id_user = ?`, [id_user]);
    }

    const [result] = await pool.query(
      `INSERT INTO cvs (id_user, label, locale, file_url, is_active)
       VALUES (?, ?, ?, ?, ?)`,
      [id_user, label || null, locale, file_url, is_active ? 1 : 0]
    );

    const [row] = await pool.query(`SELECT * FROM cvs WHERE id_cv = ?`, [result.insertId]);
    res.status(201).json(row[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * PUT /api/cvs/:id
 * Body: { label?, locale?, file_url?, is_active? }
 * Admin only
 */
router.put('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const id_cv = Number(req.params.id);
    if (!Number.isFinite(id_cv)) return res.status(400).json({ error: 'Invalid id' });

    const id_user = req.user.id_user;

    const [exist] = await pool.query(
      `SELECT * FROM cvs WHERE id_cv = ? AND id_user = ?`,
      [id_cv, id_user]
    );
    if (!exist.length) return res.status(404).json({ error: 'CV not found' });

    const { label, locale, file_url, is_active } = req.body || {};

    if (is_active === 1 || is_active === true) {
      await pool.query(`UPDATE cvs SET is_active = 0 WHERE id_user = ?`, [id_user]);
    }

    await pool.query(
      `UPDATE cvs
         SET label = COALESCE(?, label),
             locale = COALESCE(?, locale),
             file_url = COALESCE(?, file_url),
             is_active = COALESCE(?, is_active)
       WHERE id_cv = ? AND id_user = ?`,
      [
        label ?? null,
        locale ?? null,
        file_url ?? null,
        typeof is_active === 'boolean' ? (is_active ? 1 : 0) :
        (Number.isFinite(is_active) ? Number(is_active) : null),
        id_cv,
        id_user
      ]
    );

    const [updated] = await pool.query(`SELECT * FROM cvs WHERE id_cv = ?`, [id_cv]);
    res.json(updated[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * DELETE /api/cvs/:id
 * Admin only
 */
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const id_cv = Number(req.params.id);
    if (!Number.isFinite(id_cv)) return res.status(400).json({ error: 'Invalid id' });

    const id_user = req.user.id_user;

    const [exist] = await pool.query(
      `SELECT * FROM cvs WHERE id_cv = ? AND id_user = ?`,
      [id_cv, id_user]
    );
    if (!exist.length) return res.status(404).json({ error: 'CV not found' });

    await pool.query(`DELETE FROM cvs WHERE id_cv = ?`, [id_cv]);
    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
