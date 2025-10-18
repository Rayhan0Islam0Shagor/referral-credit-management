import { UserModel } from './user.model';
import {
  hashPassword,
  comparePassword,
  generateToken,
} from './auth.middleware';
import {
  User,
  UserPublic,
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  AuthError,
} from './auth.types';
import { ReferralModel } from '../referral/referral.model';

/**
 * Convert Mongoose document to User type
 */
const toUser = (doc: any): User => ({
  id: doc._id.toString(),
  email: doc.email,
  password: doc.password,
  firstName: doc.firstName,
  lastName: doc.lastName,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

/**
 * Convert User to UserPublic (remove password)
 */
const toUserPublic = (user: User): UserPublic => {
  const { password, ...userPublic } = user;
  return userPublic;
};

/**
 * Register a new user
 */
export const register = async (
  userData: RegisterRequest,
): Promise<AuthResponse> => {
  try {
    // Check if user already exists
    const existingUser = await UserModel.findByEmail(userData.email);
    if (existingUser) {
      const error: AuthError = {
        success: false,
        message: 'User with this email already exists',
      };
      return error;
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password);

    // Create user directly with Mongoose
    const user = new UserModel({
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
    });

    const savedUser = await user.save();

    // Handle referral if referral code is provided
    let referralInfo = undefined;
    if (userData.referralCode) {
      try {
        // Find referral by code
        const referral = await ReferralModel.findByReferralCode(
          userData.referralCode,
        );
        if (referral) {
          // Create referral relationship with the original referral code
          const newReferral = new ReferralModel({
            referrerId: referral.referrerId,
            referredId: (savedUser._id as any).toString(),
            referralCode: userData.referralCode, // Use the original referral code
            status: 'pending',
            creditsEarned: 0,
          });

          await newReferral.save();

          referralInfo = {
            referrerId: referral.referrerId,
            referralCode: userData.referralCode,
            creditsEarned: 0, // Will be updated when user makes first purchase
          };
        }
      } catch (referralError) {
        // Log referral error but don't fail registration
        console.error('Referral tracking error:', referralError);
      }
    }

    // Generate token
    const token = generateToken({
      userId: (savedUser._id as any).toString(),
      email: savedUser.email,
    });

    return {
      success: true,
      message: 'User registered successfully',
      user: toUserPublic(toUser(savedUser)),
      token,
      referralInfo,
    };
  } catch (error) {
    const authError: AuthError = {
      success: false,
      message: 'Registration failed',
    };
    return authError;
  }
};

/**
 * Login user
 */
export const login = async (loginData: LoginRequest): Promise<AuthResponse> => {
  try {
    // Find user by email directly with Mongoose
    const user = await UserModel.findByEmail(loginData.email);
    if (!user) {
      const error: AuthError = {
        success: false,
        message: 'Invalid email or password',
      };
      return error;
    }

    // Verify password
    const isPasswordValid = await comparePassword(
      loginData.password,
      user.password,
    );
    if (!isPasswordValid) {
      const error: AuthError = {
        success: false,
        message: 'Invalid email or password',
      };
      return error;
    }

    // Generate token
    const token = generateToken({
      userId: (user._id as any).toString(),
      email: user.email,
    });

    return {
      success: true,
      message: 'Login successful',
      user: toUserPublic(toUser(user)),
      token,
    };
  } catch (error) {
    const authError: AuthError = {
      success: false,
      message: 'Login failed',
    };
    return authError;
  }
};

/**
 * Get user profile
 */
export const getUserProfile = async (
  userId: string,
): Promise<UserPublic | null> => {
  try {
    const user = await UserModel.findById(userId);
    return user ? toUserPublic(toUser(user)) : null;
  } catch (error) {
    return null;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  userId: string,
  updates: Partial<Pick<User, 'firstName' | 'lastName'>>,
): Promise<UserPublic | null> => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true },
    );

    return updatedUser ? toUserPublic(toUser(updatedUser)) : null;
  } catch (error) {
    return null;
  }
};

/**
 * Change password
 */
export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<AuthResponse> => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      const error: AuthError = {
        success: false,
        message: 'User not found',
      };
      return error;
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      const error: AuthError = {
        success: false,
        message: 'Current password is incorrect',
      };
      return error;
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password directly with Mongoose
    await UserModel.findByIdAndUpdate(userId, {
      password: hashedNewPassword,
      updatedAt: new Date(),
    });

    return {
      success: true,
      message: 'Password changed successfully',
    };
  } catch (error) {
    const authError: AuthError = {
      success: false,
      message: 'Password change failed',
    };
    return authError;
  }
};

/**
 * Delete user account
 */
export const deleteAccount = async (userId: string): Promise<AuthResponse> => {
  try {
    const result = await UserModel.findByIdAndDelete(userId);
    if (!result) {
      const error: AuthError = {
        success: false,
        message: 'User not found',
      };
      return error;
    }

    return {
      success: true,
      message: 'Account deleted successfully',
    };
  } catch (error) {
    const authError: AuthError = {
      success: false,
      message: 'Account deletion failed',
    };
    return authError;
  }
};

/**
 * Check if email exists
 */
export const emailExists = async (email: string): Promise<boolean> => {
  try {
    const exists = await UserModel.emailExists(email);
    return !!exists;
  } catch (error) {
    return false;
  }
};

/**
 * Get all users (admin function)
 */
export const getAllUsers = async (
  limit: number = 10,
  skip: number = 0,
): Promise<UserPublic[]> => {
  try {
    const users = await UserModel.find()
      .select('-password')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    return users.map((user) => toUserPublic(toUser(user)));
  } catch (error) {
    return [];
  }
};

/**
 * Get user count (admin function)
 */
export const getUserCount = async (): Promise<number> => {
  try {
    return await UserModel.countDocuments();
  } catch (error) {
    return 0;
  }
};
