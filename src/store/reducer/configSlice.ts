import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@store';
import { Language, ConfigState } from '@types';

const initialState: ConfigState = {
  language: 'id', // Default bahasa Indonesia
  theme: 'light',
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    resetConfig: () => initialState,
  },
});

export const { setLanguage, setTheme, resetConfig } = configSlice.actions;

// Selectors
export const selectLanguage = (state: RootState) => state.config.language;
export const selectTheme = (state: RootState) => state.config.theme;
export const selectConfig = (state: RootState) => state.config;

export default configSlice.reducer;
