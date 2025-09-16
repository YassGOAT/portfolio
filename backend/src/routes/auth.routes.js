import { Router } from 'express';
import { createUser, findUserByEmail, requireAuth, signToken, verifyPassword } from '../middlewares/authJwt.js';

const router = Router();

/**
 * POST /api/auth/register
 * body: { name, email, password }
 * crée un compte "visitor"
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email, password required' });
    }
    const exist = await findUserByEmail(email);
    if (exist) return res.status(409).json({ error: 'Email already in use' });

    const user = await createUser({ name, email, password, role: 'visitor' });
    const token = signToken(user);
    res.status(201).json({ user, token });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * POST /api/auth/login
 * body: { email, password }
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const { password_hash, ...publicUser } = user;
    const token = signToken(publicUser);
    res.json({ user: publicUser, token });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/** GET /api/auth/me */
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

/** DELETE /api/auth/me (supprimer SON compte) */
router.delete('/me', requireAuth, async (req, res) => {
  try {
    // ON DELETE CASCADE gère les dépendances (projects, etc.)
    await req.app.get('pool').query('DELETE FROM users WHERE id_user = ?', [req.user.id_user]);
    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
