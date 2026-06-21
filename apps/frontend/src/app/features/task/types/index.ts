import {
  AuditLog,
  CreateTaskRequest,
  Task,
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
  onUpdateStatus: (taskId: string, data: UpdateTaskStatusRequest) => void;
  onDelete: (taskId: string) => void;
  isUpdatingStatus: boolean;
  isDeleting: boolean;
}

// ── TaskList ──────────────────────────────────────────────────────────
export interface TaskListProps {
  tasks: Task[];
  logs?: AuditLog[];
  selectedTaskId: string | null;
  onSelectTask: (taskId: string) => void;
  onUpdateStatus: (taskId: string, data: UpdateTaskStatusRequest) => void;
  onDelete: (taskId: string) => void;
  isUpdatingStatus: boolean;
  isDeleting: boolean;
}

// ── UpdateStatusDialog ──────────────────────────────────────────────────────────
export interface UpdateStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
  onConfirm: (data: UpdateTaskStatusRequest) => void;
  isSubmitting: boolean;
}
