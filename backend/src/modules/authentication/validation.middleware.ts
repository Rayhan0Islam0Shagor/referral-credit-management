import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { authConfig } from './auth.config';
import { AuthError, ValidationError } from './auth.types';

/**
 * Validation middleware for registration
 */
export const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

  body('password')
    .isLength({ min: authConfig.password.minLength })
    .withMessage(
      `Password must be at least ${authConfig.password.minLength} characters long`,
    )
    .custom((value) => {
      if (authConfig.password.requireUppercase && !/[A-Z]/.test(value)) {
        throw new Error('Password must contain at least one uppercase letter');
      }
      if (authConfig.password.requireLowercase && !/[a-z]/.test(value)) {
        throw new Error('Password must contain at least one lowercase letter');
      }
      if (authConfig.password.requireNumbers && !/\d/.test(value)) {
        throw new Error('Password must contain at least one number');
      }
      if (
        authConfig.password.requireSpecialChars &&
        !/[!@#$%^&*(),.?":{}|<>]/.test(value)
      ) {
        throw new Error('Password must contain at least one special character');
      }
      return true;
    }),

  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),

  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
];

/**
 * Validation middleware for login
 */
export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

  body('password').notEmpty().withMessage('Password is required'),
];

/**
 * Middleware to handle validation errors
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const validationErrors: ValidationError[] = errors.array().map((error) => ({
      field: error.type === 'field' ? error.path : 'unknown',
      message: error.msg,
    }));

    const authError: AuthError = {
      success: false,
      message: 'Validation failed',
      errors: validationErrors.map((err) => err.message),
    };

    res.status(400).json(authError);
    return;
  }

  next();
};
