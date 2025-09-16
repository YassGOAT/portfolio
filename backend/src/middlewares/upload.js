import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * On enregistre dans backend/src/uploads/cv
 */
const dest = path.join(__dirname, '..', 'uploads', 'cv')  // <-- src/uploads/cv
fs.mkdirSync(dest, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, dest),
  filename: (_req, file, cb) => {
    const base = path.parse(file.originalname).name
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9._-]/g, '')
      .toLowerCase()
    const stamp = Date.now()
    cb(null, `${stamp}-${base}.pdf`)
  }
})

function fileFilter(_req, file, cb) {
  if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
    cb(null, true)
  } else {
    cb(new Error('Only PDF files are allowed'))
  }
}

export const uploadPdf = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
})
