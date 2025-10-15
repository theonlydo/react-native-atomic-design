# Environment Configuration Guide

## 📋 Overview

Project ini menggunakan sistem environment configuration yang fleksibel untuk mengelola pengaturan berbeda antara development dan production environment.

## 🗂️ File Structure

```
atomic/
├── .env              # Active environment (git-ignored)
├── .env.dev          # Development configuration
├── .env.prod         # Production configuration
└── src/
    └── config/
        ├── env.ts    # Environment config module
        └── index.ts  # Exports
```

## 🎯 Environment Files

### `.env.dev` - Development Environment

```env
APP_ENV=development
API_BASE_URL=https://jsonplaceholder.typicode.com
API_TIMEOUT=30000
ENABLE_LOGGING=true
ENABLE_DEBUG_MODE=true
ENABLE_REDUX_LOGGER=true
ANALYTICS_KEY=dev_analytics_key_here
SENTRY_DSN=
APP_NAME=Atomic Dev
APP_VERSION=1.0.0
```

### `.env.prod` - Production Environment

```env
APP_ENV=production
API_BASE_URL=https://api.production.com
API_TIMEOUT=15000
ENABLE_LOGGING=false
ENABLE_DEBUG_MODE=false
ENABLE_REDUX_LOGGER=false
ANALYTICS_KEY=prod_analytics_key_here
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
APP_NAME=Atomic
APP_VERSION=1.0.0
```

## 🚀 Usage

### Import Config in Your Code

```typescript
import { Config, isDevelopment, isProduction } from '@config';

// Access configuration
console.log(Config.apiBaseUrl); // https://jsonplaceholder.typicode.com (dev)
console.log(Config.appName); // "Atomic Dev" (dev)

// Check environment
if (isDevelopment()) {
  console.log('Running in development mode');
}

// Use in API calls
axios.get(`${Config.apiBaseUrl}/users`);
```

### Available Configuration Properties

```typescript
interface EnvironmentConfig {
  // App Info
  appName: string; // "Atomic Dev" or "Atomic"
  appVersion: string; // "1.0.0"
  environment: Environment; // "development" or "production"

  // API Configuration
  apiBaseUrl: string; // Base URL for API calls
  apiTimeout: number; // Request timeout in milliseconds

  // Feature Flags
  enableLogging: boolean; // Enable/disable console logs
  enableDebugMode: boolean; // Enable/disable debug features
  enableReduxLogger: boolean; // Enable/disable Redux logger

  // Third Party Services
  analyticsKey: string; // Analytics service key
  sentryDsn: string; // Sentry DSN for error tracking
}
```

## 🔄 Switching Environments

### Method 1: Using NPM Scripts (Recommended)

```bash
# Development
npm run env:dev        # Copy .env.dev to .env
npm run start:dev      # Start with dev environment
npm run android:dev    # Run Android with dev environment
npm run ios:dev        # Run iOS with dev environment

# Production
npm run env:prod       # Copy .env.prod to .env
npm run start:prod     # Start with prod environment
npm run android:prod   # Run Android with prod environment
npm run ios:prod       # Run iOS with prod environment
```

### Method 2: Manual Copy

```bash
# Switch to development
cp .env.dev .env

# Switch to production
cp .env.prod .env
```

### Method 3: Edit src/config/env.ts

Ubah konstanta `APP_ENV` di file `src/config/env.ts`:

```typescript
// For development
export const APP_ENV: Environment = 'development';

// For production
export const APP_ENV: Environment = 'production';

// Auto-detect based on __DEV__ (Recommended)
export const APP_ENV: Environment = __DEV__ ? 'development' : 'production';
```

## 📱 Usage Examples

### 1. API Service

```typescript
import { Config } from '@config';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: Config.apiBaseUrl,
  timeout: Config.apiTimeout,
});
```

### 2. Conditional Logging

```typescript
import { Config } from '@config';

function fetchUsers() {
  if (Config.enableLogging) {
    console.log('Fetching users...');
  }

  // API call...
}
```

### 3. Feature Flags

```typescript
import { Config, isDevelopment } from '@config';

function MyComponent() {
  return (
    <View>
      <Text>{Config.appName}</Text>

      {/* Show debug panel only in development */}
      {isDevelopment() && <DebugPanel />}

      {/* Show different UI based on environment */}
      {Config.enableDebugMode && (
        <TouchableOpacity onPress={clearCache}>
          <Text>Clear Cache (Dev Only)</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
```

### 4. Analytics Integration

```typescript
import { Config } from '@config';
import Analytics from 'some-analytics-library';

// Initialize analytics with environment-specific key
Analytics.initialize(Config.analyticsKey);

function trackEvent(eventName: string) {
  if (Config.environment === 'production') {
    Analytics.track(eventName);
  } else if (Config.enableLogging) {
    console.log('Analytics Event (Dev):', eventName);
  }
}
```

### 5. Error Tracking (Sentry)

```typescript
import { Config } from '@config';
import * as Sentry from '@sentry/react-native';

// Initialize Sentry only in production
if (Config.environment === 'production' && Config.sentryDsn) {
  Sentry.init({
    dsn: Config.sentryDsn,
    environment: Config.environment,
  });
}
```

## 🔒 Security Best Practices

### 1. Sensitive Data

**NEVER** commit `.env` file with real credentials to git. The `.gitignore` already excludes it:

```gitignore
# Environment files - contains sensitive data
.env
.env.local
.env.*.local

# Keep template files
!.env.dev
!.env.prod
```

### 2. Production Credentials

- Gunakan placeholder values di `.env.prod` yang di-commit ke git
- Set real production values di CI/CD pipeline
- Atau manually set di production environment

### 3. API Keys

Jangan hardcode API keys di source code. Selalu gunakan environment config:

```typescript
// ❌ BAD
const API_KEY = 'sk_live_1234567890abcdef';

// ✅ GOOD
import { Config } from '@config';
const API_KEY = Config.analyticsKey;
```

## 🛠️ Adding New Configuration

### Step 1: Update Environment Files

Edit `.env.dev` dan `.env.prod`:

```env
# Add new config
NEW_CONFIG_VALUE=some_value
```

### Step 2: Update Interface

Edit `src/config/env.ts`:

```typescript
interface EnvironmentConfig {
  // ... existing configs
  newConfigValue: string; // Add new property
}
```

### Step 3: Update Config Objects

```typescript
const developmentConfig: EnvironmentConfig = {
  // ... existing configs
  newConfigValue: 'dev_value',
};

const productionConfig: EnvironmentConfig = {
  // ... existing configs
  newConfigValue: 'prod_value',
};
```

### Step 4: Use in Your Code

```typescript
import { Config } from '@config';

console.log(Config.newConfigValue);
```

## 🧪 Testing Different Environments

### Local Testing

```bash
# Test with development config
npm run env:dev
npm run start
# Test your app...

# Test with production config
npm run env:prod
npm run start
# Test your app...
```

### Build Testing

```bash
# Build development APK
npm run android:dev

# Build production APK
npm run android:prod

# Build production iOS
npm run ios:prod
```

## 📊 Environment Comparison

| Feature      | Development                  | Production         |
| ------------ | ---------------------------- | ------------------ |
| API URL      | jsonplaceholder.typicode.com | api.production.com |
| Timeout      | 30 seconds                   | 15 seconds         |
| Logging      | ✅ Enabled                   | ❌ Disabled        |
| Debug Mode   | ✅ Enabled                   | ❌ Disabled        |
| Redux Logger | ✅ Enabled                   | ❌ Disabled        |
| Sentry       | ❌ Disabled                  | ✅ Enabled         |
| App Name     | "Atomic Dev"                 | "Atomic"           |

## 🚨 Troubleshooting

### Config not updating?

1. Make sure you copied the correct `.env` file
2. Restart Metro bundler: `npm run start -- --reset-cache`
3. Rebuild the app completely

### Getting wrong environment in build?

Check `src/config/env.ts` and make sure `APP_ENV` is set to use `__DEV__`:

```typescript
export const APP_ENV: Environment = __DEV__ ? 'development' : 'production';
```

This ensures:

- Debug builds → Development config
- Release builds → Production config

## 🔗 Related Files

- `src/config/env.ts` - Environment configuration module
- `src/services/api.ts` - API client using environment config
- `.env.dev` - Development environment variables
- `.env.prod` - Production environment variables
- `package.json` - NPM scripts for environment switching

## 📝 Notes

- Sistem ini **tidak** memerlukan package eksternal seperti `react-native-config`
- Environment detection otomatis menggunakan `__DEV__` flag dari React Native
- Config di-load saat aplikasi start, perubahan memerlukan restart
- Logging hanya aktif di development mode untuk performa yang lebih baik
