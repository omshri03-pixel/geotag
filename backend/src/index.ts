import 'dotenv/config';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import express from 'express';
import cors from 'cors';

import authRouter from './routes/auth';
import projectsRouter from './routes/projects';
import processRouter from './routes/process';
import aiRouter from './routes/ai';
import scrapeRouter from './routes/scrape';
import settingsRouter from './routes/settings';
import adminRouter from './routes/admin';
import proxyRouter from './routes/proxy';
import gmapsRouter from './routes/gmaps';

const app = express();
const PORT = parseInt(process.env.PORT || '4000', 10);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, mobile apps)
    if (!origin) return callback(null, true);

    const isAllowed =
      // Any localhost port (Next.js may use 3001, 3002, etc when 3000 is taken)
      /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
      // LAN IPs — any port
      /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/.test(origin) ||
      /^http:\/\/10\.\d+\.\d+\.\d+(:\d+)?$/.test(origin) ||
      /^http:\/\/172\.(1[6-9]|2\d|3[01])\.\d+\.\d+(:\d+)?$/.test(origin) ||
      // Vercel deployments
      origin.endsWith('.vercel.app') ||
      // Explicit FRONTEND_URL override
      (process.env.FRONTEND_URL ? origin === process.env.FRONTEND_URL : false);

    callback(null, isAllowed);
  },
  credentials: true,
}));

// Regular JSON body parser (for non-file routes)
app.use(express.json({ limit: '1gb' }));
app.use(express.urlencoded({ extended: true, limit: '1gb' }));

// ── Routes ───────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/process', processRouter);
app.use('/api/ai', aiRouter);
app.use('/api/scrape', scrapeRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/proxy', proxyRouter);
app.use('/api/gmaps', gmapsRouter);

import { query } from './lib/db';

// ── Health check ─────────────────────────────────────────────
app.get('/health', async (req, res) => {
  try {
    // Use a 3-second timeout so the endpoint never hangs
    const dbRes = await Promise.race([
      query('SELECT NOW()'),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('DB timeout')), 3000)
      )
    ]);
    res.json({ 
      status: 'ok', 
      database: 'connected',
      time: (dbRes as any).rows[0]?.now,
      timestamp: new Date().toISOString() 
    });
  } catch (err: any) {
    res.status(503).json({ 
      status: 'error', 
      database: 'disconnected',
      error: err.message || err,
      timestamp: new Date().toISOString() 
    });
  }
});

// ── Start server ──────────────────────────────────────────────
import { exiftool } from 'exiftool-vendored';

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 GeoTagger Backend running at:`);
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`   Network: http://0.0.0.0:${PORT}\n`);
});

// Graceful cleanup on shutdown (prevents zombie exiftool child processes)
const handleShutdown = async (signal: string) => {
  console.log(`\nReceived ${signal}. Shutting down cleanly...`);
  server.close(async () => {
    try {
      await exiftool.end();
      console.log('ExifTool processes terminated.');
    } catch (err) {
      console.error('Error terminating ExifTool:', err);
    }
    process.exit(0);
  });
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

export default app;
