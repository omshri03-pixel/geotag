import { Router, Request, Response } from 'express';
import { query } from '../lib/db';

const router = Router();

// GET /api/settings - Fetch saved location presets
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;

    const dbRes = await query(
      'SELECT id, name, lat::float, lng::float, city FROM saved_locations WHERE user_id = $1 OR user_id = 1 ORDER BY name ASC',
      [userId ? parseInt(userId) : 1]
    );

    return res.json({ locations: dbRes.rows });
  } catch (error: any) {
    console.error('GET /api/settings error:', error);
    return res.status(500).json({ error: 'Failed to fetch saved locations' });
  }
});

// POST /api/settings - Save a new coordinate preset
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, lat, lng, city, userId } = req.body;

    if (!name || lat === undefined || lng === undefined) {
      return res.status(400).json({ error: 'Name, latitude, and longitude are required' });
    }

    const dbRes = await query(
      'INSERT INTO saved_locations (name, lat, lng, city, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, lat::float, lng::float, city',
      [name, parseFloat(lat), parseFloat(lng), city || '', userId ? parseInt(userId) : 1]
    );

    return res.json({ location: dbRes.rows[0] });
  } catch (error: any) {
    console.error('POST /api/settings error:', error);
    return res.status(500).json({ error: 'Failed to save preset location' });
  }
});

// DELETE /api/settings - Delete a coordinate preset
router.delete('/', async (req: Request, res: Response) => {
  try {
    const id = req.query.id as string;
    if (!id) return res.status(400).json({ error: 'Preset ID is required' });

    await query('DELETE FROM saved_locations WHERE id = $1', [parseInt(id)]);
    return res.json({ success: true });
  } catch (error: any) {
    console.error('DELETE /api/settings error:', error);
    return res.status(500).json({ error: 'Failed to delete preset location' });
  }
});

export default router;
