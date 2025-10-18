import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  handleRegister,
  handleLogin,
  handleLogout,
  handleGetProfile,
  handleUpdateProfile,
  handleChangePassword,
  handleDeleteAccount,
} from './auth.controller';
import { authenticateToken } from './auth.middleware';
import {
  validateRegistration,
  validateLogin,
  handleValidationErrors,
} from './validation.middleware';
import { authConfig } from './auth.config';

const router = Router();

// Rate limiting for authentication endpoints
const authRateLimit = rateLimit({
  windowMs: authConfig.rateLimit.windowMs,
  max: authConfig.rateLimit.max,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all auth routes
router.use(authRateLimit);

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  validateRegistration,
  handleValidationErrors,
  handleRegister,
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validateLogin, handleValidationErrors, handleLogin);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticateToken, handleLogout);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticateToken, handleGetProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticateToken, handleUpdateProfile);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put('/change-password', authenticateToken, handleChangePassword);

/**
 * @route   DELETE /api/auth/account
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/account', authenticateToken, handleDeleteAccount);

export default router;
