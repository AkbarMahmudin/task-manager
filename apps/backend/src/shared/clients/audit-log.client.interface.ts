import { AuditLog } from '@task-manager/shared-types';

export interface IAuditLogClient {
  insert(log: AuditLog): Promise<void>;

  findByTaskId(taskId: string): Promise<AuditLog[]>;
}
