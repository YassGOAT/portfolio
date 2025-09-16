import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

export function signToken(user) {
  return jwt.sign(
    { sub: user.id_user, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

export async function requireAuth(req, res, next) {
  try {
    const h = req.header('authorization') || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing token' });

    const payload = jwt.verify(token, JWT_SECRET);
    const [rows] = await pool.query(
      'SELECT id_user, name, email, role FROM users WHERE id_user = ? LIMIT 1',
      [payload.sub]
    );
    if (!rows.length) return res.status(401).json({ error: 'Invalid user' });
    req.user = rows[0];
    next();
  } catch (e) {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

/* helpers pour auth routes */
export async function findUserByEmail(email) {
  const [rows] = await pool.query(
    'SELECT id_user, name, email, password_hash, role FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  return rows[0] || null;
}

export async function createUser({ name, email, password, role = 'visitor' }) {
  const hash = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    `INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
     VALUES (?, ?, ?, ?, NOW(), NOW())`,
    [name, email, hash, role]
  );
  const [rows] = await pool.query(
    'SELECT id_user, name, email, role FROM users WHERE id_user = ?',
    [result.insertId]
  );
  return rows[0];
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash || '');
}
