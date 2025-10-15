/**
 * Environment Configuration
 *
 * This file manages environment-specific configurations.
 * To switch between environments, change the APP_ENV constant.
 */

export type Environment = 'development' | 'production';

// 🔧 CHANGE THIS TO SWITCH ENVIRONMENT
export const APP_ENV: Environment = __DEV__ ? 'development' : 'production';

interface EnvironmentConfig {
  // App Info
  appName: string;
  appVersion: string;
  environment: Environment;

  // API Configuration
  apiBaseUrl: string;
  apiTimeout: number;

  // Feature Flags
  enableLogging: boolean;
  enableDebugMode: boolean;
  enableReduxLogger: boolean;

  // Third Party Services
  analyticsKey: string;
  sentryDsn: string;
}

/**
 * Development Environment Configuration
 */
const developmentConfig: EnvironmentConfig = {
  appName: 'Atomic Dev',
  appVersion: '1.0.0',
  environment: 'development',

  apiBaseUrl: 'https://jsonplaceholder.typicode.com',
  apiTimeout: 30000, // 30 seconds

  enableLogging: true,
  enableDebugMode: true,
  enableReduxLogger: true,

  analyticsKey: 'dev_analytics_key_here',
  sentryDsn: '',
};

/**
 * Production Environment Configuration
 */
const productionConfig: EnvironmentConfig = {
  appName: 'Atomic',
  appVersion: '1.0.0',
  environment: 'production',

  apiBaseUrl: 'https://api.production.com',
  apiTimeout: 15000, // 15 seconds

  enableLogging: false,
  enableDebugMode: false,
  enableReduxLogger: false,

  analyticsKey: 'prod_analytics_key_here',
  sentryDsn: 'https://your-sentry-dsn@sentry.io/project-id',
};

/**
 * Get configuration based on current environment
 */
const getConfig = (): EnvironmentConfig => {
  switch (APP_ENV) {
    case 'production':
      return productionConfig;
    case 'development':
    default:
      return developmentConfig;
  }
};

// Export current environment config
export const Config = getConfig();

// Export individual configs for testing or manual selection
export const DevConfig = developmentConfig;
export const ProdConfig = productionConfig;

// Utility functions
export const isDevelopment = () => APP_ENV === 'development';
export const isProduction = () => APP_ENV === 'production';

// Log current environment (only in development)
if (Config.enableLogging) {
  console.log('🌍 Environment:', Config.environment);
  console.log('🔗 API Base URL:', Config.apiBaseUrl);
}
