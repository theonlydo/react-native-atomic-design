import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, UserProfile } from '@types';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setCredentials: (
      state,
      action: PayloadAction<{
        user: UserProfile;
        token: string;
      }>,
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
    },
    login: (
      state,
      action: PayloadAction<{
        user: UserProfile;
        token: string;
      }>,
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
    },
    logout: state => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },
    updateProfile: (state, action: PayloadAction<UserProfile>) => {
      if (state.user) {
        state.user = action.payload;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setCredentials,
  login,
  logout,
  updateProfile,
} = authSlice.actions;
export default authSlice.reducer;
