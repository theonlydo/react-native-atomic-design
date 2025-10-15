/**
 * Auth Types & Interfaces
 */

// ========== User Profile ==========
export interface UserProfile {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string | null;
}

// ========== Auth Token ==========
export interface AuthToken {
  access_token: string;
}

export interface AuthUser extends UserProfile {
  token: AuthToken;
}

// ========== Auth Request Payloads ==========
export interface RegisterRequest {
  full_name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  full_name: string;
  phone: string;
}

// ========== Auth Response Types ==========
export type RegisterResponse = UserProfile;
export type LoginResponse = AuthUser;
export type GetProfileResponse = UserProfile;
export type UpdateProfileResponse = UserProfile;

// ========== Validation Error Type ==========
export interface ValidationErrors {
  [field: string]: string[];
}

// ========== Auth State (Redux) ==========
export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
