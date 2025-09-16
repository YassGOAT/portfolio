import 'dotenv/config';
import { pool } from '../db.js';

export async function requireAdmin(req, res, next) {
  try {
    const token = req.header('x-admin-token');
    if (!token || token !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      return res.status(500).json({ error: 'ADMIN_EMAIL not configured' });
    }

    const [rows] = await pool.query(
      'SELECT id_user, name, email FROM users WHERE email = ? LIMIT 1',
      [adminEmail]
    );
    if (rows.length === 0) {
      return res.status(403).json({ error: 'Admin user not found in DB' });
    }

    req.adminUser = rows[0]; // { id_user, name, email }
    next();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export default requireAdmin;