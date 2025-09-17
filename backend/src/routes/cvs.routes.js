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

/** Supprime tous les doublons (même basenane sans timestamp) sauf le fichier à conserver */
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

/** Supprime un fichier sur disque à partir de son file_url (/uploads/cv/xxx.pdf) */
function safeUnlinkByFileUrl(file_url) {
  try {
    if (!file_url) return
    const filename = path.basename(file_url) // xxx.pdf
    const full = path.join(uploadsDir, filename)
    if (fs.existsSync(full)) fs.unlinkSync(full)
  } catch {}
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

      // Nettoie les doublons (même base name) et garde le nouveau
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
      const [existRows] = await pool.query(`SELECT * FROM cvs WHERE id_cv = ? AND id_user = ?`, [id_cv, id_user])
      if (!existRows.length) return res.status(404).json({ error: 'CV not found' })
      const existing = existRows[0]

      const { label, locale } = req.body || {}
      const is_active_raw = req.body?.is_active
      const is_active =
        is_active_raw === undefined ? null : (is_active_raw === '1' || is_active_raw === 'true' ? 1 : 0)

      let newFileUrl = null
      if (req.file) {
        // Nettoie les doublons (même base name)
        cleanupDuplicates(req.file.filename)
        newFileUrl = publicFilePath(req.file.filename)

        // Supprime l'ancien fichier sur disque s'il n'est plus référencé ailleurs
        const oldFileUrl = existing.file_url
        if (oldFileUrl && oldFileUrl !== newFileUrl) {
          const [cnt] = await pool.query(
            'SELECT COUNT(*) AS n FROM cvs WHERE file_url = ? AND id_cv <> ?',
            [oldFileUrl, id_cv]
          )
          if ((cnt[0]?.n ?? 0) === 0) safeUnlinkByFileUrl(oldFileUrl)
        }
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

/** DELETE /api/cvs/:id (admin) — supprime la ligne ET le fichier si non référencé ailleurs */
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const id_cv = Number(req.params.id)
    if (!Number.isFinite(id_cv)) return res.status(400).json({ error: 'Invalid id' })

    const id_user = req.user.id_user
    const [existRows] = await pool.query(`SELECT * FROM cvs WHERE id_cv = ? AND id_user = ?`, [id_cv, id_user])
    if (!existRows.length) return res.status(404).json({ error: 'CV not found' })
    const existing = existRows[0]

    // Si le fichier n'est pas utilisé par un autre CV, on le supprime du disque
    if (existing.file_url) {
      const [cnt] = await pool.query(
        'SELECT COUNT(*) AS n FROM cvs WHERE file_url = ? AND id_cv <> ?',
        [existing.file_url, id_cv]
      )
      if ((cnt[0]?.n ?? 0) === 0) {
        safeUnlinkByFileUrl(existing.file_url)
      }
    }

    await pool.query(`DELETE FROM cvs WHERE id_cv = ?`, [id_cv])
    res.json({ deleted: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
