import React from 'react';
import {
  AuditLogDrawer,
  CreateTaskForm,
  TaskList,
  TaskPagination,
  TaskSearchBar,
} from '../features/task';
import { ClipboardList, SearchX } from 'lucide-react';
import {
  useCreateTask,
  useDeleteTask,
  useTasks,
  useUpdateTask,
  useUpdateTaskStatus,
} from '../hooks/use-task';
import { Skeleton } from '@task-manager/ui/components/skeleton';
import { useAuditLogs } from '../hooks/use-audit-log';

const PAGE_SIZE = 10;

export const TaskPage = () => {
  const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(
    null,
  );
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState('');

  const {
    data,
    isLoading,
    isError,
    isFetching,
  } = useTasks({ page, limit: PAGE_SIZE, search });
  const tasks = data?.tasks ?? [];
  const meta = data?.meta;

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const updateStatus = useUpdateTaskStatus();
  const deleteTask = useDeleteTask();

  const { data: auditLogs = [], isLoading: isLoadingLogs } =
    useAuditLogs(selectedTaskId);

  // Setiap kali kata kunci pencarian berubah, kembali ke halaman pertama
  // supaya user tidak "nyasar" di halaman yang mungkin sudah tidak ada.
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const isSearching = search.trim().length > 0;
  const showEmptyState = !isLoading && !isError && tasks.length === 0;

  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar /> */}
      <main className="container py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-left">
            <h1 className="text-2xl font-bold text-foreground">My Task</h1>
            <p className="text-sm text-muted-foreground">
              Manage and monitor all your assignments
            </p>
          </div>
          <CreateTaskForm
            onSubmit={(data) => createTask.mutate(data)}
            isSubmitting={createTask.isPending}
          />
        </div>

        <div className="mb-6">
          <TaskSearchBar value={search} onSearchChange={handleSearchChange} />
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
              Failed to load task. Please try again.
            </p>
          </div>
        )}

        {showEmptyState && isSearching && (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <SearchX className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-foreground">
              No task found
            </h3>
            <p className="text-sm text-muted-foreground">
              No task matches &ldquo;{search}&rdquo;. Try a different keyword.
            </p>
          </div>
        )}

        {showEmptyState && !isSearching && (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <ClipboardList className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-foreground">
              None Assignments
            </h3>
            <p className="text-sm text-muted-foreground">
              Start adding your first task!
            </p>
          </div>
        )}

        {!isLoading && !isError && tasks.length > 0 && (
          <>
            <TaskList
              tasks={tasks}
              logs={auditLogs ?? []}
              selectedTaskId={selectedTaskId}
              onSelectTask={(id) =>
                setSelectedTaskId((prev) => (prev === id ? null : id))
              }
              onUpdate={(taskId, data) => updateTask.mutate({ taskId, data })}
              onUpdateStatus={(taskId, data) =>
                updateStatus.mutate({ taskId, data })
              }
              onDelete={(taskId) => deleteTask.mutate(taskId)}
              isUpdatingStatus={updateStatus.isPending}
              isUpdating={updateTask.isPending}
              isDeleting={deleteTask.isPending}
            />

            {meta && (
              <TaskPagination
                page={meta.page}
                totalPages={meta.totalPages}
                totalData={meta.totalData}
                onPageChange={setPage}
                isFetching={isFetching}
              />
            )}
          </>
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
