/**
 * Auth State Types
 * Interface untuk state management autentikasi (tokens only)
 */

export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}
