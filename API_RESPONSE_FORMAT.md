# API Response Format

Dokumentasi format response API yang digunakan dalam aplikasi.

## 📦 Format Standard Response

Semua API endpoint harus mengembalikan response dengan format berikut:

```typescript
{
  status: 1 | 0,  // 1 = success, 0 = error
  status_code: number,
  message: string,
  data: any
}
```

> **⚠️ Penting:** Field `status` menggunakan **angka numerik**, bukan string:
>
> - `1` = Success (operasi berhasil)
> - `0` = Error (operasi gagal)

### Interface TypeScript

```typescript
export interface ApiResponse<T = any> {
  status: 1 | 0; // 1 = success, 0 = error
  status_code: number;
  message: string;
  data: T;
}
```

## ✅ Success Response

### Contoh: Get User List

**Request:**

```typescript
const users = await apiClient.get<User[]>('/users');
```

**Raw API Response:**

```json
{
  "status": 1,
  "status_code": 200,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com"
    }
  ]
}
```

**Yang diterima di code:**

```typescript
// API client otomatis extract `data` field
const users: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
  },
];
```

### Contoh: Create Post

**Request:**

```typescript
const newPost = await apiClient.post<Post>('/posts', {
  title: 'My Post',
  body: 'Content here',
});
```

**Raw API Response:**

```json
{
  "status": 1,
  "status_code": 201,
  "message": "Post created successfully",
  "data": {
    "id": 123,
    "title": "My Post",
    "body": "Content here",
    "userId": 1
  }
}
```

**Yang diterima di code:**

```typescript
const newPost: Post = {
  id: 123,
  title: 'My Post',
  body: 'Content here',
  userId: 1,
};
```

## ❌ Error Response

### Error dari Server (Business Logic Error)

Jika `status: 0` di response body, akan di-reject sebagai ApiError:

**Raw API Response:**

```json
{
  "status": 0,
  "status_code": 400,
  "message": "Invalid email format",
  "data": null
}
```

**Di code:**

```typescript
try {
  await apiClient.post('/users', userData);
} catch (error: ApiError) {
  console.error(error.message); // "Invalid email format"
  console.error(error.status); // 400
}
```

### HTTP Error (Network/Server Error)

**HTTP 401 Unauthorized:**

```json
{
  "status": 0,
  "status_code": 401,
  "message": "Authentication required",
  "data": null
}
```

**HTTP 403 Forbidden:**

```json
{
  "status": 0,
  "status_code": 403,
  "message": "Access denied",
  "data": null
}
```

**HTTP 404 Not Found:**

```json
{
  "status": 0,
  "status_code": 404,
  "message": "Resource not found",
  "data": null
}
```

**HTTP 500 Internal Server Error:**

```json
{
  "status": 0,
  "status_code": 500,
  "message": "Internal server error",
  "data": null
}
```

## 🔄 Cara Kerja API Client

### Response Interceptor

API client memiliki response interceptor yang:

1. **Memeriksa format response** - Apakah mengikuti standard `{status, status_code, message, data}`
2. **Extract data field** - Otomatis mengembalikan hanya `data` field untuk success response
3. **Handle error** - Jika `status: 0`, akan di-reject sebagai `ApiError`
4. **Backward compatibility** - Jika response tidak wrapped, akan di-return as-is

### Pseudo Code

```typescript
// Di response interceptor:
if (response.data.status === 0) {
  // Reject as ApiError
  throw new ApiError(response.data.message, response.data.status_code);
}

if (response.data.status === 1) {
  // Extract data field
  return response.data.data;
}

// Fallback: return as-is
return response.data;
```

## 📝 Contoh Penggunaan

### 1. Simple GET Request

```typescript
import { apiClient } from '@services';
import { User } from '@types';

const fetchUsers = async () => {
  try {
    // API response: {status: 1, status_code: 200, message: "...", data: [...]}
    // Yang diterima: User[]
    const users = await apiClient.get<User[]>('/users');
    console.log(users); // Array of User objects
  } catch (error: ApiError) {
    console.error('Error:', error.message);
    console.error('Status Code:', error.status);
  }
};
```

### 2. POST Request with Body

```typescript
const createUser = async (userData: Partial<User>) => {
  try {
    const newUser = await apiClient.post<User>('/users', userData);
    console.log('User created:', newUser);
    return newUser;
  } catch (error: ApiError) {
    if (error.status === 400) {
      alert('Invalid input: ' + error.message);
    } else if (error.status === 401) {
      // Redirect to login
    }
  }
};
```

### 3. Using in Redux Async Thunk

```typescript
import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@services';

export const fetchUsers = createAsyncThunk(
  'users/fetch',
  async (_, { rejectWithValue }) => {
    try {
      // API client otomatis extract data
      const users = await apiClient.get<User[]>('/users');
      return users; // Success: return data
    } catch (error: ApiError) {
      return rejectWithValue(error.message); // Error: return error message
    }
  },
);
```

## 🎯 Status Codes

### Success (2xx)

- **200** - OK (GET, PUT, PATCH, DELETE success)
- **201** - Created (POST success)
- **204** - No Content (DELETE success, no body)

### Client Error (4xx)

- **400** - Bad Request (validation error)
- **401** - Unauthorized (authentication required)
- **403** - Forbidden (no permission)
- **404** - Not Found (resource doesn't exist)
- **422** - Unprocessable Entity (validation error)

### Server Error (5xx)

- **500** - Internal Server Error
- **502** - Bad Gateway
- **503** - Service Unavailable

## 🛡️ Type Safety

Dengan TypeScript, kita mendapatkan type safety:

```typescript
// ✅ Correct: Type inference works
const users = await apiClient.get<User[]>('/users');
users[0].name; // TypeScript knows this is a string

// ✅ Correct: Return type is Post
const post = await apiClient.post<Post>('/posts', postData);
post.title; // TypeScript knows this is a string

// ❌ Error: Type mismatch
const user = await apiClient.get<User>('/users/1');
user.invalidField; // TypeScript error: Property doesn't exist
```

## 🔧 Customization

Jika backend Anda menggunakan format berbeda, update di `src/services/api.ts`:

```typescript
// Contoh: jika backend menggunakan field "result" instead of "data"
if (wrappedData && 'result' in wrappedData) {
  return { ...response, data: wrappedData.result } as any;
}
```

## 📌 Best Practices

1. **Selalu gunakan type parameter** - `apiClient.get<User[]>()` bukan `apiClient.get()`
2. **Handle error properly** - Gunakan try-catch untuk semua API calls
3. **Check status codes** - Handle specific error codes (401, 403, 404, dll)
4. **Use loading states** - Tampilkan loading indicator saat API call
5. **Show user-friendly messages** - Jangan langsung tampilkan raw error message

## ✅ Checklist Backend

Pastikan backend API Anda mengembalikan format berikut:

```typescript
// ✅ Success Response
{
  "status": 1,
  "status_code": 200,
  "message": "Operation successful",
  "data": { /* your data here */ }
}

// ✅ Error Response
{
  "status": 0,
  "status_code": 400,
  "message": "Error description",
  "data": null
}
```

**Penting:**

- Field `status` adalah angka: **1 = success**, **0 = error**
- Field `data` harus selalu ada, gunakan `null` jika tidak ada data.
