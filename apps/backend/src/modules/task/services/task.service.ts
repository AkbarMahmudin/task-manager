import {
  CreateTaskRequest,
  UpdateTaskStatusRequest,
  Task,
  TASK_STATUS_ORDER,
  AuditLog,
} from '@task-manager/shared-types';
import { ITaskService } from './interfaces/task.service.interface';
import { ITaskRepository } from '../repositories/interfaces/task.repository.interface';
import { DomainError } from '../../../shared/errors/domain.error';
import { randomUUID } from 'crypto';
import { IAuditLogClient } from '../../../shared/clients/audit-log.client.interface';

export class TaskService implements ITaskService {
  constructor(
    private readonly repo: ITaskRepository,
    private readonly auditLogClient: IAuditLogClient,
  ) {}

  async getAllTasks(): Promise<Task[]> {
    return this.repo.findAll();
  }

  async getTaskById(taskId: string): Promise<Task> {
    const task = await this.repo.findById(taskId);

    if (!task) {
      throw new DomainError('Task not found', 'TASK_NOT_FOUND');
    }

    return task;
  }

  async createTask(data: CreateTaskRequest): Promise<Task> {
    const task = {
      id: randomUUID(),
      title: data.title,
      description: data.description,
      status: TASK_STATUS_ORDER[0],
      createdAt: new Date(),
      updatedAt: null,
    };

    await this.repo.save(task);

    return task;
  }

  async updateTaskStatus(
    taskId: string,
    data: UpdateTaskStatusRequest,
  ): Promise<Task> {
    const task = await this.getTaskById(taskId);
    const prevStatus = task.status;

    if (task.status === data.newStatus) {
      throw new DomainError(
        `Task is already in status "${data.newStatus}". No changes made.`,
        'IDEMPOTENT_UPDATE',
      );
    }

    this.validateTransition(task.status, data.newStatus);

    task.status = data.newStatus;
    task.updatedAt = new Date();

    await this.repo.save(task);

    // TODO: add to audit log
    const auditLog: AuditLog = {
      id: randomUUID(),
      taskId: task.id,
      actor: data.actor,
      fromStatus: prevStatus,
      toStatus: data.newStatus,
      changedAt: task.updatedAt,
      description: this.buildLogDescription(
        data.actor,
        task.title,
        prevStatus,
        data.newStatus,
      ),
    };

    await this.auditLogClient.recordStatusChange(auditLog);

    return task;
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.getTaskById(taskId);

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
    actor: string,
    taskTitle: string,
    from: Task['status'],
    to: Task['status'],
  ): string {
    const now = new Date().toISOString().replace('T', ' ').split('.')[0];
    return `User "${actor}" changed Task "${taskTitle}" status from "${from}" to "${to}" at ${now}`;
  }
}
