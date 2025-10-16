/**
 * Auth API Service
 * Handles authentication-related API calls
 */

import { api } from './api';
import { AppConfig } from '../config/env';
import { ApiResponse } from '@types';

// Request types
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

// Response types
export interface AuthUser {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string | null;
}

export interface TokenResponse {
  access_token: string;
}

export interface AuthResponse {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string | null;
  token: TokenResponse;
}

export interface ProfileResponse {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string | null;
}

export interface UpdateProfileRequest {
  full_name?: string;
  phone?: string;
}

/**
 * Auth API endpoints
 */
export const authApi = {
  /**
   * Register new user
   * POST /api/v1/auth/register
   */
  register: async (
    data: RegisterRequest,
  ): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post<ApiResponse<AuthResponse>>(
      AppConfig.endpoints.auth.register,
      data,
    );
    return response;
  },

  /**
   * User login
   * POST /api/v1/auth/login
   */
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post<ApiResponse<AuthResponse>>(
      AppConfig.endpoints.auth.login,
      data,
    );
    return response;
  },

  /**
   * Get logged-in user profile
   * GET /api/v1/me
   * Requires: Authorization Bearer token
   */
  getProfile: async (): Promise<ApiResponse<ProfileResponse>> => {
    const response = await api.get<ApiResponse<ProfileResponse>>(
      AppConfig.endpoints.me,
    );
    return response;
  },

  /**
   * Update user profile
   * PUT /api/v1/me
   * Requires: Authorization Bearer token
   */
  updateProfile: async (
    data: UpdateProfileRequest,
  ): Promise<ApiResponse<ProfileResponse>> => {
    const response = await api.put<ApiResponse<ProfileResponse>>(
      AppConfig.endpoints.me,
      data,
    );
    return response;
  },
};
