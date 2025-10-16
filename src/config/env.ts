/**
 * Environment Configuration
 *
 * This file manages environment-specific configurations.
 * Configuration is loaded from .env files via react-native-config
 */

import Config from 'react-native-config';

export type Environment = 'development' | 'production';

// Get environment from .env file
export const APP_ENV: Environment =
  (Config.APP_ENV as Environment) || (__DEV__ ? 'development' : 'production');

interface EnvironmentConfig {
  // App Info
  appName: string;
  appVersion: string;
  environment: Environment;

  // API Configuration
  apiBaseUrl: string;
  apiTimeout: number;

  // API Endpoints
  endpoints: {
    auth: {
      register: string;
      login: string;
    };
    me: string;
    contacts: string;
  };

  // Feature Flags
  enableLogging: boolean;
  enableDebugMode: boolean;
  enableReduxLogger: boolean;

  // Third Party Services
  analyticsKey: string;
  sentryDsn: string;
}

/**
 * Load configuration from environment variables
 */
const loadConfigFromEnv = (): EnvironmentConfig => {
  return {
    // App Info
    appName: Config.APP_NAME || 'Atomic',
    appVersion: Config.APP_VERSION || '1.0.0',
    environment: APP_ENV,

    // API Configuration
    apiBaseUrl: Config.API_BASE_URL || 'https://jsonplaceholder.typicode.com',
    apiTimeout: parseInt(Config.API_TIMEOUT || '30000', 10),

    // API Endpoints
    endpoints: {
      auth: {
        register: Config.API_AUTH_REGISTER || '/api/v1/auth/register',
        login: Config.API_AUTH_LOGIN || '/api/v1/auth/login',
      },
      me: Config.API_ME || '/api/v1/me',
      contacts: Config.API_CONTACTS || '/api/v1/contacts',
    },

    // Feature Flags
    enableLogging: Config.ENABLE_LOGGING === 'true' || __DEV__,
    enableDebugMode: Config.ENABLE_DEBUG_MODE === 'true' || __DEV__,
    enableReduxLogger: Config.ENABLE_REDUX_LOGGER === 'true' || __DEV__,

    // Third Party Services
    analyticsKey: Config.ANALYTICS_KEY || '',
    sentryDsn: Config.SENTRY_DSN || '',
  };
};

// Export current environment config
export const AppConfig = loadConfigFromEnv();

// Utility functions
export const isDevelopment = () => APP_ENV === 'development';
export const isProduction = () => APP_ENV === 'production';

// Log current environment (only in development)
if (AppConfig.enableLogging && __DEV__) {
  console.log('🌍 Environment:', AppConfig.environment);
  console.log('🔗 API Base URL:', AppConfig.apiBaseUrl);
  console.log(
    '🔧 Config loaded from:',
    Config.API_BASE_URL ? '.env file' : 'fallback values',
  );
}
