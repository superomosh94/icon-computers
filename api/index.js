import express from 'express';
import cors from 'cors';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
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

app.use(session({
  store: new (pgSession(session))({ pool, tableName: 'sessions', createTableIfMissing: true }),
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true, httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'none' },
}));

// API routes
import laptopsRouter from '../server/routes/laptops.js';
import reservationsRouter from '../server/routes/reservations.js';
import contactRouter from '../server/routes/contact.js';
import authRouter from '../server/routes/auth.js';
import flashSalesRouter from '../server/routes/flashSales.js';
import sectionsRouter from '../server/routes/sections.js';
import shopSettingsRouter from '../server/routes/shopSettings.js';

app.use('/api/laptops', laptopsRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/auth', authRouter);
app.use('/api/flash-sales', flashSalesRouter);
app.use('/api/sections', sectionsRouter);
app.use('/api/shop-settings', shopSettingsRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

export default app;
