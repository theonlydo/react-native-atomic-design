/**
 * Contact API Service
 * Handles all contact-related API calls
 */

import { apiClient } from './api';
import {
  ContactListParams,
  CreateContactRequest,
  UpdateContactRequest,
  ContactListResponse,
  ContactDetailResponse,
  CreateContactResponse,
  UpdateContactResponse,
  DeleteContactResponse,
  ApiResponse,
} from '@types';

export const contactApi = {
  /**
   * GET /api/v1/contacts?q=&page=1&limit=20
   * Get contact list with search and pagination
   * Requires: Authorization Bearer token
   */
  getList: async (
    params?: ContactListParams,
  ): Promise<ApiResponse<ContactListResponse>> => {
    const queryParams = {
      q: params?.q || '',
      page: params?.page || 1,
      limit: params?.limit || 20,
    };

    return apiClient.get<ApiResponse<ContactListResponse>>('/api/v1/contacts', {
      params: queryParams,
    });
  },

  /**
   * POST /api/v1/contacts
   * Add new contact
   * Requires: Authorization Bearer token
   */
  create: async (
    data: CreateContactRequest,
  ): Promise<ApiResponse<CreateContactResponse>> => {
    return apiClient.post<ApiResponse<CreateContactResponse>>(
      '/api/v1/contacts',
      data,
    );
  },

  /**
   * GET /api/v1/contacts/{id}
   * Get contact detail by ID
   * Requires: Authorization Bearer token
   */
  getById: async (id: number): Promise<ApiResponse<ContactDetailResponse>> => {
    return apiClient.get<ApiResponse<ContactDetailResponse>>(
      `/api/v1/contacts/${id}`,
    );
  },

  /**
   * PUT /api/v1/contacts/{id}
   * Update contact by ID
   * Requires: Authorization Bearer token
   */
  update: async (
    id: number,
    data: UpdateContactRequest,
  ): Promise<ApiResponse<UpdateContactResponse>> => {
    return apiClient.put<ApiResponse<UpdateContactResponse>>(
      `/api/v1/contacts/${id}`,
      data,
    );
  },

  /**
   * DELETE /api/v1/contacts/{id}
   * Delete contact by ID
   * Requires: Authorization Bearer token
   */
  delete: async (id: number): Promise<ApiResponse<DeleteContactResponse>> => {
    return apiClient.delete<ApiResponse<DeleteContactResponse>>(
      `/api/v1/contacts/${id}`,
    );
  },

  /**
   * Toggle contact favorite status
   * Helper method to update only favorite field
   */
  toggleFavorite: async (
    id: number,
    currentContact: UpdateContactRequest,
  ): Promise<ApiResponse<UpdateContactResponse>> => {
    const updatedData = {
      ...currentContact,
      favorite: currentContact.favorite === 1 ? 0 : 1,
    } as UpdateContactRequest;

    return contactApi.update(id, updatedData);
  },
};
