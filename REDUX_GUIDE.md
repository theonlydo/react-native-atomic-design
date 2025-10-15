# Redux Usage Guide

## 📚 Struktur Redux Store

```
app/store/
├── slices/
│   ├── userSlice.ts    # User state & actions
│   ├── postSlice.ts    # Post state & actions
│   ├── authSlice.ts    # Authentication state
│   └── index.ts        # Export all slices
└── index.ts            # Store configuration
```

## 🔧 Setup Redux di Komponen

### 1. Import Hooks

```typescript
import { useAppDispatch, useAppSelector } from '@hooks';
import { fetchUsers, fetchUserById } from '@store/slices/userSlice';
```

### 2. Gunakan di Component

```typescript
const MyComponent = () => {
  const dispatch = useAppDispatch();
  const {users, loading, error} = useAppSelector(state => state.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    // Your JSX
  );
};
```

## 📋 User Slice Actions

### Async Thunks

```typescript
// Fetch all users
dispatch(fetchUsers());

// Fetch single user
dispatch(fetchUserById(1));

// Create user
dispatch(
  createUser({
    name: 'John Doe',
    email: 'john@example.com',
  }),
);

// Update user
dispatch(
  updateUser({
    id: 1,
    userData: { name: 'Jane Doe' },
  }),
);

// Delete user
dispatch(deleteUser(1));
```

### Sync Actions

```typescript
// Clear selected user
dispatch(clearSelectedUser());

// Clear error
dispatch(clearError());
```

## 📋 Post Slice Actions

```typescript
// Fetch all posts
dispatch(fetchPosts());

// Fetch single post
dispatch(fetchPostById(1));

// Fetch posts by user
dispatch(fetchPostsByUserId(1));

// Create post
dispatch(
  createPost({
    userId: 1,
    title: 'My Post',
    body: 'Post content',
  }),
);

// Update post
dispatch(
  updatePost({
    id: 1,
    postData: { title: 'Updated Title' },
  }),
);

// Delete post
dispatch(deletePost(1));
```

## 🔐 Auth Slice Actions

```typescript
// Login
dispatch(
  login({
    user: { id: 1, email: 'user@example.com', name: 'User' },
    token: 'jwt-token',
  }),
);

// Logout
dispatch(logout());

// Update profile
dispatch(
  updateProfile({
    name: 'New Name',
    email: 'newemail@example.com',
  }),
);
```

## 🎯 Menggunakan State

### User State

```typescript
const {
  users, // User[]
  selectedUser, // User | null
  loading, // boolean
  error, // string | null
} = useAppSelector(state => state.user);
```

### Post State

```typescript
const {
  posts, // Post[]
  selectedPost, // Post | null
  loading, // boolean
  error, // string | null
} = useAppSelector(state => state.post);
```

### Auth State

```typescript
const {
  isAuthenticated, // boolean
  user, // {id, email, name} | null
  token, // string | null
} = useAppSelector(state => state.auth);
```

## 💡 Best Practices

### 1. Dispatch dalam useEffect

```typescript
useEffect(() => {
  dispatch(fetchUsers());
}, [dispatch]);
```

### 2. Handle Loading State

```typescript
if (loading) {
  return <LoadingState />;
}
```

### 3. Handle Error State

```typescript
if (error) {
  return <ErrorState message={error} onRetry={() => dispatch(fetchUsers())} />;
}
```

### 4. Conditional Rendering

```typescript
if (!users || users.length === 0) {
  return <EmptyState />;
}
```

## 🔄 Async Flow

```
1. Dispatch async thunk
   dispatch(fetchUsers())

2. Pending state
   state.loading = true
   state.error = null

3. API Call
   userService.getUsers()

4. Success/Failure
   - Success: state.users = payload
   - Failure: state.error = error.message

5. Fulfilled/Rejected
   state.loading = false
```

## 📝 Contoh Lengkap

```typescript
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useAppDispatch, useAppSelector } from '@hooks';
import { fetchUsers } from '@store/slices/userSlice';
import { LoadingState, ErrorState, DataList } from '@components';

export const UserListScreen = () => {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector(state => state.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchUsers());
  };

  if (loading && !users.length) {
    return <LoadingState message="Loading users..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={handleRefresh} />;
  }

  return (
    <DataList
      data={users}
      loading={loading}
      error={error}
      onRefresh={handleRefresh}
      renderItem={user => <Text>{user.name}</Text>}
      keyExtractor={user => user.id.toString()}
    />
  );
};
```

## 🚀 Tips

1. **Selalu gunakan typed hooks** (`useAppDispatch`, `useAppSelector`)
2. **Dispatch di useEffect** untuk fetch data saat mount
3. **Handle semua states**: loading, error, empty
4. **Gunakan refresh/retry** untuk UX yang lebih baik
5. **Clear state** saat unmount jika perlu
6. **Combine selectors** untuk derived state

## 🔍 Debugging Redux

### Redux DevTools (React Native Debugger)

1. Install React Native Debugger
2. Enable Remote JS Debugging
3. Buka Redux DevTools panel
4. Monitor actions & state changes

### Console Logging

```typescript
// Di reducer
console.log('Action:', action.type);
console.log('Payload:', action.payload);

// Di component
console.log('Current state:', users);
```

---

Untuk informasi lebih lanjut, lihat [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
