declare module 'react-native-config' {
  export interface NativeConfig {
    // App info
    APP_NAME?: string;
    APP_VERSION?: string;
    APP_ENV?: string;

    // API Configuration
    API_BASE_URL?: string;
    API_TIMEOUT?: string;

    // API Endpoints
    API_AUTH_REGISTER?: string;
    API_AUTH_LOGIN?: string;
    API_ME?: string;
    API_CONTACTS?: string;

    // Feature Flags
    ENABLE_LOGGING?: string;
    ENABLE_DEBUG_MODE?: string;
    ENABLE_REDUX_LOGGER?: string;

    // Third Party Services
    ANALYTICS_KEY?: string;
    SENTRY_DSN?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
