import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { query } from '../lib/db';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'buzz_geotagger_fallback_secret_key_2026';

// Rate limiter: Max 20 auth attempts per 15 minutes per IP (brute-force defense)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many authentication attempts from this IP. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(authLimiter);

// Helper to sanitize user object (strip password_hash before sending to client)
function sanitizeUser(user: any) {
  if (!user) return null;
  const { password_hash, ...safeUser } = user;
  return safeUser;
}

// POST /api/auth
router.post('/', async (req: Request, res: Response) => {
  try {
    const { email, password, name, action } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const checkRes = await query('SELECT * FROM users WHERE email = $1', [trimmedEmail]);
    const existingUser = checkRes.rows[0];

    if (action === 'signup') {
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists. Please login instead.' });
      }

      if (!password || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      let role = 'user';
      let plan = 'Free';
      // Only buzz agency domain can claim superadmin
      if (trimmedEmail === 'admin@buzzagency.com') {
        role = 'superadmin';
        plan = 'Agency';
      }

      const displayName = name || trimmedEmail.split('@')[0];
      const insertRes = await query(
        'INSERT INTO users (name, email, plan, role, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [displayName, trimmedEmail, plan, role, passwordHash]
      );

      const createdUser = insertRes.rows[0] || {
        id: 1,
        name: displayName,
        email: trimmedEmail,
        plan,
        role
      };

      const token = jwt.sign(
        { id: createdUser.id, email: createdUser.email, role: createdUser.role, plan: createdUser.plan, name: createdUser.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({ 
        user: sanitizeUser(createdUser),
        token 
      });
    }

    if (action === 'login') {
      if (!existingUser) {
        return res.status(404).json({ error: 'No account registered under this email. Please signup first.' });
      }

      if (!password) {
        return res.status(400).json({ error: 'Password is required to log in.' });
      }

      // If user has a stored password hash, verify with bcrypt
      if (existingUser.password_hash) {
        const isMatch = await bcrypt.compare(password, existingUser.password_hash);
        if (!isMatch) {
          return res.status(401).json({ error: 'Invalid password. Please check and try again.' });
        }
      } else {
        // First login for legacy seed user: hash and save their password for future security
        const newHash = await bcrypt.hash(password, 10);
        await query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, existingUser.id]);
      }

      const token = jwt.sign(
        { id: existingUser.id, email: existingUser.email, role: existingUser.role, plan: existingUser.plan, name: existingUser.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({ 
        user: sanitizeUser(existingUser),
        token 
      });
    }

    return res.status(400).json({ error: 'Invalid action type' });

  } catch (error: any) {
    console.error('Authentication API error:', error);
    return res.status(500).json({ error: `Server authentication failure: ${error.message || error}` });
  }
});

// GET /api/auth/me - Verify current session
router.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userRes = await query('SELECT id, name, email, plan, role, created_at as "createdAt" FROM users WHERE id = $1', [req.user?.id]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ user: userRes.rows[0] });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch user' });
  }
});

export default router;
