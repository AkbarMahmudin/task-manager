import React from 'react';
import { AuditLogDrawer, CreateTaskForm, TaskList } from '../features/task';
import { ClipboardList } from 'lucide-react';
import {
  useCreateTask,
  useDeleteTask,
  useTasks,
  useUpdateTaskStatus,
} from '../hooks/use-task';
import { Skeleton } from '@task-manager/ui/components/skeleton';
import { useAuditLogs } from '../hooks/use-audit-log';

export const TaskPage = () => {
  const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(
    null,
  );

  const { data: tasks = [], isLoading, isError } = useTasks();
  const createTask = useCreateTask();
  const updateStatus = useUpdateTaskStatus();
  const deleteTask = useDeleteTask();

  const { data: auditLogs = [], isLoading: isLoadingLogs } =
    useAuditLogs(selectedTaskId);

  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar /> */}
      <main className="container py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-left">
            <h1 className="text-2xl font-bold text-foreground">My Task</h1>
            <p className="text-sm text-muted-foreground">
              Manage and monitor all your tasks
            </p>
          </div>
          <CreateTaskForm
            onSubmit={(data) => createTask.mutate(data)}
            isSubmitting={createTask.isPending}
          />
        </div>

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center">
            <p className="text-destructive">
              Gagal memuat tugas. Silakan coba lagi.
            </p>
          </div>
        )}

        {!isLoading && !isError && tasks?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <ClipboardList className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-foreground">
              Belum ada tugas
            </h3>
            <p className="text-sm text-muted-foreground">
              Mulai tambahkan tugas pertama Anda!
            </p>
          </div>
        )}

        {!isLoading && !isError && tasks.length > 0 && (
          <TaskList
            tasks={tasks}
            logs={auditLogs ?? []}
            selectedTaskId={selectedTaskId}
            onSelectTask={(id) =>
              setSelectedTaskId((prev) => (prev === id ? null : id))
            }
            onUpdateStatus={(taskId, data) =>
              updateStatus.mutate({ taskId, data })
            }
            onDelete={(taskId) => deleteTask.mutate(taskId)}
            isUpdatingStatus={updateStatus.isPending}
            isDeleting={deleteTask.isPending}
          />
        )}
      </main>

      <AuditLogDrawer
        open={!!selectedTaskId}
        onOpenChange={(open) => !open && setSelectedTaskId(null)}
        logs={auditLogs}
        isLoading={isLoadingLogs}
      />
    </div>
  );
};
