# Redux Reducer & Types Structure

Dokumentasi tentang struktur Redux reducer dan types management.

## 📁 Struktur Folder

```
src/
├── store/
│   ├── index.ts
│   └── reducer/                # ← Renamed dari "slices"
│       ├── index.ts
│       ├── authSlice.ts       # Auth reducer
│       ├── userSlice.ts       # User reducer
│       ├── postSlice.ts       # Post reducer
│       └── configSlice.ts     # Config reducer
│
└── types/
    ├── index.ts               # Main types export
    ├── auth.types.ts          # Auth state types
    ├── user.types.ts          # User state types
    ├── post.types.ts          # Post state types
    └── config.types.ts        # Config state types
```

## 🎯 Perubahan Utama

### 1. **Folder `slices` → `reducer`**

Folder Redux slices diganti nama menjadi `reducer` untuk konsistensi penamaan.

```typescript
// ❌ Sebelum
import { fetchUsers } from '@store/slices/userSlice';

// ✅ Sekarang
import { fetchUsers } from '@store/reducer/userSlice';
```

### 2. **State Interfaces Terpisah**

Semua interface state dipindahkan ke folder `types` untuk better maintenance.

**Sebelum:**

```typescript
// di userSlice.ts
interface UserState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}
```

**Sekarang:**

```typescript
// di types/user.types.ts
export interface UserState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}

// di reducer/userSlice.ts
import { UserState } from '@types';
```

## 📦 File Types

### `types/auth.types.ts`

```typescript
export interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: number;
    email: string;
    name: string;
  } | null;
  token: string | null;
}
```

### `types/user.types.ts`

```typescript
import { User } from './index';

export interface UserState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}
```

### `types/post.types.ts`

```typescript
import { Post } from './index';

export interface PostState {
  posts: Post[];
  selectedPost: Post | null;
  loading: boolean;
  error: string | null;
}
```

### `types/config.types.ts`

```typescript
export type Language = 'en' | 'id';
export type Theme = 'light' | 'dark';

export interface ConfigState {
  language: Language;
  theme: Theme;
}
```

## 🔄 Import Pattern

### Import State Types

```typescript
import { AuthState, UserState, PostState, ConfigState } from '@types';
```

### Import Language Type

```typescript
import { Language } from '@types';
```

### Import Reducers

```typescript
// From reducer/index.ts
import { userReducer, postReducer, authReducer } from '@store/reducer';

// Or specific actions/thunks
import { fetchUsers, fetchUserById } from '@store/reducer/userSlice';
import { login, logout } from '@store/reducer/authSlice';
import { setLanguage } from '@store/reducer/configSlice';
```

## ✅ Keuntungan Struktur Baru

### 1. **Better Separation of Concerns**

- Logic (reducers) terpisah dari types (interfaces)
- Lebih mudah mencari dan update interfaces

### 2. **Easier Maintenance**

- Interface terpusat di folder `types`
- Tidak perlu buka file reducer hanya untuk lihat interface
- Bisa reuse types di berbagai tempat

### 3. **Better Scalability**

- Mudah menambah state baru:
  1. Buat file `newFeature.types.ts`
  2. Buat file `newFeatureSlice.ts`
  3. Export di `types/index.ts` dan `reducer/index.ts`

### 4. **Type Reusability**

```typescript
// Types bisa digunakan di berbagai tempat
import { UserState, PostState } from '@types';

// Di component
const users: UserState['users'] = [];

// Di selector
const selectUsers = (state: { user: UserState }) => state.user.users;

// Di test
const mockUserState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
};
```

## 📝 Cara Menambah State Baru

### 1. Buat Type File

```typescript
// src/types/cart.types.ts
export interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
  error: string | null;
}
```

### 2. Export di types/index.ts

```typescript
export * from './cart.types';
```

### 3. Buat Reducer File

```typescript
// src/store/reducer/cartSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { CartState } from '@types';

const initialState: CartState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    // ... more reducers
  },
});

export const { addItem } = cartSlice.actions;
export default cartSlice.reducer;
```

### 4. Export di reducer/index.ts

```typescript
export { default as cartReducer } from './cartSlice';
export { addItem } from './cartSlice';
```

### 5. Register di store

```typescript
// src/store/index.ts
import { cartReducer } from './reducer';

const rootReducer = combineReducers({
  user: userReducer,
  post: postReducer,
  auth: authReducer,
  config: configReducer,
  cart: cartReducer, // ← Add here
});
```

## 🔍 Migration Checklist

Jika Anda melakukan migration serupa:

- [ ] Rename folder `slices` → `reducer`
- [ ] Buat file types untuk setiap state (`*.types.ts`)
- [ ] Extract interfaces dari reducers ke types
- [ ] Update imports di reducers
- [ ] Update imports di `store/index.ts`
- [ ] Update imports di components/screens
- [ ] Update imports di hooks
- [ ] Update documentation (README, guides, dll)
- [ ] Run tests untuk memastikan tidak ada breaking changes
- [ ] Check TypeScript errors (`tsc --noEmit`)

## 📚 Related Files

- `src/store/index.ts` - Store configuration
- `src/store/reducer/index.ts` - Reducer exports
- `src/types/index.ts` - Types exports
- `src/hooks/useRedux.ts` - Redux hooks with types

## 🎓 Best Practices

1. **Always use typed hooks**

   ```typescript
   import { useAppSelector, useAppDispatch } from '@hooks';
   ```

2. **Import types from @types**

   ```typescript
   import { UserState, PostState } from '@types';
   ```

3. **Group related types**

   ```typescript
   // Good: All cart-related types in one file
   // types/cart.types.ts
   export interface CartItem { ... }
   export interface CartState { ... }
   export type CartStatus = 'idle' | 'loading' | 'success' | 'error';
   ```

4. **Use descriptive file names**

   ```typescript
   // Good
   auth.types.ts;
   user.types.ts;

   // Avoid
   types1.ts;
   interfaces.ts;
   ```

## 🚀 Summary

Struktur baru ini memberikan:

- ✅ **Better organization** - Logic & types terpisah
- ✅ **Easier maintenance** - Interface terpusat
- ✅ **Type safety** - TypeScript inference lebih baik
- ✅ **Scalability** - Mudah menambah feature baru
- ✅ **Code reusability** - Types bisa digunakan di mana saja
