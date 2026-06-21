import { AuditLog } from '@task-manager/shared-types';

export interface IAuditLogClient {
  recordStatusChange(log: AuditLog): Promise<void>;

  getLogsForTask(taskId: string): Promise<AuditLog[]>;
}
