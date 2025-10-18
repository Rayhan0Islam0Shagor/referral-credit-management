import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { authConfig } from './auth.config';
import { JWTPayload, AuthError } from './auth.types';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Middleware to verify JWT token
 */
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    const error: AuthError = {
      success: false,
      message: 'Access token is required',
    };
    res.status(401).json(error);
    return;
  }

  try {
    if (!authConfig.jwt.secret) {
      throw new Error('JWT secret not configured');
    }
    const decoded = jwt.verify(token, authConfig.jwt.secret) as any;
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      iat: decoded.iat,
      exp: decoded.exp,
    };
    next();
  } catch (error) {
    const authError: AuthError = {
      success: false,
      message: 'Invalid or expired token',
    };
    res.status(403).json(authError);
  }
};

/**
 * Middleware to hash password
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, authConfig.bcrypt.saltRounds);
};

/**
 * Middleware to compare password
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Generate JWT token
 */
export const generateToken = (
  payload: Omit<JWTPayload, 'iat' | 'exp'>,
): string => {
  if (!authConfig.jwt.secret) {
    throw new Error('JWT secret not configured');
  }
  return jwt.sign(payload, authConfig.jwt.secret, {
    expiresIn: authConfig.jwt.expiresIn,
  } as jwt.SignOptions);
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (
  payload: Omit<JWTPayload, 'iat' | 'exp'>,
): string => {
  if (!authConfig.jwt.secret) {
    throw new Error('JWT secret not configured');
  }
  return jwt.sign(payload, authConfig.jwt.secret, {
    expiresIn: authConfig.jwt.refreshExpiresIn,
  } as jwt.SignOptions);
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): JWTPayload | null => {
  try {
    if (!authConfig.jwt.secret) {
      return null;
    }
    const decoded = jwt.verify(token, authConfig.jwt.secret) as any;
    return {
      userId: decoded.userId,
      email: decoded.email,
      iat: decoded.iat,
      exp: decoded.exp,
    };
  } catch (error) {
    return null;
  }
};

/**
 * Optional authentication middleware (doesn't fail if no token)
 */
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      if (!authConfig.jwt.secret) {
        return;
      }
      const decoded = jwt.verify(token, authConfig.jwt.secret) as any;
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        iat: decoded.iat,
        exp: decoded.exp,
      };
    } catch (error) {
      // Token is invalid, but we don't fail the request
    }
  }

  next();
};
