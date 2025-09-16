import { Router } from 'express'
import { pool } from '../db.js'
import { requireAuth, requireRole } from '../middlewares/authJwt.js'
import { uploadPdf } from '../middlewares/upload.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const router = Router()

/* Répertoire des PDF (src/uploads/cv) */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadsDir = path.join(__dirname, '..', 'uploads', 'cv')

/** Renvoie l’URL publique à stocker */
function publicFilePath(filename) {
  return `/uploads/cv/${filename}`
}

/**
 * Supprime les doublons : on garde le fichier `keep` et
 * on supprime tous les autres PDF qui ont le même "base name"
 * (nom d’origine normalisé, sans timestamp et sans .pdf).
 */
function cleanupDuplicates(keepFilename) {
  const base = keepFilename.replace(/^\d+-/, '').replace(/\.pdf$/i, '')
  const files = fs.readdirSync(uploadsDir)
  for (const f of files) {
    if (f === keepFilename) continue
    if (!/\.pdf$/i.test(f)) continue
    const fBase = f.replace(/^\d+-/, '').replace(/\.pdf$/i, '')
    if (fBase === base) {
      try { fs.unlinkSync(path.join(uploadsDir, f)) } catch {}
    }
  }
}

/** GET /api/cvs?active=1 (public) */
router.get('/', async (req, res) => {
  const { active } = req.query
  try {
    const where = active ? 'WHERE is_active = 1' : ''
    const [rows] = await pool.query(
      `SELECT id_cv, id_user, label, locale, file_url, is_active, created_at, updated_at
       FROM cvs ${where}
       ORDER BY is_active DESC, created_at DESC`
    )
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

/** GET /api/cvs/:id (public) */
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' })
    const [rows] = await pool.query(
      `SELECT id_cv, id_user, label, locale, file_url, is_active, created_at, updated_at
       FROM cvs WHERE id_cv = ? LIMIT 1`,
      [id]
    )
    if (!rows.length) return res.status(404).json({ error: 'CV not found' })
    res.json(rows[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

/** POST /api/cvs (admin) — multipart/form-data (file=PDF) + label, locale, is_active */
router.post(
  '/',
  requireAuth,
  requireRole('admin'),
  uploadPdf.single('file'),
  async (req, res) => {
    try {
      const { label, locale = 'fr' } = req.body || {}
      const is_active = req.body?.is_active === '1' || req.body?.is_active === 'true' ? 1 : 0

      if (!req.file) return res.status(400).json({ error: 'PDF file is required (field "file")' })

      const id_user = req.user.id_user
      if (is_active) {
        await pool.query(`UPDATE cvs SET is_active = 0 WHERE id_user = ?`, [id_user])
      }

      // nettoie les doublons (même base name)
      cleanupDuplicates(req.file.filename)

      const file_url = publicFilePath(req.file.filename)
      const [result] = await pool.query(
        `INSERT INTO cvs (id_user, label, locale, file_url, is_active)
         VALUES (?, ?, ?, ?, ?)`,
        [id_user, label || null, locale, file_url, is_active]
      )

      const [row] = await pool.query(`SELECT * FROM cvs WHERE id_cv = ?`, [result.insertId])
      res.status(201).json(row[0])
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }
)

/** PUT /api/cvs/:id (admin) — multipart/form-data (file=PDF optionnel) */
router.put(
  '/:id',
  requireAuth,
  requireRole('admin'),
  uploadPdf.single('file'),
  async (req, res) => {
    try {
      const id_cv = Number(req.params.id)
      if (!Number.isFinite(id_cv)) return res.status(400).json({ error: 'Invalid id' })

      const id_user = req.user.id_user
      const [exist] = await pool.query(`SELECT * FROM cvs WHERE id_cv = ? AND id_user = ?`, [id_cv, id_user])
      if (!exist.length) return res.status(404).json({ error: 'CV not found' })

      const { label, locale } = req.body || {}
      const is_active_raw = req.body?.is_active
      const is_active =
        is_active_raw === undefined ? null : (is_active_raw === '1' || is_active_raw === 'true' ? 1 : 0)

      let newFileUrl = null
      if (req.file) {
        // nettoie les doublons (même base name)
        cleanupDuplicates(req.file.filename)
        newFileUrl = publicFilePath(req.file.filename)
      }

      if (is_active === 1) {
        await pool.query(`UPDATE cvs SET is_active = 0 WHERE id_user = ?`, [id_user])
      }

      await pool.query(
        `UPDATE cvs
           SET label = COALESCE(?, label),
               locale = COALESCE(?, locale),
               file_url = COALESCE(?, file_url),
               is_active = COALESCE(?, is_active)
         WHERE id_cv = ? AND id_user = ?`,
        [label ?? null, locale ?? null, newFileUrl ?? null, is_active, id_cv, id_user]
      )

      const [updated] = await pool.query(`SELECT * FROM cvs WHERE id_cv = ?`, [id_cv])
      res.json(updated[0])
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }
)

/** DELETE /api/cvs/:id (admin) — supprime UNIQUEMENT la ligne en BDD (pas le fichier) */
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const id_cv = Number(req.params.id)
    if (!Number.isFinite(id_cv)) return res.status(400).json({ error: 'Invalid id' })

    const id_user = req.user.id_user
    const [exist] = await pool.query(`SELECT * FROM cvs WHERE id_cv = ? AND id_user = ?`, [id_cv, id_user])
    if (!exist.length) return res.status(404).json({ error: 'CV not found' })

    await pool.query(`DELETE FROM cvs WHERE id_cv = ?`, [id_cv])
    res.json({ deleted: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
