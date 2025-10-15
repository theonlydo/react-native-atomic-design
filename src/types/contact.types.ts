/**
 * Contact Types & Interfaces
 */

// ========== Contact Model ==========
export interface Contact {
  id: number;
  full_name: string;
  phone: string;
  email: string | null;
  favorite: 0 | 1; // 0 = not favorite, 1 = favorite
}

// ========== Contact Request Payloads ==========
export interface CreateContactRequest {
  full_name: string;
  phone: string;
  email?: string | null;
}

export interface UpdateContactRequest {
  full_name: string;
  phone: string;
  email?: string | null;
  favorite: 0 | 1;
}

// ========== Contact Query Parameters ==========
export interface ContactListParams {
  q?: string; // search query
  page?: number; // default: 1
  limit?: number; // default: 20
}

// ========== Contact Response Types ==========
export interface ContactListData {
  count: number;
  page: number;
  limit: number;
  contacts: Contact[];
}

export type ContactListResponse = ContactListData;
export type ContactDetailResponse = Contact;
export type CreateContactResponse = Contact;
export type UpdateContactResponse = Contact;
export type DeleteContactResponse = Record<string, never>; // Empty object

// ========== Contact State (Redux) ==========
export interface ContactState {
  contacts: Contact[];
  selectedContact: Contact | null;
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
  searchQuery: string;
}
