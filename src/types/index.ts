export interface User {
  id: number;
  name: string;
  email: string;
  username?: string;
  phone?: string;
  website?: string;
}

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface ApiResponse<T = any> {
  status: 1 | 0; // 1 = success, 0 = error
  status_code: number;
  message: string;
  data: T;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export type RootStackParamList = {
  Home: undefined;
  Detail: { id?: number }; // Make id optional for tab navigation
  Profile: undefined;
};

// Export Redux state types
export * from './auth.types';
export * from './contact.types';
export * from './user.types';
export * from './post.types';
export * from './config.types';
