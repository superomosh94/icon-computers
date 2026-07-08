import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pool from './db/pool.js';
import laptopsRouter from './routes/laptops.js';
import reservationsRouter from './routes/reservations.js';
import contactRouter from './routes/contact.js';
import authRouter from './routes/auth.js';
import flashSalesRouter from './routes/flashSales.js';
import sectionsRouter from './routes/sections.js';
import shopSettingsRouter from './routes/shopSettings.js';
import uploadRouter from './routes/upload.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Security
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));

// CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.CLIENT_URL,
  process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
  'https://icon-computers.vercel.app',
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Compression
app.use(compression());

// Logging
app.use(morgan('dev'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Session
app.use(session({
  store: new (pgSession(session))({
    pool,
    tableName: 'sessions',
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  },
}));

// Static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// In production, serve the built frontend
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return;
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// API routes
app.use('/api/laptops', laptopsRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/auth', authRouter);
app.use('/api/flash-sales', flashSalesRouter);
app.use('/api/sections', sectionsRouter);
app.use('/api/shop-settings', shopSettingsRouter);
app.use('/api/upload', uploadRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
