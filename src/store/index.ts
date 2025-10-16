import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';
import { userReducer, postReducer, authReducer } from './reducer';
import configReducer from './reducer/configSlice';

// Konfigurasi persist untuk config slice
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['config', 'auth', 'user'], // Persist config dan auth slice (termasuk token)
};

const rootReducer = combineReducers({
  user: userReducer,
  post: postReducer,
  auth: authReducer,
  config: configReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
