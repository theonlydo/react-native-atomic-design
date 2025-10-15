# Authentication Guide

Panduan lengkap untuk menggunakan sistem autentikasi dengan token yang tersimpan secara persisten.

## 🔐 Fitur

- ✅ **Token tersimpan di Redux Persist** - Token otomatis tersimpan dan dipulihkan setelah app restart
- ✅ **Auto-sync dengan API Client** - Token otomatis ditambahkan ke header `Authorization` di setiap API request
- ✅ **Async Login Action** - Login dengan async thunk untuk handling loading dan error state

## 📦 Struktur

### 1. Auth Slice (`src/store/slices/authSlice.ts`)

State management untuk autentikasi:

```typescript
interface AuthState {
  isAuthenticated: boolean;
  user: { id: number; email: string; name: string } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
```

### 2. API Client (`src/services/api.ts`)

API client dengan auto-inject token:

```typescript
class ApiClient {
  private token: string | null = null;

  public setAuthToken(token: string | null): void;
  public getAuthToken(): string | null;
}
```

### 3. Token Sync (`App.tsx`)

Komponen `AuthTokenSync` otomatis sync token dari Redux ke API client setiap kali token berubah.

## 🚀 Cara Penggunaan

### Login dengan Async Thunk

```typescript
import { useAppDispatch } from '@hooks';
import { loginAsync } from '@store/slices/authSlice';

function LoginComponent() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);

  const handleLogin = async () => {
    const result = await dispatch(
      loginAsync({
        email: 'user@example.com',
        password: 'password123',
      }),
    );

    if (loginAsync.fulfilled.match(result)) {
      // Login berhasil, token otomatis disimpan dan di-sync
      console.log('Login successful!');
    }
  };

  return (
    <Button onPress={handleLogin} disabled={loading}>
      {loading ? 'Loading...' : 'Login'}
    </Button>
  );
}
```

### Login Manual (Tanpa API Call)

```typescript
import { useAppDispatch } from '@hooks';
import { login } from '@store/slices/authSlice';

function Component() {
  const dispatch = useAppDispatch();

  const handleLogin = () => {
    dispatch(
      login({
        user: {
          id: 1,
          email: 'user@example.com',
          name: 'John Doe',
        },
        token: 'your-jwt-token-here',
      }),
    );
    // Token otomatis di-sync ke API client
  };
}
```

### Logout

```typescript
import { useAppDispatch } from '@hooks';
import { logout } from '@store/slices/authSlice';

function Component() {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    // Token otomatis dihapus dari Redux dan API client
  };
}
```

### Cek Status Login

```typescript
import { useAppSelector } from '@hooks';

function Component() {
  const { isAuthenticated, user, token } = useAppSelector(state => state.auth);

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return <HomeScreen user={user} />;
}
```

### Menggunakan API dengan Token

Setelah login, semua API request otomatis menyertakan token di header:

```typescript
import { apiClient } from '@services';

// Token otomatis ditambahkan ke header:
// Authorization: Bearer <your-token>
const data = await apiClient.get('/protected-endpoint');
```

## 🔄 Flow Autentikasi

1. User login → `dispatch(loginAsync({ email, password }))`
2. API call ke `/auth/login` dengan token di response
3. Redux store updated dengan user & token
4. Redux Persist menyimpan token ke AsyncStorage
5. `AuthTokenSync` detect perubahan token
6. `apiClient.setAuthToken(token)` dipanggil
7. Semua request berikutnya menyertakan header `Authorization: Bearer <token>`

## 🛡️ Token Persistence

Token disimpan di AsyncStorage dan otomatis dipulihkan saat app restart:

**Config:** `src/store/index.ts`

```typescript
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['config', 'auth'], // ← auth slice dipersist
};
```

## 📝 Catatan

- Token disimpan dalam format: `Bearer <token>`
- Token otomatis dihapus saat logout
- Jika API response 401 (Unauthorized), handle di interceptor untuk redirect ke login
- Token tidak akan expire otomatis, implementasikan refresh token jika diperlukan

## 🔧 Customization

### Menambahkan Auth Service

Buat service khusus untuk auth di `src/services/index.ts`:

```typescript
export const authService = {
  login: async (email: string, password: string) => {
    return apiClient.post('/auth/login', { email, password });
  },

  register: async (userData: any) => {
    return apiClient.post('/auth/register', userData);
  },

  refreshToken: async (refreshToken: string) => {
    return apiClient.post('/auth/refresh', { refreshToken });
  },

  logout: async () => {
    return apiClient.post('/auth/logout');
  },
};
```

### Handle Token Expiration

Update API interceptor di `src/services/api.ts`:

```typescript
if (error.response.status === 401) {
  // Token expired, clear auth dan redirect ke login
  store.dispatch(logout());
  // atau implement refresh token logic
}
```

## ✅ Testing

```typescript
// Cek apakah token tersimpan
import { store } from '@store';

console.log('Current token:', store.getState().auth.token);
console.log('Is authenticated:', store.getState().auth.isAuthenticated);
```
