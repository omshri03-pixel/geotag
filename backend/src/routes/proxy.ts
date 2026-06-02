import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/proxy?url=...  (image proxy to avoid CORS)
router.get('/', async (req: Request, res: Response) => {
  try {
    const imageUrl = req.query.url as string;
    if (!imageUrl) return res.status(400).json({ error: 'Image URL is required' });

    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to download image' });
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    res.set({
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400'
    });

    return res.send(buffer);
  } catch (err: any) {
    console.error('Proxy image route error:', err);
    return res.status(500).json({ error: err.message || 'Failed to proxy image' });
  }
});

export default router;
