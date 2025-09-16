import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

/**
 * Simple rate limit en mémoire :
 * - 1 message / 30s par IP
 * - 5 messages / heure par IP
 */
const hits = new Map(); // ip -> { last: number, window: number[] }

function rateLimit(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const now = Date.now();
  const entry = hits.get(ip) || { last: 0, window: [] };

  // 30s
  if (now - entry.last < 30_000) {
    return res.status(429).json({ error: 'Trop de requêtes. Réessaie dans quelques secondes.' });
  }

  // 1h
  entry.window = entry.window.filter(ts => now - ts < 60 * 60 * 1000);
  if (entry.window.length >= 5) {
    return res.status(429).json({ error: 'Limite horaire atteinte. Réessaie plus tard.' });
  }

  entry.last = now;
  entry.window.push(now);
  hits.set(ip, entry);
  next();
}

function isValidEmail(email) {
  // simple, suffisant pour un formulaire
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * POST /api/contact
 * Body JSON: { name, email, message }
 */
router.post('/', rateLimit, async (req, res) => {
  try {
    const { name, email, message } = req.body || {};

    // Validation côté serveur
    const errors = {};
    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 120) {
      errors.name = 'Nom requis (2–120 caractères).';
    }
    if (!email || typeof email !== 'string' || email.length > 190 || !isValidEmail(email)) {
      errors.email = 'Email invalide.';
    }
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      errors.message = 'Message requis.';
    }
    if (message && message.length > 5000) {
      errors.message = 'Message trop long (max 5000).';
    }
    if (Object.keys(errors).length) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    // Insertion
    const [result] = await pool.query(
      `INSERT INTO contact_messages (name, email, message)
       VALUES (?, ?, ?)`,
      [name.trim(), email.trim(), message.trim()]
    );

    return res.status(201).json({
      id_message: result.insertId,
      status: 'received'
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;
