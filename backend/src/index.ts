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

const app = express();
const PORT = parseInt(process.env.PORT || '4000', 10);

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin) || 
                      /^http:\/\/192\.168\.\d+\.\d+:3000$/.test(origin) ||
                      /^http:\/\/10\.\d+\.\d+\.\d+:3000$/.test(origin) ||
                      /^http:\/\/172\.(1[6-9]|2\d|3[01])\.\d+\.\d+:3000$/.test(origin) ||
                      origin.endsWith('.vercel.app');
                      
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(null, false); // Fail silently or pass false to let browser block it
    }
  },
  credentials: true,
}));

// Regular JSON body parser (for non-file routes)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Routes ───────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/process', processRouter);
app.use('/api/ai', aiRouter);
app.use('/api/scrape', scrapeRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/proxy', proxyRouter);

// ── Health check ─────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Start server ──────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 GeoTagger Backend running at:`);
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`   Network: http://0.0.0.0:${PORT}\n`);
});

export default app;
