/**
 * User State Types
 * Interface untuk state management user data
 */

import { User } from './index';

export interface UserState {
  currentUser: User | null; // Logged in user
  users: User[]; // List of users (for admin/list purposes)
  selectedUser: User | null; // Selected user detail
  loading: boolean;
  error: string | null;
}
