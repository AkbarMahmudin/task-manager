import type {
  Task,
  AuditLog,
  CreateTaskRequest,
  UpdateTaskStatusRequest,
  ApiResponse,
} from '@task-manager/shared-types';
import { apiClient } from './client';

export const taskApi = {
  getAll: async (): Promise<Task[]> => {
    const res = await apiClient.get<ApiResponse<Task[]>>('/tasks');
    return res.data.data;
  },

  getById: async (taskId: string): Promise<Task> => {
    const res = await apiClient.get<ApiResponse<Task>>(`/tasks/${taskId}`);
    return res.data.data;
  },

  create: async (data: CreateTaskRequest): Promise<Task> => {
    const res = await apiClient.post<ApiResponse<Task>>('/tasks', data);
    return res.data.data;
  },

  updateStatus: async (
    taskId: string,
    data: UpdateTaskStatusRequest,
  ): Promise<Task> => {
    const res = await apiClient.patch<ApiResponse<Task>>(
      `/tasks/${taskId}/status`,
      data,
    );
    return res.data.data;
  },

  remove: async (taskId: string): Promise<void> => {
    await apiClient.delete(`/tasks/${taskId}`);
  },

  getAuditLogs: async (taskId: string): Promise<AuditLog[]> => {
    const res = await apiClient.get<ApiResponse<AuditLog[]>>(
      `/tasks/${taskId}/audit-logs`,
    );
    return res.data.data;
  },
} as const;
