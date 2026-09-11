import axios, { AxiosError } from 'axios';
import { ApiError } from '@task-manager/shared-types';
import { AppError } from './error';
import { clearToken, getToken } from '../lib/auth';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,

  (error: AxiosError<ApiError>) => {
    const backendError = error.response?.data;

    // Case 1: Backend merespon dengan ApiError shape yang kita kenal
    if (backendError && !backendError.success) {
      throw new AppError(
        backendError.error,
        backendError.code,
        error.response!.status,
      );
    }

    // Case 2: Error tidak punya response (network down, timeout, CORS)
    if (!error.response) {
      throw new AppError(
        'Cannot reach server. Check your connection.',
        'VALIDATION_ERROR',
        0,
      );
    }

    // Case 3: Response ada tapi shape tidak dikenali (unexpected 500, proxy error)
    throw new AppError(
      'An unexpected error occurred',
      'VALIDATION_ERROR',
      error.response.status,
    );
  },
);
