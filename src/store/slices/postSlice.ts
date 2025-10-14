import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Post } from '@types';
import { postService } from '@services';

interface PostState {
  posts: Post[];
  selectedPost: Post | null;
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  selectedPost: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchPosts = createAsyncThunk('post/fetchPosts', async () => {
  const response = await postService.getPosts();
  return response;
});

export const fetchPostById = createAsyncThunk(
  'post/fetchPostById',
  async (id: number) => {
    const response = await postService.getPostById(id);
    return response;
  },
);

export const fetchPostsByUserId = createAsyncThunk(
  'post/fetchPostsByUserId',
  async (userId: number) => {
    const response = await postService.getPostsByUserId(userId);
    return response;
  },
);

export const createPost = createAsyncThunk(
  'post/createPost',
  async (postData: Omit<Post, 'id'>) => {
    const response = await postService.createPost(postData);
    return response;
  },
);

export const updatePost = createAsyncThunk(
  'post/updatePost',
  async ({ id, postData }: { id: number; postData: Partial<Post> }) => {
    const response = await postService.updatePost(id, postData);
    return response;
  },
);

export const deletePost = createAsyncThunk(
  'post/deletePost',
  async (id: number) => {
    await postService.deletePost(id);
    return id;
  },
);

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    clearSelectedPost: state => {
      state.selectedPost = null;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    // Fetch posts
    builder.addCase(fetchPosts.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.loading = false;
      state.posts = action.payload;
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch posts';
    });

    // Fetch post by ID
    builder.addCase(fetchPostById.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPostById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedPost = action.payload;
    });
    builder.addCase(fetchPostById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch post';
    });

    // Fetch posts by user ID
    builder.addCase(fetchPostsByUserId.fulfilled, (state, action) => {
      state.posts = action.payload;
    });

    // Create post
    builder.addCase(createPost.fulfilled, (state, action) => {
      state.posts.unshift(action.payload);
    });

    // Update post
    builder.addCase(updatePost.fulfilled, (state, action) => {
      const index = state.posts.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    });

    // Delete post
    builder.addCase(deletePost.fulfilled, (state, action) => {
      state.posts = state.posts.filter(p => p.id !== action.payload);
    });
  },
});

export const { clearSelectedPost, clearError } = postSlice.actions;
export default postSlice.reducer;
