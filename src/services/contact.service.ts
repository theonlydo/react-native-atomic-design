/**
 * Contact API Service
 * Handles contact-related API calls
 */

import { api } from './api';
import { AppConfig } from '../config/env';
import { ApiResponse } from '@types';

// Types
export interface Contact {
  id: number;
  full_name: string;
  phone: string;
  email: string | null;
  favorite: 0 | 1; // 0 = not favorite, 1 = favorite
}

export interface ContactListResponse {
  count: number;
  page: number;
  limit: number;
  contacts: Contact[];
}

export interface ContactListParams {
  q?: string; // Search query
  page?: number; // Page number (default: 1)
  limit?: number; // Items per page (default: 20)
}

export interface CreateContactRequest {
  full_name: string;
  phone: string;
  email?: string | null;
}

export interface UpdateContactRequest {
  full_name?: string;
  phone?: string;
  email?: string | null;
  favorite?: 0 | 1;
}

/**
 * Contact API endpoints
 */
export const contactApi = {
  /**
   * Get contact list with search and pagination
   * GET /api/v1/contacts?q=&page=1&limit=20
   * Requires: Authorization Bearer token
   */
  getList: async (
    params?: ContactListParams,
  ): Promise<ApiResponse<ContactListResponse>> => {
    const response = await api.get<ApiResponse<ContactListResponse>>(
      AppConfig.endpoints.contacts,
      {
        params: {
          q: params?.q || '',
          page: params?.page || 1,
          limit: params?.limit || 20,
        },
      },
    );
    return response;
  },

  /**
   * Add new contact
   * POST /api/v1/contacts
   * Requires: Authorization Bearer token
   */
  create: async (data: CreateContactRequest): Promise<ApiResponse<Contact>> => {
    const response = await api.post<ApiResponse<Contact>>(
      AppConfig.endpoints.contacts,
      data,
    );
    return response;
  },

  /**
   * Get contact detail by ID
   * GET /api/v1/contacts/{id}
   * Requires: Authorization Bearer token
   */
  getById: async (id: number): Promise<ApiResponse<Contact>> => {
    const response = await api.get<ApiResponse<Contact>>(
      `${AppConfig.endpoints.contacts}/${id}`,
    );
    return response;
  },

  /**
   * Update contact by ID
   * PUT /api/v1/contacts/{id}
   * Requires: Authorization Bearer token
   */
  update: async (
    id: number,
    data: UpdateContactRequest,
  ): Promise<ApiResponse<Contact>> => {
    const response = await api.put<ApiResponse<Contact>>(
      `${AppConfig.endpoints.contacts}/${id}`,
      data,
    );
    return response;
  },

  /**
   * Delete contact by ID
   * DELETE /api/v1/contacts/{id}
   * Requires: Authorization Bearer token
   */
  delete: async (id: number): Promise<ApiResponse<{}>> => {
    const response = await api.delete<ApiResponse<{}>>(
      `${AppConfig.endpoints.contacts}/${id}`,
    );
    return response;
  },

  /**
   * Toggle contact favorite status
   * PUT /api/v1/contacts/{id}
   * Requires: Authorization Bearer token
   */
  toggleFavorite: async (
    id: number,
    favorite: 0 | 1,
  ): Promise<ApiResponse<Contact>> => {
    return contactApi.update(id, { favorite });
  },
};
