import { useQuery } from '@tanstack/react-query';
import { taskApi } from '../api/task.api';

export const auditLogKeys = {
  forTask: (taskId: string) => ['tasks', taskId, 'audit-logs'] as const,
} as const;

// Sengaja tidak jadi satu file dengan use-tasks.ts
// Audit log punya query key namespace sendiri dan akan berkembang sendiri
export function useAuditLogs(taskId: string | null) {
  return useQuery({
    queryKey: auditLogKeys.forTask(taskId ?? ''),
    queryFn: () => taskApi.getAuditLogs(taskId!),

    // Hanya fetch ketika taskId tersedia
    // Ketika drawer dibuka dan taskId di-set, query otomatis trigger
    enabled: !!taskId,

    // Log tidak sering berubah kecuali user baru saja update status
    // invalidasi sudah ditangani oleh useUpdateTaskStatus
    staleTime: Infinity,
  });
}
