import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';
import { startCronJobs } from './cron/sync.js';
import dashboardRoutes from './routes/dashboard.js';
import authRoutes from './routes/auth.js';
import { authMiddleware } from './middleware/auth.middleware.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');

// Segurança
app.use(helmet());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// Rate limit global: 200 req/min por IP
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: 'Muitas requisições. Tente novamente em breve.' },
  })
);

// Rate limit restrito para login: 10 tentativas a cada 5 min
const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Muitas tentativas de login. Aguarde 5 minutos.' },
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);

app.listen(port, async () => {
  console.log(`[SERVER] Rodando na porta ${port}`);
  await testConnection();
  startCronJobs();
});
