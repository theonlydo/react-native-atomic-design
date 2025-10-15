/**
 * User State Types
 * Interface untuk state management user data
 */

import { User } from './index';

export interface UserState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}
