export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPublic {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  referralCode?: string; // Optional referral code
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: UserPublic;
  token?: string;
  referralInfo?: {
    referrerId: string;
    referralCode: string;
    creditsEarned: number;
  };
}

export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthError {
  success: false;
  message: string;
  errors?: string[];
}

export interface ValidationError {
  field: string;
  message: string;
}
