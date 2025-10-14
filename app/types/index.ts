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

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export type RootStackParamList = {
  Home: undefined;
  Detail: { id: number };
  Profile: undefined;
};
