import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

/**
 * GET /api/projects
 * Query:
 *  - page (default 1)
 *  - limit (default 10)
 *  - featured (0/1)
 *  - search (string in title or short_desc)
 */
router.get('/', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page ?? '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit ?? '10', 10), 1), 100);
    const offset = (page - 1) * limit;
    const featured = req.query.featured === '1' ? 1 : undefined;
    const search = (req.query.search || '').trim();

    // WHERE dynamique
    const where = [];
    const params = [];

    if (featured !== undefined) {
      where.push('is_featured = ?');
      params.push(featured);
    }
    if (search) {
      where.push('(title LIKE ? OR short_desc LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    // total
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM projects ${whereSql}`,
      params
    );

    // data page
    const [rows] = await pool.query(
      `
      SELECT id_project, id_user, title, slug, short_desc, cover_url,
             github_url, demo_url, is_featured, sort_order, created_at, updated_at
      FROM projects
      ${whereSql}
      ORDER BY is_featured DESC, sort_order ASC, created_at DESC
      LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    res.json({
      data: rows,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * GET /api/projects/:id/images
 */
router.get('/:id/images', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id_image, image_url, alt_text, sort_order, created_at
       FROM project_images
       WHERE id_project = ?
       ORDER BY sort_order ASC, id_image ASC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * GET /api/projects/:id/skills
 */
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

/**
 * GET /api/projects/slug/:slug
 * (séparé pour ne pas entrer en conflit avec :id)
 */
router.get('/slug/:slug', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id_project, id_user, title, slug, short_desc, long_desc, cover_url,
              github_url, demo_url, is_featured, sort_order, created_at, updated_at
       FROM projects
       WHERE slug = ?
       LIMIT 1`,
      [req.params.slug]
    );
    if (!rows.length) return res.status(404).json({ error: 'Project not found' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
