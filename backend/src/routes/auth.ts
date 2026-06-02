import { Router, Request, Response } from 'express';
import { query } from '../lib/db';

const router = Router();

// POST /api/auth
router.post('/', async (req: Request, res: Response) => {
  try {
    const { email, name, action } = req.body;

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

      let role = 'user';
      let plan = 'Free';
      if (trimmedEmail === 'admin@buzzagency.com' || trimmedEmail.startsWith('admin@')) {
        role = 'superadmin';
        plan = 'Agency';
      }

      const insertRes = await query(
        'INSERT INTO users (name, email, plan, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [name || trimmedEmail.split('@')[0], trimmedEmail, plan, role]
      );

      return res.json({ user: insertRes.rows[0] });
    }

    if (action === 'login') {
      if (!existingUser) {
        return res.status(404).json({ error: 'No account registered under this email. Please signup first.' });
      }
      return res.json({ user: existingUser });
    }

    return res.status(400).json({ error: 'Invalid action type' });

  } catch (error: any) {
    console.error('Authentication API error:', error);
    return res.status(500).json({ error: `Server authentication failure: ${error.message || error}` });
  }
});

export default router;
