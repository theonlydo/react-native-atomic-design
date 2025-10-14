# Atomic React Native Project# Atomic React Native ProjectThis is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

Project React Native dengan arsitektur **Atomic Design** dan **Redux Toolkit** untuk state management yang terstruktur dan scalable.Project React Native dengan arsitektur **Atomic Design** yang terstruktur dan scalable.# Getting Started

## 📁 Struktur Folder## 📁 Struktur Folder> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

```````## Step 1: Start Metro

atomic/

├── app/atomic/

│   ├── components/

│   │   ├── atoms/          # Komponen dasar (Button, Text, Input, Card, Spacer)├── app/First, you will need to run **Metro**, the JavaScript build tool for React Native.

│   │   ├── molecules/      # Kombinasi atoms (FormInput, ListItem, LoadingState, ErrorState)

│   │   ├── organisms/      # Komponen kompleks (Header, LoginForm, DataList)│   ├── components/

│   │   └── templates/      # Layout templates

│   ├── screens/            # Screens/Pages aplikasi│   │   ├── atoms/          # Komponen dasar (Button, Text, Input, Card, Spacer)To start the Metro dev server, run the following command from the root of your React Native project:

│   │   ├── HomeScreen.tsx  # List users dengan Redux

│   │   ├── DetailScreen.tsx│   │   ├── molecules/      # Kombinasi atoms (FormInput, ListItem, LoadingState, ErrorState)

│   │   └── ProfileScreen.tsx

│   ├── navigation/         # React Navigation setup│   │   ├── organisms/      # Komponen kompleks (Header, LoginForm, DataList)```sh

│   │   └── AppNavigator.tsx

│   ├── store/              # Redux store dan slices│   │   └── templates/      # Layout templates# Using npm

│   │   ├── slices/

│   │   │   ├── userSlice.ts    # User state management│   ├── screens/            # Screens/Pages aplikasinpm start

│   │   │   ├── postSlice.ts    # Post state management

│   │   │   └── authSlice.ts    # Auth state management│   │   ├── HomeScreen.tsx

│   │   └── index.ts        # Store configuration

│   ├── services/           # API services dengan axios│   │   ├── DetailScreen.tsx# OR using Yarn

│   │   ├── api.ts         # API client dengan interceptors

│   │   └── index.ts       # User & Post services│   │   └── ProfileScreen.tsxyarn start

│   ├── hooks/              # Custom React hooks

│   │   ├── useFetch.ts    # Hook untuk data fetching│   ├── navigation/         # React Navigation setup```

│   │   └── useRedux.ts    # Typed Redux hooks

│   ├── utils/              # Utility functions│   │   └── AppNavigator.tsx

│   │   ├── formatters.ts  # Format date, currency, text

│   │   └── validators.ts  # Validasi email, phone, password│   ├── services/           # API services dengan axios## Step 2: Build and run your app

│   ├── types/              # TypeScript types & interfaces

│   │   └── index.ts       # User, Post, ApiResponse, etc.│   │   ├── api.ts         # API client dengan interceptors

│   ├── constants/          # Constants & theme

│   │   ├── colors.ts      # Color palette│   │   └── index.ts       # User & Post servicesWith Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

│   │   ├── spacing.ts     # Spacing, BorderRadius, FontSize

│   │   └── index.ts│   ├── hooks/              # Custom React hooks

│   └── assets/             # Images, fonts, etc.

├── android/                # Android native code│   │   └── useFetch.ts    # Hook untuk data fetching### Android

├── ios/                    # iOS native code

├── App.tsx                 # Entry point dengan Redux Provider│   ├── utils/              # Utility functions

├── babel.config.js         # Babel config dengan path alias

├── tsconfig.json           # TypeScript config│   │   ├── formatters.ts  # Format date, currency, text```sh

├── types.d.ts              # Module declarations

└── package.json│   │   └── validators.ts  # Validasi email, phone, password# Using npm

```

│   ├── types/              # TypeScript types & interfacesnpm run android

## 🎨 Atomic Design Pattern

│   │   └── index.ts       # User, Post, ApiResponse, etc.

### 1. **Atoms** (Komponen Dasar)

Komponen terkecil yang tidak bisa dipecah lagi:│   ├── constants/          # Constants & theme# OR using Yarn

- `Button` - Button dengan berbagai variant (primary, secondary, outline, ghost)

- `Text` - Text dengan variant (h1, h2, h3, body, caption, small)│   │   ├── colors.ts      # Color paletteyarn android

- `Input` - Text input dengan error state

- `Card` - Container dengan shadow dan border radius│   │   ├── spacing.ts     # Spacing, BorderRadius, FontSize```

- `Spacer` - Spacing helper component

│   │   └── index.ts

### 2. **Molecules** (Kombinasi Atoms)

Kombinasi beberapa atoms:│   └── assets/             # Images, fonts, etc.### iOS

- `FormInput` - Input dengan label dan error message

- `ListItem` - Card dengan title, subtitle, dan action├── android/                # Android native code

- `LoadingState` - Loading indicator dengan message

- `ErrorState` - Error display dengan retry button├── ios/                    # iOS native codeFor iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).



### 3. **Organisms** (Komponen Kompleks)├── App.tsx                 # Entry point aplikasi

Gabungan molecules dan atoms yang lebih kompleks:

- `Header` - App header dengan title, subtitle, dan actions├── babel.config.js         # Babel config dengan path aliasThe first time you create a new project, run the Ruby bundler to install CocoaPods itself:

- `LoginForm` - Form login dengan validasi

- `DataList` - FlatList dengan loading, error, dan empty states├── tsconfig.json           # TypeScript config



### 4. **Templates** & **Screens**└── package.json```sh

Layout dan halaman lengkap:

- `HomeScreen` - Daftar users dengan Redux state managementbundle install

- `DetailScreen` - Detail user dari Redux store

- `ProfileScreen` - Profile dengan login form````



## 🔧 Path Alias## 🎨 Atomic Design PatternThen, and every time you update your native dependencies, run:



Project ini menggunakan path alias untuk import yang lebih clean:### 1. **Atoms** (Komponen Dasar)```sh



```typescriptKomponen terkecil yang tidak bisa dipecah lagi:bundle exec pod install

import {Button} from '@atoms/Button';

import {FormInput} from '@molecules/FormInput';- `Button` - Button dengan berbagai variant (primary, secondary, outline, ghost)```

import {Header} from '@organisms/Header';

import {HomeScreen} from '@screens';- `Text` - Text dengan variant (h1, h2, h3, body, caption, small)

import {AppNavigator} from '@navigation';

import {userService} from '@services';- `Input` - Text input dengan error stateFor more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

import {useFetch, useAppDispatch, useAppSelector} from '@hooks';

import {Colors, Spacing} from '@constants';- `Card` - Container dengan shadow dan border radius

import {User, Post} from '@types';

import {store} from '@store';- `Spacer` - Spacing helper component```sh

import {fetchUsers} from '@store/slices/userSlice';

```# Using npm



## 🔴 Redux Toolkit State Management### 2. **Molecules** (Kombinasi Atoms)npm run ios



### Store StructureKombinasi beberapa atoms:

```typescript

{- `FormInput` - Input dengan label dan error message# OR using Yarn

  user: {

    users: User[],- `ListItem` - Card dengan title, subtitle, dan actionyarn ios

    selectedUser: User | null,

    loading: boolean,- `LoadingState` - Loading indicator dengan message```

    error: string | null

  },- `ErrorState` - Error display dengan retry button

  post: {

    posts: Post[],If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

    selectedPost: Post | null,

    loading: boolean,### 3. **Organisms** (Komponen Kompleks)

    error: string | null

  },Gabungan molecules dan atoms yang lebih kompleks:This is one way to run your app — you can also build it directly from Android Studio or Xcode.

  auth: {

    isAuthenticated: boolean,- `Header` - App header dengan title, subtitle, dan actions

    user: {...},

    token: string | null- `LoginForm` - Form login dengan validasi## Step 3: Modify your app

  }

}- `DataList` - FlatList dengan loading, error, dan empty states

```

Now that you have successfully run the app, let's make changes!

### Async Thunks (User Slice)

```typescript### 4. **Templates** & **Screens**

// Fetch all users

dispatch(fetchUsers())Layout dan halaman lengkap:Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).



// Fetch user by ID- `HomeScreen` - Daftar users dengan navigation

dispatch(fetchUserById(id))

- `DetailScreen` - Detail userWhen you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

// Create new user

dispatch(createUser(userData))- `ProfileScreen` - Profile dengan login form



// Update user- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).

dispatch(updateUser({id, userData}))

## 🔧 Path Alias- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

// Delete user

dispatch(deleteUser(id))Project ini menggunakan path alias untuk import yang lebih clean:## Congratulations! :tada:

```

```typescriptYou've successfully run and modified your React Native App. :partying_face:

### Custom Redux Hooks

```typescriptimport {Button} from '@atoms/Button';

// Typed dispatch

const dispatch = useAppDispatch();import {FormInput} from '@molecules/FormInput';### Now what?



// Typed selectorimport {Header} from '@organisms/Header';

const {users, loading, error} = useAppSelector(state => state.user);

import {HomeScreen} from '@screens';- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).

// Usage in component

useEffect(() => {import {AppNavigator} from '@navigation';- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

  dispatch(fetchUsers());

}, [dispatch]);import {userService} from '@services';

```

import {useFetch} from '@hooks';# Troubleshooting

## 🌐 API Integration

import {Colors, Spacing} from '@constants';

### API Client

- Base URL: `https://jsonplaceholder.typicode.com`import {User, Post} from '@types';If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

- Axios dengan interceptors untuk request/response

- Error handling yang konsisten```

- Support untuk GET, POST, PUT, PATCH, DELETE

# Learn More

### Services

```typescript## 🌐 API Integration

// User service

userService.getUsers()To learn more about React Native, take a look at the following resources:

userService.getUserById(id)

userService.createUser(user)### API Client

userService.updateUser(id, user)

userService.deleteUser(id)- Base URL: `https://jsonplaceholder.typicode.com`- [React Native Website](https://reactnative.dev) - learn more about React Native.



// Post service- Axios dengan interceptors untuk request/response- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.

postService.getPosts()

postService.getPostById(id)- Error handling yang konsisten- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.

postService.getPostsByUserId(userId)

```- Support untuk GET, POST, PUT, PATCH, DELETE- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.



### Custom Hook (Alternative)- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

```typescript

const {data, loading, error, refetch} = useFetch(### Services

  () => userService.getUsers(),

  []```typescript

);// User service

```userService.getUsers();

userService.getUserById(id);

## 🚀 Installation & SetupuserService.createUser(user);

userService.updateUser(id, user);

### 1. Install DependenciesuserService.deleteUser(id);

```bash

npm install// Post service

# ataupostService.getPosts();

yarn installpostService.getPostById(id);

```postService.getPostsByUserId(userId);

```

### 2. Install iOS Dependencies (Mac only)

```bash### Custom Hook

cd ios && bundle install && bundle exec pod install && cd ..

``````typescript

const { data, loading, error, refetch } = useFetch(

### 3. Clear Cache (Jika ada masalah)  () => userService.getUsers(),

```bash  [],

watchman watch-del-all);

rm -rf node_modules/.cache```

npm start -- --reset-cache

```## 🚀 Installation & Setup



### 4. Run Android### 1. Install Dependencies

```bash

npm run android```bash

# ataunpm install

yarn android# atau

```yarn install

```

### 5. Run iOS (Mac only)

```bash### 2. Install iOS Dependencies (Mac only)

npm run ios

# atau```bash

yarn ioscd ios && bundle install && bundle exec pod install && cd ..

``````



### 6. Start Metro Bundler### 3. Run Android

```bash

npm start```bash

# ataunpm run android

yarn start# atau

```yarn android

```

## 📦 Dependencies

### 4. Run iOS (Mac only)

### Core

- `react-native` - Framework React Native```bash

- `react` - React librarynpm run ios

# atau

### State Managementyarn ios

- `@reduxjs/toolkit` - Redux state management```

- `react-redux` - React bindings untuk Redux

### 5. Start Metro Bundler

### Navigation

- `@react-navigation/native` - Navigation core```bash

- `@react-navigation/native-stack` - Stack navigatornpm start

- `react-native-screens` - Native screens# atau

- `react-native-safe-area-context` - Safe area handlingyarn start

```

### API & Data

- `axios` - HTTP client untuk API calls## 📦 Dependencies



### Dev Dependencies### Core

- `typescript` - TypeScript support

- `babel-plugin-module-resolver` - Path alias support- `react-native` - Framework React Native

- `@react-native/babel-preset` - Babel preset- `react` - React library

- `eslint` - Code linting

- `prettier` - Code formatting### Navigation



## 🎨 Theme & Constants- `@react-navigation/native` - Navigation core

- `@react-navigation/native-stack` - Stack navigator

### Colors- `react-native-screens` - Native screens

```typescript- `react-native-safe-area-context` - Safe area handling

Colors.primary, Colors.secondary, Colors.success,

Colors.warning, Colors.error, Colors.white, Colors.black,### API & Data

Colors.gray, Colors.background, Colors.text, etc.

```- `axios` - HTTP client untuk API calls



### Spacing### Dev Dependencies

```typescript

Spacing.xs (4), Spacing.sm (8), Spacing.md (16),- `typescript` - TypeScript support

Spacing.lg (24), Spacing.xl (32), Spacing.xxl (48)- `babel-plugin-module-resolver` - Path alias support

```- `@react-native/babel-preset` - Babel preset

- `eslint` - Code linting

### Typography- `prettier` - Code formatting

```typescript

FontSize.xs (12), FontSize.sm (14), FontSize.md (16),## 🎨 Theme & Constants

FontSize.lg (18), FontSize.xl (24), FontSize.xxl (32)

```### Colors



## 🛠 Utils```typescript

Colors.primary, Colors.secondary, Colors.success,

### FormattersColors.warning, Colors.error, Colors.white, Colors.black,

- `formatDate(date)` - Format date ke readable stringColors.gray, Colors.background, Colors.text, etc.

- `formatCurrency(amount)` - Format currency (IDR)```

- `truncateText(text, maxLength)` - Potong text

- `capitalize(text)` - Capitalize first letter### Spacing



### Validators```typescript

- `isValidEmail(email)` - Validasi emailSpacing.xs(4),

- `isValidPhone(phone)` - Validasi nomor telepon Indonesia  Spacing.sm(8),

- `isStrongPassword(password)` - Validasi password  Spacing.md(16),

- `isEmpty(value)` - Check empty string  Spacing.lg(24),

  Spacing.xl(32),

## 📝 TypeScript Support  Spacing.xxl(48);

```

Project ini full TypeScript dengan:

- Interface untuk semua data types### Typography

- Type-safe navigation

- Props typing untuk semua components```typescript

- Strict type checkingFontSize.xs(12),

- Typed Redux hooks (useAppDispatch, useAppSelector)  FontSize.sm(14),

- RootState dan AppDispatch types  FontSize.md(16),

  FontSize.lg(18),

## 🧪 Features  FontSize.xl(24),

  FontSize.xxl(32);

- ✅ **Atomic Design Architecture**```

- ✅ **Redux Toolkit** untuk state management

- ✅ **TypeScript** full support## 🛠 Utils

- ✅ **Path Alias** (@atoms, @molecules, @store, etc.)

- ✅ **React Navigation** dengan type-safety### Formatters

- ✅ **API Integration** dengan Axios + interceptors

- ✅ **Custom Hooks** (useFetch, useAppDispatch, useAppSelector)- `formatDate(date)` - Format date ke readable string

- ✅ **Reusable Components** library- `formatCurrency(amount)` - Format currency (IDR)

- ✅ **Theme System** (Colors, Spacing, Typography)- `truncateText(text, maxLength)` - Potong text

- ✅ **Form Validation**- `capitalize(text)` - Capitalize first letter

- ✅ **Loading & Error States**

- ✅ **Pull to Refresh** dengan Redux### Validators

- ✅ **Safe Area Handling**

- ✅ **Async Thunks** untuk API calls- `isValidEmail(email)` - Validasi email

- ✅ **Centralized State Management**- `isValidPhone(phone)` - Validasi nomor telepon Indonesia

- `isStrongPassword(password)` - Validasi password

## 🔧 Troubleshooting- `isEmpty(value)` - Check empty string



### Path Alias Tidak Terbaca## 📝 TypeScript Support

```bash

# 1. Clear cacheProject ini full TypeScript dengan:

watchman watch-del-all

rm -rf node_modules/.cache- Interface untuk semua data types

- Type-safe navigation

# 2. Restart Metro bundler- Props typing untuk semua components

npm start -- --reset-cache- Strict type checking



# 3. Restart TypeScript server di VS Code## 🧪 Features

# CMD/Ctrl + Shift + P -> "TypeScript: Restart TS Server"

```- ✅ Atomic Design Architecture

- ✅ TypeScript

### Port 8081 Sudah Digunakan- ✅ Path Alias (@atoms, @molecules, etc.)

```bash- ✅ React Navigation

# Kill process di port 8081- ✅ API Integration dengan Axios

lsof -ti:8081 | xargs kill -9- ✅ Custom Hooks (useFetch)

- ✅ Reusable Components

# Atau jalankan di port lain- ✅ Theme System (Colors, Spacing, Typography)

npm start -- --port 8082- ✅ Form Validation

```- ✅ Loading & Error States

- ✅ Pull to Refresh

## 📚 Referensi- ✅ Safe Area Handling



- [React Native Documentation](https://reactnative.dev/docs/getting-started)## 📚 Referensi

- [Atomic Design Methodology](https://bradfrost.com/blog/post/atomic-web-design/)

- [React Navigation](https://reactnavigation.org/)- [React Native Documentation](https://reactnative.dev/docs/getting-started)

- [Redux Toolkit](https://redux-toolkit.js.org/)- [Atomic Design Methodology](https://bradfrost.com/blog/post/atomic-web-design/)

- [Axios Documentation](https://axios-http.com/)- [React Navigation](https://reactnavigation.org/)

- [Axios Documentation](https://axios-http.com/)

## 📄 License

## 📄 License

MIT

MIT

---

---

Dibuat dengan ❤️ menggunakan React Native, Atomic Design & Redux Toolkit

Dibuat dengan ❤️ menggunakan React Native & Atomic Design
```````
