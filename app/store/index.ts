import { configureStore } from '@reduxjs/toolkit';
import { userReducer, postReducer, authReducer } from './slices';

export const store = configureStore({
  reducer: {
    user: userReducer,
    post: postReducer,
    auth: authReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
