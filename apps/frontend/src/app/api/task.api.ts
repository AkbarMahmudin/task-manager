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

export type PaginationMeta = {
  page: number;
  limit: number;
  totalData: number;
  totalPages: number;
};

export type TaskListResult = {
  tasks: Task[];
  meta: PaginationMeta;
};

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const taskApi = {
  getAll: async (filter?: ITaskFilter): Promise<TaskListResult> => {
    const res = await apiClient.get<ApiResponse<Task[]>>('/tasks', {
      params: {
        page: filter?.page ?? DEFAULT_PAGE,
        limit: filter?.limit ?? DEFAULT_LIMIT,
        // Kirim search hanya kalau ada isinya, biar query params tetap bersih
        ...(filter?.search ? { search: filter.search } : {}),
      },
    });

    return {
      tasks: res.data?.data ?? [],
      // Fallback dijaga untuk backward-compat kalau backend belum kirim meta
      meta: res.data?.meta ?? {
        page: DEFAULT_PAGE,
        limit: DEFAULT_LIMIT,
        totalData: res.data?.data?.length ?? 0,
        totalPages: 1,
      },
    };
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
