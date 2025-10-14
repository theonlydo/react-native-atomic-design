export { default as userReducer } from './userSlice';
export { default as postReducer } from './postSlice';
export { default as authReducer } from './authSlice';

// Re-export async thunks and actions
export {
  // User async thunks
  fetchUsers,
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
  // User actions
  clearSelectedUser,
  clearError as clearUserError,
} from './userSlice';

export {
  // Post async thunks
  fetchPosts,
  fetchPostById,
  fetchPostsByUserId,
  createPost,
  updatePost,
  deletePost,
  // Post actions
  clearSelectedPost,
  clearError as clearPostError,
} from './postSlice';

export {
  // Auth async thunks and actions
  login,
  logout,
} from './authSlice';
