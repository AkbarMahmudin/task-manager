import type {
  Task,
  AuditLog,
  CreateTaskRequest,
  UpdateTaskStatusRequest,
  ApiResponse,
  UpdateTaskRequest,
  TaskStatus,
} from '@task-manager/shared-types';
import { apiClient } from './client';

export type ITaskFilter = {
  status?: TaskStatus;
  page?: number;
  limit?: number;
  search?: string;
};

export const taskApi = {
  getAll: async (filter: ITaskFilter): Promise<Task[]> => {
    const res = await apiClient.get<ApiResponse<Task[]>>('/tasks', {
      params: {
        page: filter?.page ?? 1,
        limit: filter?.limit ?? 100,
        search: filter?.search ?? '',
      },
    });
    return res.data?.data ?? [];
  },

  getById: async (taskId: string): Promise<Task> => {
    const res = await apiClient.get<ApiResponse<Task>>(`/tasks/${taskId}`);
    return res.data.data;
  },

  create: async (data: CreateTaskRequest): Promise<Task> => {
    const res = await apiClient.post<ApiResponse<Task>>('/tasks', data);
    return res.data.data;
  },

  update: async (taskId: string, data: UpdateTaskRequest): Promise<Task> => {
    const res = await apiClient.patch<ApiResponse<Task>>(
      `/tasks/${taskId}`,
      data,
    );
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
      `/tasks/${taskId}/logs`,
    );
    return res.data.data;
  },
} as const;
