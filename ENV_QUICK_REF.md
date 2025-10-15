# Environment Configuration Quick Reference

## 🚀 Quick Start

### Switch Environment

```bash
# Development
./switch-env.sh dev
npm run start

# Production
./switch-env.sh prod
npm run start
```

### Or use NPM scripts

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

## 📝 Configuration Files

- `.env.dev` - Development settings
- `.env.prod` - Production settings
- `.env` - Active environment (auto-generated, git-ignored)

## 💻 Usage in Code

```typescript
import { Config, isDevelopment } from '@config';

// Access config
console.log(Config.apiBaseUrl);
console.log(Config.appName);

// Check environment
if (isDevelopment()) {
  console.log('Dev mode');
}
```

## 🔧 Available Configs

- `Config.apiBaseUrl` - API endpoint URL
- `Config.apiTimeout` - Request timeout
- `Config.appName` - App display name
- `Config.appVersion` - App version
- `Config.enableLogging` - Console logging
- `Config.enableDebugMode` - Debug features
- `Config.enableReduxLogger` - Redux logger
- `Config.analyticsKey` - Analytics key
- `Config.sentryDsn` - Sentry DSN

## 📚 Full Documentation

See [ENV_CONFIG_GUIDE.md](./ENV_CONFIG_GUIDE.md) for complete documentation.

## 🔒 Security

- Never commit `.env` with real credentials
- Use placeholder values in `.env.dev` and `.env.prod`
- Set production values in CI/CD or manually

## ⚙️ Adding New Config

1. Add to `.env.dev` and `.env.prod`
2. Update `EnvironmentConfig` interface in `src/config/env.ts`
3. Add to `developmentConfig` and `productionConfig` objects
4. Use with `import { Config } from '@config'`
