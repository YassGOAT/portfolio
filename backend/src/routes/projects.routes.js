import { Router } from 'express';
import { pool } from '../db.js';
const router = Router();

// GET /api/projects
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id_project, id_user, title, slug, short_desc, cover_url,
             github_url, demo_url, is_featured, sort_order, created_at, updated_at
      FROM projects
      ORDER BY is_featured DESC, sort_order ASC, created_at DESC
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/projects/:id/images
router.get('/:id/images', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id_image, image_url, alt_text, sort_order, created_at
       FROM project_images
       WHERE id_project = ? ORDER BY sort_order ASC, id_image ASC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/projects/:id/skills
router.get('/:id/skills', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.id_skill, s.name, s.category, s.level
       FROM project_skills ps
       JOIN skills s ON s.id_skill = ps.id_skill
       WHERE ps.id_project = ?
       ORDER BY s.category, s.name`,
      [req.params.id]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
