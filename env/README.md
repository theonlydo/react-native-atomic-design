# Environment Configuration Files

This folder contains all environment-specific configuration files.

## 📁 Files

- **`.env`** - Active environment configuration (git-ignored)
- **`.env.dev`** - Development environment template (git-ignored)
- **`.env.prod`** - Production environment template (git-ignored)

**⚠️ Important:** All files in this folder are git-ignored for security.

## 🔄 Switching Environments

### Quick Switch (from root directory)

```bash
# Switch to development
./switch-env.sh dev

# Switch to production
./switch-env.sh prod
```

### Using NPM Scripts (from root directory)

```bash
# Development
npm run env:dev
npm run start:dev
npm run android:dev
npm run ios:dev

# Production
npm run env:prod
npm run start:prod
npm run android:prod
npm run ios:prod
```

### Manual Copy

```bash
# From root directory
cp env/.env.dev env/.env    # Development
cp env/.env.prod env/.env   # Production
```

## 🔒 Security

- **All files in this folder are git-ignored** - The entire `env/` folder is excluded from version control
- **Never commit real credentials** - Keep sensitive data out of git
- Replace placeholder values with real credentials in your local environment files
- Set real production credentials via CI/CD pipeline or manually on production servers
- Share credentials securely via password manager, not via git repository

## 📝 Configuration Format

```env
# App Information
APP_ENV=development
APP_NAME=Atomic Dev
APP_VERSION=1.0.0

# API Configuration
API_BASE_URL=https://api.example.com
API_TIMEOUT=30000

# Feature Flags
ENABLE_LOGGING=true
ENABLE_DEBUG_MODE=true
ENABLE_REDUX_LOGGER=true

# Third Party Services
ANALYTICS_KEY=your_analytics_key
SENTRY_DSN=your_sentry_dsn
```

## 📚 Documentation

For complete documentation, see [ENV_GUIDE.md](../ENV_GUIDE.md)

## 💡 Usage in Code

These environment files are used by `src/config/env.ts`:

```typescript
import { Config } from '@config';

// Access configuration
console.log(Config.apiBaseUrl);
console.log(Config.appName);
```

The system automatically detects the environment using React Native's `__DEV__` flag:

- Debug builds → Development config
- Release builds → Production config
