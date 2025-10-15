import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from '@types';

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (
      state,
      action: PayloadAction<{
        token: string;
        refreshToken: string;
      }>,
    ) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    clearTokens: state => {
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setTokens, setAccessToken, clearTokens } = authSlice.actions;
export default authSlice.reducer;
