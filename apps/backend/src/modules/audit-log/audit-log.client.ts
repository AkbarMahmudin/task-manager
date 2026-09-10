import { AuditLog } from '@task-manager/shared-types';
import { IAuditLogClient } from '../../shared/clients/audit-log.client.interface';
import { IAuditLogRepository } from './interfaces/audit-log.repository.interface';

export class AuditLogClient implements IAuditLogClient {
  constructor(private readonly repo: IAuditLogRepository) {}

  async getLogsForTask(taskId: string): Promise<AuditLog[]> {
    return this.repo.findByTaskId(taskId);
  }

  async recordStatusChange(log: AuditLog): Promise<void> {
    this.repo.insert(log);
  }
}
