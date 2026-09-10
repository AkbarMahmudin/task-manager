import {
  CreateTaskRequest,
  UpdateTaskStatusRequest,
  Task,
  TASK_STATUS_ORDER,
  AuditLog,
  UpdateTaskRequest,
} from '@task-manager/shared-types';
import { ITaskService } from './interfaces/task.service.interface';
import { ITaskRepository } from './interfaces/task.repository.interface';
import {
  DomainError,
  ForbiddenError,
  NotFoundError,
} from '../../shared/errors/domain.error';
import { randomUUID } from 'crypto';
import { IAuditLogClient } from '../../shared/clients/audit-log.client.interface';

export class TaskService implements ITaskService {
  constructor(
    private readonly repo: ITaskRepository,
    private readonly auditLogClient: IAuditLogClient,
  ) {}

  async getAllTasks(filter: { userId: string }): Promise<Task[]> {
    return this.repo.findAll(filter);
  }

  async getTaskById(taskId: string): Promise<Task> {
    const task = await this.repo.findById(taskId);

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    return task;
  }

  async createTask(data: CreateTaskRequest, userId: string): Promise<Task> {
    const now = new Date();
    const payload = {
      title: data.title,
      description: data.description,
      status: TASK_STATUS_ORDER[0],
      userId: userId,
      createdAt: now,
      updatedAt: now,
    };

    return this.repo.create(payload);
  }

  async updateTask(
    taskId: string,
    data: UpdateTaskRequest,
    userId: string,
  ): Promise<Task> {
    const task = await this.getTaskById(taskId);
    if (userId !== task.userId) {
      throw new ForbiddenError('You are not allowed this task');
    }

    return this.repo.update(taskId, data);
  }

  async updateTaskStatus(
    taskId: string,
    data: UpdateTaskStatusRequest,
    userId: string,
  ): Promise<Task> {
    const task = await this.getTaskById(taskId);
    const prevStatus = task.status;

    if (userId !== task.userId) {
      throw new ForbiddenError('You are not allowed this task');
    }

    task.status = data.newStatus;
    task.updatedAt = new Date();

    await this.repo.update(taskId, task);

    const auditLog: AuditLog = {
      id: randomUUID(),
      taskId: task.id,
      userId: userId,
      fromStatus: prevStatus,
      toStatus: data.newStatus,
      changedAt: task.updatedAt,
      description: this.buildLogDescription(
        task.title,
        prevStatus,
        data.newStatus,
      ),
    };

    await this.auditLogClient.recordStatusChange(auditLog);

    return task;
  }

  async deleteTask(taskId: string, userId: string): Promise<void> {
    const task = await this.getTaskById(taskId);
    if (userId !== task.userId) {
      throw new ForbiddenError('You are not allowed this task');
    }

    await this.repo.delete(taskId);
  }

  async getAuditLogs(taskId: string): Promise<AuditLog[]> {
    await this.getTaskById(taskId);

    return this.auditLogClient.getLogsForTask(taskId);
  }

  private validateTransition(from: Task['status'], to: Task['status']): void {
    const fromIndex = TASK_STATUS_ORDER.indexOf(from as any);
    const toIndex = TASK_STATUS_ORDER.indexOf(to as any);

    if (toIndex !== fromIndex + 1) {
      throw new DomainError(
        `Invalid transition: "${from}" → "${to}". ` +
          `Must follow order: ${TASK_STATUS_ORDER.join(' → ')}`,
        'INVALID_TRANSITION',
      );
    }
  }

  private buildLogDescription(
    taskTitle: string,
    from: Task['status'],
    to: Task['status'],
  ): string {
    const now = new Date().toISOString().replace('T', ' ').split('.')[0];
    return `Changed task "${taskTitle}" status from "${from}" to "${to}" at ${now}`;
  }
}
