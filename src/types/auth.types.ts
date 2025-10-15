/**
 * Auth State Types
 * Interface untuk state management autentikasi
 */

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: number;
    email: string;
    name: string;
  } | null;
  token: string | null;
}
