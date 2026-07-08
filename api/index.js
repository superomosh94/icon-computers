import express from 'express';
import cors from 'cors';
import session from 'express-session';
import pool from '../server/db/pool.js';

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:4173',
    process.env.CLIENT_URL,
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
    'https://iconcomputerz.vercel.app',
  ].filter(Boolean),
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

// Memory store for sessions on Vercel (no DB dependency for auth)
const sessionStore = new session.MemoryStore();

app.use(session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true, httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'none' },
  proxy: true,
}));

// Health check (no DB needed)
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Dynamic route imports — only loaded when first request hits
import laptopsRouter from '../server/routes/laptops.js';
import reservationsRouter from '../server/routes/reservations.js';
import contactRouter from '../server/routes/contact.js';
import authRouter from '../server/routes/auth.js';
import sectionsRouter from '../server/routes/sections.js';
import shopSettingsRouter from '../server/routes/shopSettings.js';

app.use('/api/laptops', laptopsRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/auth', authRouter);
app.use('/api/sections', sectionsRouter);
app.use('/api/shop-settings', shopSettingsRouter);

export default app;
