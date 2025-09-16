import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import healthRoutes from './routes/health.routes.js';
import presentationsRoutes from './routes/presentations.routes.js';
import skillsRoutes from './routes/skills.routes.js';
import projectsRoutes from './routes/projects.routes.js';
import certificationsRoutes from './routes/certifications.routes.js';
import cvsRoutes from './routes/cvs.routes.js';

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

// 404 minimal
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
