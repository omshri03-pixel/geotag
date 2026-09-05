import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiter: Max 20 scrapes per 15 minutes per IP
const scrapeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many scrape requests from this IP. Please try again in a few minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(scrapeLimiter);

// Helper to block internal SSRF targets
function isPrivateOrLocalHost(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);
    const host = parsed.hostname.toLowerCase();
    return (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '0.0.0.0' ||
      host === '::1' ||
      host.startsWith('10.') ||
      host.startsWith('192.168.') ||
      host.startsWith('172.16.') ||
      host.startsWith('169.254.') // AWS/GCP/Azure instance metadata
    );
  } catch {
    return true;
  }
}

// GET /api/scrape?url=...
router.get('/', async (req: Request, res: Response) => {
  try {
    const targetUrl = req.query.url as string;
    if (!targetUrl) return res.status(400).json({ error: 'URL query parameter is required' });

    let cleanUrl = targetUrl.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }

    if (isPrivateOrLocalHost(cleanUrl)) {
      return res.status(403).json({ error: 'Scraping internal or private networks is strictly prohibited.' });
    }

    const response = await fetch(cleanUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    });

    if (!response.ok) {
      return res.status(400).json({ error: `Failed to fetch URL. HTTP status ${response.status}` });
    }

    const html = await response.text();
    const images: string[] = [];
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
    let match;
    const parsedUrl = new URL(cleanUrl);
    const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;

    while ((match = imgRegex.exec(html)) !== null) {
      let imgSrc = match[1].trim();
      if (imgSrc.startsWith('data:image/')) continue;
      if (imgSrc.startsWith('//')) imgSrc = parsedUrl.protocol + imgSrc;
      else if (imgSrc.startsWith('/')) imgSrc = baseUrl + imgSrc;
      else if (!imgSrc.startsWith('http://') && !imgSrc.startsWith('https://')) {
        const directory = parsedUrl.pathname.substring(0, parsedUrl.pathname.lastIndexOf('/') + 1);
        imgSrc = baseUrl + directory + imgSrc;
      }
      if (!images.includes(imgSrc)) images.push(imgSrc);
    }

    const dataSrcRegex = /data-src=["']([^"']+)["']/g;
    while ((match = dataSrcRegex.exec(html)) !== null) {
      let imgSrc = match[1].trim();
      if (imgSrc.startsWith('data:image/')) continue;
      if (imgSrc.startsWith('//')) imgSrc = parsedUrl.protocol + imgSrc;
      else if (imgSrc.startsWith('/')) imgSrc = baseUrl + imgSrc;
      else if (!imgSrc.startsWith('http://') && !imgSrc.startsWith('https://')) {
        const directory = parsedUrl.pathname.substring(0, parsedUrl.pathname.lastIndexOf('/') + 1);
        imgSrc = baseUrl + directory + imgSrc;
      }
      if (!images.includes(imgSrc)) images.push(imgSrc);
    }

    return res.json({ images: images.slice(0, 50) });
  } catch (err: any) {
    console.error('Scraper route error:', err);
    return res.status(500).json({ error: err.message || 'Failed to parse website' });
  }
});

export default router;
