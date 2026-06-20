import { AuditLog } from '@task-manager/shared-types';
import { IAuditLogRepository } from './interfaces/audit-log.repository.interface';

export class AuditLogRepository implements IAuditLogRepository {
  private readonly store = new Map<string, AuditLog>();

  async insert(log: AuditLog): Promise<void> {
    this.store.set(log.id, log);
  }

  async findByTaskId(taskId: string): Promise<AuditLog[]> {
    const logs = Array.from(this.store.values());

    return logs.filter((log) => log.taskId === taskId);
  }

  async existsByTaskId(taskId: string): Promise<boolean> {
    const logs = Array.from(this.store.values());

    return !!logs.find((log) => log.taskId === taskId);
  }
}
