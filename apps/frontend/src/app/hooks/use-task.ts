import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  CreateTaskRequest,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
} from '@task-manager/shared-types';
import { taskApi } from '../api/task.api';
import { auditLogKeys } from './use-audit-log';

export const taskKeys = {
  all: () => ['tasks'] as const,
  detail: (id: string) => ['tasks', id] as const,
} as const;

export function useTasks() {
  return useQuery({
    queryKey: taskKeys.all(),
    queryFn: taskApi.getAll,
  });
}

export function useTask(taskId: string) {
  return useQuery({
    queryKey: taskKeys.detail(taskId),
    queryFn: () => taskApi.getById(taskId),
    // Tidak fetch kalau taskId kosong string
    enabled: !!taskId,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskRequest) => taskApi.create(data),

    onSuccess: () => {
      // Invalidate list — task baru harus muncul di list
      queryClient.invalidateQueries({ queryKey: taskKeys.all() });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  // taskId masuk sebagai bagian dari variables, bukan parameter hook
  // Alasan: satu hook instance bisa dipakai untuk update task manapun di list
  // Kalau taskId di parameter hook, harus buat instance per task
  return useMutation({
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: string;
      data: UpdateTaskRequest;
    }) => taskApi.update(taskId, data),

    onSuccess: (_, variables) => {
      // Invalidate list — status badge di list harus update
      queryClient.invalidateQueries({ queryKey: taskKeys.all() });

      // Invalidate audit log task yang bersangkutan
      // Kalau drawer log sedang terbuka, log langsung refresh
      queryClient.invalidateQueries({
        queryKey: auditLogKeys.forTask(variables.taskId),
      });
    },
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  // taskId masuk sebagai bagian dari variables, bukan parameter hook
  // Alasan: satu hook instance bisa dipakai untuk update task manapun di list
  // Kalau taskId di parameter hook, harus buat instance per task
  return useMutation({
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: string;
      data: UpdateTaskStatusRequest;
    }) => taskApi.updateStatus(taskId, data),

    onSuccess: (_, variables) => {
      // Invalidate list — status badge di list harus update
      queryClient.invalidateQueries({ queryKey: taskKeys.all() });

      // Invalidate audit log task yang bersangkutan
      // Kalau drawer log sedang terbuka, log langsung refresh
      queryClient.invalidateQueries({
        queryKey: auditLogKeys.forTask(variables.taskId),
      });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => taskApi.remove(taskId),

    onSuccess: () => {
      // Cukup invalidate list — detail dan audit log
      // tidak perlu diclean karena task sudah tidak bisa diakses
      queryClient.invalidateQueries({ queryKey: taskKeys.all() });
    },
  });
}
