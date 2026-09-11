import {
  Task,
  CreateTaskRequest,
  UpdateTaskStatusRequest,
  AuditLog,
  UpdateTaskRequest,
} from '@task-manager/shared-types';
import { ITaskFindAllFilter, TaskWithMeta } from './task.dto.interface';

export interface ITaskService {
  getAllTasks(filter: ITaskFindAllFilter): Promise<TaskWithMeta>;

  getTaskById(taskId: string, userId: string): Promise<Task>;

  createTask(data: CreateTaskRequest, userId: string): Promise<Task>;

  updateTask(
    taskId: string,
    data: UpdateTaskRequest,
    userId: string,
  ): Promise<Task>;

  updateTaskStatus(
    taskId: string,
    data: UpdateTaskStatusRequest,
    userId: string,
  ): Promise<Task>;

  deleteTask(taskId: string, userId: string): Promise<void>;

  // ── Audit Log Operations ──────────────────────────────

  getAuditLogs(taskId: string, userId: string): Promise<AuditLog[]>;
}
