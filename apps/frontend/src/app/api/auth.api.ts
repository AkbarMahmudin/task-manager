import {
  ApiResponse,
  AuthUserRequest,
  CreateUserRequest,
  User,
} from '@task-manager/shared-types';
import { apiClient } from './client';

export const authApi = {
  register: async (
    data: CreateUserRequest,
  ): Promise<User & { token: string }> => {
    const res = await apiClient.post<ApiResponse<User & { token: string }>>(
      '/auth/register',
      data,
    );
    return res.data.data;
  },

  login: async (data: AuthUserRequest): Promise<{ token: string }> => {
    const res = await apiClient.post<ApiResponse<{ token: string }>>(
      '/auth/login',
      data,
    );
    return res.data.data;
  },

  profile: async (): Promise<User> => {
    const res = await apiClient.get<ApiResponse<User>>('/auth/profile');
    return res.data.data;
  },
};
