import {
  AuditLog,
  CreateTaskRequest,
  Task,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
} from '@task-manager/shared-types';

// ── AuditLogDrawer ──────────────────────────────────────────────────────────
export interface AuditLogDrawerProps {
  logs?: AuditLog[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
}

// ── CreateTaskForm ──────────────────────────────────────────────────────────
export interface CreateTaskFormProps {
  onSubmit: (data: CreateTaskRequest) => void;
  isSubmitting: boolean;
}

// ── UpdateTaskForm ──────────────────────────────────────────────────────────
export interface UpdateTaskFormProps {
  task: Task;
  onSubmit: (taskId: string, data: UpdateTaskRequest) => void;
  isSubmitting: boolean;
}

// ── DeleteTaskButton ──────────────────────────────────────────────────────────
export interface DeleteTaskButtonProps {
  taskId: string;
  taskTitle: string;
  onConfirm: (taskId: string) => void;
  isDeleting: boolean;
}

// ── TaskDetailButton ──────────────────────────────────────────────────────────
export interface TaskDetailButtonProps {
  task: Task;
  onAuditLogOpen: (taskId: string) => void;
}

// ── TaskItem ──────────────────────────────────────────────────────────
export interface TaskItemProps {
  task: Task;
  isSelected: boolean;
  onSelectTask: (taskId: string) => void;
  onUpdate: (taskId: string, data: UpdateTaskRequest) => void;
  onUpdateStatus: (taskId: string, data: UpdateTaskStatusRequest) => void;
  onDelete: (taskId: string) => void;
  isUpdatingStatus: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

// ── TaskList ──────────────────────────────────────────────────────────
export interface TaskListProps {
  tasks: Task[];
  logs?: AuditLog[];
  selectedTaskId: string | null;
  onSelectTask: (taskId: string) => void;
  onUpdate: (taskId: string, data: UpdateTaskRequest) => void;
  onUpdateStatus: (taskId: string, data: UpdateTaskStatusRequest) => void;
  onDelete: (taskId: string) => void;
  isUpdatingStatus: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

// ── UpdateStatusSelect ──────────────────────────────────────────────────────────
export interface UpdateStatusSelectProps {
  defaultStatus: string;
  onSelect: (data: UpdateTaskStatusRequest) => void;
  isSubmitting: boolean;
}

// ── TaskSearchBar ──────────────────────────────────────────────────────────
export interface TaskSearchBarProps {
  value: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

// ── TaskPagination ──────────────────────────────────────────────────────────
export interface TaskPaginationProps {
  page: number;
  totalPages: number;
  totalData: number;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
}
