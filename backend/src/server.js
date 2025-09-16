import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import healthRoutes from './routes/health.routes.js';
import presentationsRoutes from './routes/presentations.routes.js';
import skillsRoutes from './routes/skills.routes.js';
import projectsRoutes from './routes/projects.routes.js';
import certificationsRoutes from './routes/certifications.routes.js';
import cvsRoutes from './routes/cvs.routes.js';
import contactRoutes from './routes/contact.routes.js';
import { pool } from './db.js';


const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || true }));
app.use(express.json());

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/presentations', presentationsRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/certifications', certificationsRoutes);
app.use('/api/cvs', cvsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/me', authRoutes);
app.set('pool', pool);
app.use('/api/auth', authRoutes);


// Route racine pour éviter le 404 sur "/"
app.get('/', (_req, res) => {
  res.json({
    name: 'Portfolio API',
    version: '1.0.0',
    endpoints: [
      'GET /api/health',
      'GET /api/presentations?locale=fr',
      'GET /api/skills',
      'GET /api/projects?search=&page=1&limit=10&featured=0',
      'GET /api/projects/:id/images',
      'GET /api/projects/:id/skills',
      'GET /api/projects/slug/:slug',
      'GET /api/certifications',
      'GET /api/cvs?active=1'
    ]
  });
});

// 404 minimal
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
