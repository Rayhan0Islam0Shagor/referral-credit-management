import { Request, Response } from 'express';
import {
  register,
  login,
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteAccount,
} from './auth.service';
import { RegisterRequest, LoginRequest, AuthResponse } from './auth.types';

/**
 * Register a new user
 */
export const handleRegister = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userData: RegisterRequest = req.body;
    const result = await register(userData);

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    const authError: AuthResponse = {
      success: false,
      message: 'Internal server error during registration',
    };
    res.status(500).json(authError);
  }
};

/**
 * Login user
 */
export const handleLogin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const loginData: LoginRequest = req.body;
    const result = await login(loginData);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(401).json(result);
    }
  } catch (error) {
    const authError: AuthResponse = {
      success: false,
      message: 'Internal server error during login',
    };
    res.status(500).json(authError);
  }
};

/**
 * Logout user (client-side token removal)
 */
export const handleLogout = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const authResponse: AuthResponse = {
      success: true,
      message: 'Logout successful',
    };
    res.status(200).json(authResponse);
  } catch (error) {
    const authError: AuthResponse = {
      success: false,
      message: 'Internal server error during logout',
    };
    res.status(500).json(authError);
  }
};

/**
 * Get current user profile
 */
export const handleGetProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      const authError: AuthResponse = {
        success: false,
        message: 'User not authenticated',
      };
      res.status(401).json(authError);
      return;
    }

    const user = await getUserProfile(userId);
    if (!user) {
      const authError: AuthResponse = {
        success: false,
        message: 'User not found',
      };
      res.status(404).json(authError);
      return;
    }

    const authResponse: AuthResponse = {
      success: true,
      message: 'Profile retrieved successfully',
      user,
    };
    res.status(200).json(authResponse);
  } catch (error) {
    const authError: AuthResponse = {
      success: false,
      message: 'Internal server error retrieving profile',
    };
    res.status(500).json(authError);
  }
};

/**
 * Update user profile
 */
export const handleUpdateProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      const authError: AuthResponse = {
        success: false,
        message: 'User not authenticated',
      };
      res.status(401).json(authError);
      return;
    }

    const { firstName, lastName } = req.body;
    const updates: { firstName?: string; lastName?: string } = {};

    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;

    const updatedUser = await updateUserProfile(userId, updates);
    if (!updatedUser) {
      const authError: AuthResponse = {
        success: false,
        message: 'Failed to update profile',
      };
      res.status(400).json(authError);
      return;
    }

    const authResponse: AuthResponse = {
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    };
    res.status(200).json(authResponse);
  } catch (error) {
    const authError: AuthResponse = {
      success: false,
      message: 'Internal server error updating profile',
    };
    res.status(500).json(authError);
  }
};

/**
 * Change password
 */
export const handleChangePassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      const authError: AuthResponse = {
        success: false,
        message: 'User not authenticated',
      };
      res.status(401).json(authError);
      return;
    }

    const { currentPassword, newPassword } = req.body;
    const result = await changePassword(userId, currentPassword, newPassword);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    const authError: AuthResponse = {
      success: false,
      message: 'Internal server error changing password',
    };
    res.status(500).json(authError);
  }
};

/**
 * Delete user account
 */
export const handleDeleteAccount = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      const authError: AuthResponse = {
        success: false,
        message: 'User not authenticated',
      };
      res.status(401).json(authError);
      return;
    }

    const result = await deleteAccount(userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    const authError: AuthResponse = {
      success: false,
      message: 'Internal server error deleting account',
    };
    res.status(500).json(authError);
  }
};
