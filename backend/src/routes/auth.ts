import { Router } from 'express';
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Beautyderm2026';

// Gera hash da senha na inicialização
let adminHash: string;
(async () => {
  adminHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
})();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ success: false, error: 'Usuário e senha obrigatórios' });
      return;
    }

    const usernameOk = username === ADMIN_USERNAME;
    const passwordOk = await bcrypt.compare(String(password), adminHash);

    if (!usernameOk || !passwordOk) {
      res.status(401).json({ success: false, error: 'Credenciais inválidas' });
      return;
    }

    const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.json({ success: true, message: 'Login realizado com sucesso' });
  } catch (err) {
    console.error('[AUTH] Erro no login:', err);
    res.status(500).json({ success: false, error: 'Erro interno' });
  }
});

router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('token', { path: '/' });
  res.json({ success: true });
});

export default router;
