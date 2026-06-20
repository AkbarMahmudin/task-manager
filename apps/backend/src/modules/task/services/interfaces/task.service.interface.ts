import {
  Task,
  CreateTaskRequest,
  UpdateTaskStatusRequest,
  AuditLog,
} from '@task-manager/shared-types';

export interface ITaskService {
  getAllTasks(): Promise<Task[]>;

  getTaskById(taskId: string): Promise<Task>;

  createTask(data: CreateTaskRequest): Promise<Task>;

  updateTaskStatus(
    taskId: string,
    data: UpdateTaskStatusRequest,
  ): Promise<Task>;

  deleteTask(taskId: string): Promise<void>;

  // ── Audit Log Operations ──────────────────────────────

  getAuditLogs(taskId: string): Promise<AuditLog[]>;
}
