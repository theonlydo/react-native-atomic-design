/**
 * Environment Configuration
 *
 * This file manages environment-specific configurations.
 * For simplicity, we're using hardcoded values now.
 * You can switch back to react-native-config later if needed.
 */

export type Environment = 'development' | 'production';

// Get environment
export const APP_ENV: Environment = __DEV__ ? 'development' : 'production';

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
 * Load configuration
 */
const loadConfig = (): EnvironmentConfig => {
  return {
    // App Info
    appName: 'Atomic',
    appVersion: '1.0.0',
    environment: APP_ENV,

    // API Configuration
    apiBaseUrl: 'http://13.229.87.19',
    apiTimeout: 30000,

    // API Endpoints
    endpoints: {
      auth: {
        register: '/api/v1/auth/register',
        login: '/api/v1/auth/login',
      },
      me: '/api/v1/me',
      contacts: '/api/v1/contacts',
    },

    // Feature Flags
    enableLogging: __DEV__,
    enableDebugMode: __DEV__,
    enableReduxLogger: __DEV__,

    // Third Party Services
    analyticsKey: '',
    sentryDsn: '',
  };
};

// Export current environment config
export const AppConfig = loadConfig();

// Utility functions
export const isDevelopment = () => APP_ENV === 'development';
export const isProduction = () => APP_ENV === 'production';

// Log current environment (only in development)
if (AppConfig.enableLogging && __DEV__) {
  console.log('🌍 Environment:', AppConfig.environment);
  console.log('🔗 API Base URL:', AppConfig.apiBaseUrl);
}
