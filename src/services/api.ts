import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '@constants';
import { ApiError } from '@types';
import { store } from '../store';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
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
        console.log('Request:', config.method?.toUpperCase(), config.url);
        return config;
      },
      error => {
        console.error('Request Error:', error);
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log('Response:', response.status, response.config.url);
        return response;
      },
      (error: AxiosError) => {
        const apiError: ApiError = {
          message: error.message,
          status: error.response?.status,
          code: error.code,
        };

        if (error.response) {
          // Server responded with error
          apiError.message =
            (error.response.data as any)?.message || 'Server error occurred';
          apiError.status = error.response.status;

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
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  public async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
