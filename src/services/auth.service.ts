/**
 * Auth API Service
 * Handles all authentication-related API calls
 */

import { apiClient } from './api';
import {
  RegisterRequest,
  LoginRequest,
  UpdateProfileRequest,
  RegisterResponse,
  LoginResponse,
  GetProfileResponse,
  UpdateProfileResponse,
  ApiResponse,
} from '@types';

export const authApi = {
  /**
   * POST /api/v1/auth/register
   * Register a new user
   */
  register: async (
    data: RegisterRequest,
  ): Promise<ApiResponse<RegisterResponse>> => {
    return apiClient.post<ApiResponse<RegisterResponse>>(
      '/api/v1/auth/register',
      data,
    );
  },

  /**
   * POST /api/v1/auth/login
   * User login
   */
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return apiClient.post<ApiResponse<LoginResponse>>(
      '/api/v1/auth/login',
      data,
    );
  },

  /**
   * GET /api/v1/me
   * Get logged-in user profile
   * Requires: Authorization Bearer token
   */
  getProfile: async (): Promise<ApiResponse<GetProfileResponse>> => {
    return apiClient.get<ApiResponse<GetProfileResponse>>('/api/v1/me');
  },

  /**
   * PUT /api/v1/me
   * Update user profile
   * Requires: Authorization Bearer token
   */
  updateProfile: async (
    data: UpdateProfileRequest,
  ): Promise<ApiResponse<UpdateProfileResponse>> => {
    return apiClient.put<ApiResponse<UpdateProfileResponse>>(
      '/api/v1/me',
      data,
    );
  },
};
