import { apiClient } from './api';
import { User, Post } from '@types';

export const userService = {
  /**
   * Get all users
   */
  getUsers: async (): Promise<User[]> => {
    return apiClient.get<User[]>('/users');
  },

  /**
   * Get user by ID
   */
  getUserById: async (id: number): Promise<User> => {
    return apiClient.get<User>(`/users/${id}`);
  },

  /**
   * Create new user
   */
  createUser: async (user: Omit<User, 'id'>): Promise<User> => {
    return apiClient.post<User>('/users', user);
  },

  /**
   * Update user
   */
  updateUser: async (id: number, user: Partial<User>): Promise<User> => {
    return apiClient.put<User>(`/users/${id}`, user);
  },

  /**
   * Delete user
   */
  deleteUser: async (id: number): Promise<void> => {
    return apiClient.delete(`/users/${id}`);
  },
};

export const postService = {
  /**
   * Get all posts
   */
  getPosts: async (): Promise<Post[]> => {
    return apiClient.get<Post[]>('/posts');
  },

  /**
   * Get post by ID
   */
  getPostById: async (id: number): Promise<Post> => {
    return apiClient.get<Post>(`/posts/${id}`);
  },

  /**
   * Get posts by user ID
   */
  getPostsByUserId: async (userId: number): Promise<Post[]> => {
    return apiClient.get<Post[]>(`/posts?userId=${userId}`);
  },

  /**
   * Create new post
   */
  createPost: async (post: Omit<Post, 'id'>): Promise<Post> => {
    return apiClient.post<Post>('/posts', post);
  },

  /**
   * Update post
   */
  updatePost: async (id: number, post: Partial<Post>): Promise<Post> => {
    return apiClient.put<Post>(`/posts/${id}`, post);
  },

  /**
   * Delete post
   */
  deletePost: async (id: number): Promise<void> => {
    return apiClient.delete(`/posts/${id}`);
  },
};
