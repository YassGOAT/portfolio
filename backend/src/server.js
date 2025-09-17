import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

import { pool } from './db.js'

import authRoutes from './routes/auth.routes.js'
import cvsRoutes from './routes/cvs.routes.js'
import presentationsRoutes from './routes/presentations.routes.js'
import skillsRoutes from './routes/skills.routes.js'
import projectsRoutes from './routes/projects.routes.js'
import certificationsRoutes from './routes/certifications.routes.js'
import contactRoutes from './routes/contact.routes.js'

const app = express()
app.set('pool', pool)

// CORS : autorise Netlify + localhost (dev)
const allowed = [
  process.env.CORS_ORIGIN,              // ex: https://portfoliohamriyassine.netlify.app
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowed.some(a => (a && origin.startsWith(a)) || (a && new RegExp(a).test?.(origin)))) {
      return cb(null, true);
    }
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))

// Static uploads
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadsRoot = path.join(__dirname, 'uploads')
fs.mkdirSync(path.join(uploadsRoot, 'cv'), { recursive: true })
app.use('/uploads', express.static(uploadsRoot))

// Health & root
app.get('/', (_req, res) => {
  res.json({
    name: 'Portfolio API',
    ok: true,
    routes: [
      '/uploads/* (static)',
      '/api/auth/*',
      '/api/cvs',
      '/api/presentations',
      '/api/skills',
      '/api/projects',
      '/api/certifications',
      '/api/contact'
    ]
  })
})
app.get('/api/health', (_req, res) => res.json({ ok: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/cvs', cvsRoutes)
app.use('/api/presentations', presentationsRoutes)
app.use('/api/skills', skillsRoutes)
app.use('/api/projects', projectsRoutes)
app.use('/api/certifications', certificationsRoutes)
app.use('/api/contact', contactRoutes)

// 404 JSON
app.use((_req, res) => res.status(404).json({ error: 'Not found' }))

// Start
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))
