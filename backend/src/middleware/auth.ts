import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'buzz_geotagger_fallback_secret_key_2026';

export interface AuthUser {
  id: number;
  email: string;
  role: string;
  plan: string;
  name?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

/**
 * Middleware: Verify user is authenticated via Bearer token
 */
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Missing or invalid Bearer token.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    req.user = decoded;
    return next();
  } catch (err: any) {
    return res.status(401).json({ error: 'Session expired or invalid token. Please log in again.' });
  }
}

/**
 * Middleware: Verify user has 'superadmin' role
 */
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // First run authentication check
  requireAuth(req, res, () => {
    if (!req.user || req.user.role !== 'superadmin') {
      return res.status(403).json({ 
        error: 'Access denied. You must be an authorized Superadmin to perform this operation.' 
      });
    }
    return next();
  });
}
