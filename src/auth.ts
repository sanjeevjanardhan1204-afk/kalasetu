// Real session auth: bcrypt password verification + signed JWT session tokens. No external
// auth provider - the signing secret is generated locally on first boot and written to .env so
// nothing needs to be supplied manually.
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { Request, Response, NextFunction } from 'express';
import { findAccountByEmail, findAccountById, Account } from './db/database';

const ENV_PATH = path.resolve(process.cwd(), '.env');

function ensureJwtSecret(): string {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 32) {
    return process.env.JWT_SECRET;
  }

  const secret = crypto.randomBytes(48).toString('hex');
  const line = `JWT_SECRET=${secret}\n`;
  try {
    if (fs.existsSync(ENV_PATH)) {
      const existing = fs.readFileSync(ENV_PATH, 'utf8');
      if (!/^JWT_SECRET=/m.test(existing)) {
        fs.appendFileSync(ENV_PATH, (existing.endsWith('\n') || existing.length === 0 ? '' : '\n') + line);
      }
    } else {
      fs.writeFileSync(ENV_PATH, line);
    }
  } catch (e) {
    console.warn('[auth] Could not persist JWT_SECRET to .env (read-only filesystem?) - using an in-memory secret for this process only.', e);
  }
  process.env.JWT_SECRET = secret;
  return secret;
}

export const JWT_SECRET = ensureJwtSecret();
const TOKEN_TTL = '7d';

export interface SessionPayload {
  sub: string; // account id
  role: 'artisan' | 'consumer' | 'admin';
  email: string;
  name: string;
}

export function verifyPassword(plain: string, hash: string): boolean {
  return bcrypt.compareSync(plain, hash);
}

export function issueSessionToken(account: Account): string {
  const payload: SessionPayload = { sub: account.id, role: account.role, email: account.email, name: account.name };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_TTL });
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      session?: SessionPayload;
    }
  }
}

function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) return header.slice(7);
  return null;
}

// Attaches req.session when a valid token is present, but never rejects the request itself -
// use requireAuth/requireRole on routes that actually need to enforce it.
export function attachSession(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (token) {
    const session = verifySessionToken(token);
    if (session) req.session = session;
  }
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session) {
    return res.status(401).json({ success: false, error: 'Authentication required. Please sign in.' });
  }
  // Re-verify the account still exists (not deleted since the token was issued).
  if (!findAccountById(req.session.sub)) {
    return res.status(401).json({ success: false, error: 'Session no longer valid. Please sign in again.' });
  }
  next();
}

export function requireRole(...roles: Array<'artisan' | 'consumer' | 'admin'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session) {
      return res.status(401).json({ success: false, error: 'Authentication required. Please sign in.' });
    }
    if (!roles.includes(req.session.role)) {
      return res.status(403).json({ success: false, error: 'You do not have permission to perform this action.' });
    }
    next();
  };
}

export { findAccountByEmail };
