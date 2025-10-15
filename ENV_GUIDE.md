# Environment Configuration

## 📁 Structure

```
env/
├── .env          # Active environment (git-ignored)
├── .env.dev      # Development config (git-ignored)
└── .env.prod     # Production config (git-ignored)
```

**⚠️ Important:** All files in `env/` folder are git-ignored for security.

## 🚀 Quick Start

### Switch Environment

```bash
# Using script
./switch-env.sh dev    # Development
./switch-env.sh prod   # Production

# Using NPM
npm run env:dev        # Copy dev config
npm run env:prod       # Copy prod config
```

### Run with Environment

```bash
# Development
npm run start:dev
npm run android:dev
npm run ios:dev

# Production
npm run start:prod
npm run android:prod
npm run ios:prod
```

## 💻 Usage in Code

```typescript
import { Config, isDevelopment, isProduction } from '@config';

// Access configuration
console.log(Config.apiBaseUrl);
console.log(Config.appName);
console.log(Config.enableLogging);

// Check environment
if (isDevelopment()) {
  console.log('Running in development');
}
```

## ⚙️ Available Configs

- `Config.apiBaseUrl` - API endpoint URL
- `Config.apiTimeout` - Request timeout (ms)
- `Config.appName` - App display name
- `Config.appVersion` - App version
- `Config.environment` - Current environment
- `Config.enableLogging` - Enable console logs
- `Config.enableDebugMode` - Enable debug features
- `Config.enableReduxLogger` - Enable Redux logger
- `Config.analyticsKey` - Analytics service key
- `Config.sentryDsn` - Sentry error tracking DSN

## 🔧 Environment File Format

```env
# App Information
APP_ENV=development
APP_NAME=Atomic Dev
APP_VERSION=1.0.0

# API Configuration
API_BASE_URL=https://jsonplaceholder.typicode.com
API_TIMEOUT=30000

# Feature Flags
ENABLE_LOGGING=true
ENABLE_DEBUG_MODE=true
ENABLE_REDUX_LOGGER=true

# Third Party Services
ANALYTICS_KEY=dev_analytics_key_here
SENTRY_DSN=
```

## 🔒 Security

1. **All environment files are git-ignored** - The entire `env/` folder is excluded from git
2. **Never commit credentials** - Keep real credentials out of version control
3. **Use placeholders in templates** - Document required variables with placeholder values
4. **Set production values securely**:
   - Via CI/CD pipeline environment variables
   - Via secure password manager
   - Manually on production servers

## 📝 Adding New Configuration

### 1. Update Environment Files

Edit `env/.env.dev` and `env/.env.prod`:

```env
NEW_CONFIG=value_here
```

### 2. Update TypeScript Interface

Edit `src/config/env.ts`:

```typescript
interface EnvironmentConfig {
  // ... existing configs
  newConfig: string;
}

const developmentConfig: EnvironmentConfig = {
  // ... existing configs
  newConfig: 'dev_value',
};

const productionConfig: EnvironmentConfig = {
  // ... existing configs
  newConfig: 'prod_value',
};
```

### 3. Use in Your Code

```typescript
import { Config } from '@config';
console.log(Config.newConfig);
```

## 🔄 How It Works

1. Environment files store configuration values
2. `src/config/env.ts` reads and exports configurations
3. Auto-detects environment using React Native's `__DEV__` flag:
   - Debug builds → Development config
   - Release builds → Production config
4. No external dependencies required

## 📚 Related Files

- `src/config/env.ts` - Environment configuration module
- `src/config/index.ts` - Config exports
- `src/services/api.ts` - Uses Config for API settings
- `package.json` - NPM scripts for environment switching
- `switch-env.sh` - Bash script for easy switching
- `.gitignore` - Ignores entire env/ folder

## 🚨 Troubleshooting

### Config not updating?

1. Make sure you copied the correct environment file
2. Restart Metro bundler: `npm run start -- --reset-cache`
3. Rebuild the app completely

### Which environment am I using?

Check the Profile screen in the app - it shows environment info in development mode.

Or check the console logs on app start (development only):

```
🌍 Environment: development
🔗 API Base URL: https://jsonplaceholder.typicode.com
```

## 📋 Environment Comparison

| Setting      | Development                  | Production         |
| ------------ | ---------------------------- | ------------------ |
| API URL      | jsonplaceholder.typicode.com | api.production.com |
| Timeout      | 30s                          | 15s                |
| Logging      | ✅ ON                        | ❌ OFF             |
| Debug Mode   | ✅ ON                        | ❌ OFF             |
| Redux Logger | ✅ ON                        | ❌ OFF             |
| Sentry       | ❌ OFF                       | ✅ ON              |

## 💡 Best Practices

1. ✅ Keep `env/` folder in `.gitignore`
2. ✅ Use placeholder values for sensitive data
3. ✅ Document all required environment variables
4. ✅ Use `Config` object instead of hardcoding values
5. ✅ Test both dev and prod configs locally
6. ✅ Set real credentials via secure methods (CI/CD, password manager)
7. ❌ Never commit real API keys or credentials
8. ❌ Never hardcode environment-specific values in code
