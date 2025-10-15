import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import { Config } from '@config';
import { ApiError, ApiResponse } from '@types';
import { store } from '../store';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: Config.apiBaseUrl,
      timeout: Config.apiTimeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      config => {
        // Get token directly from Redux store
        const token = store.getState().auth.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log only in development
        if (Config.enableLogging) {
          console.log('Request:', config.method?.toUpperCase(), config.url);
        }
        return config;
      },
      error => {
        if (Config.enableLogging) {
          console.error('Request Error:', error);
        }
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        if (Config.enableLogging) {
          console.log('Response:', response.status, response.config.url);
        }

        // Extract data from wrapper response
        const wrappedData = response.data;

        // Check if response follows the standard format
        if (
          wrappedData &&
          typeof wrappedData === 'object' &&
          'data' in wrappedData
        ) {
          // Standard API response format: {status, status_code, message, data}
          if (wrappedData.status === 0) {
            // Handle API-level error (business logic error)
            const apiError: ApiError = {
              message: wrappedData.message || 'API error occurred',
              status: wrappedData.status_code,
            };
            console.error('API Error:', apiError);
            return Promise.reject(apiError);
          }
          // Return only the data part for success responses (status === 1)
          return { ...response, data: wrappedData.data } as any;
        }

        // If not wrapped, return as-is (for backward compatibility)
        return response;
      },
      (error: AxiosError<ApiResponse>) => {
        const apiError: ApiError = {
          message: error.message,
          status: error.response?.status,
          code: error.code,
        };

        if (error.response) {
          // Server responded with error
          const errorData = error.response.data;

          // Check if error follows standard format
          if (
            errorData &&
            typeof errorData === 'object' &&
            'message' in errorData
          ) {
            apiError.message = errorData.message;
            apiError.status = errorData.status_code || error.response.status;
          } else {
            apiError.message = 'Server error occurred';
            apiError.status = error.response.status;
          }

          if (error.response.status === 401) {
            // Handle unauthorized - redirect to login
            console.log('Unauthorized - redirect to login');
          } else if (error.response.status === 403) {
            // Handle forbidden
            console.log('Forbidden access');
          }
        } else if (error.request) {
          // Request made but no response
          apiError.message = 'No response from server';
        } else {
          // Something else happened
          apiError.message = error.message;
        }

        console.error('Response Error:', apiError);
        return Promise.reject(apiError);
      },
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data as T;
  }

  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data as T;
  }

  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data as T;
  }

  public async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data as T;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data as T;
  }
}

export const apiClient = new ApiClient();
