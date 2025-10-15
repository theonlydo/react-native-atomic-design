import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User, UserState } from '@types';
import { userService } from '@services';

const initialState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchUsers = createAsyncThunk('user/fetchUsers', async () => {
  const response = await userService.getUsers();
  return response;
});

export const fetchUserById = createAsyncThunk(
  'user/fetchUserById',
  async (id: number) => {
    const response = await userService.getUserById(id);
    return response;
  },
);

export const createUser = createAsyncThunk(
  'user/createUser',
  async (userData: Omit<User, 'id'>) => {
    const response = await userService.createUser(userData);
    return response;
  },
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ id, userData }: { id: number; userData: Partial<User> }) => {
    const response = await userService.updateUser(id, userData);
    return response;
  },
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (id: number) => {
    await userService.deleteUser(id);
    return id;
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearSelectedUser: state => {
      state.selectedUser = null;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    // Fetch users
    builder.addCase(fetchUsers.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch users';
    });

    // Fetch user by ID
    builder.addCase(fetchUserById.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedUser = action.payload;
    });
    builder.addCase(fetchUserById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch user';
    });

    // Create user
    builder.addCase(createUser.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.loading = false;
      state.users.push(action.payload);
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to create user';
    });

    // Update user
    builder.addCase(updateUser.fulfilled, (state, action) => {
      const index = state.users.findIndex(u => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      if (state.selectedUser?.id === action.payload.id) {
        state.selectedUser = action.payload;
      }
    });

    // Delete user
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.users = state.users.filter(u => u.id !== action.payload);
      if (state.selectedUser?.id === action.payload) {
        state.selectedUser = null;
      }
    });
  },
});

export const { clearSelectedUser, clearError } = userSlice.actions;
export default userSlice.reducer;
