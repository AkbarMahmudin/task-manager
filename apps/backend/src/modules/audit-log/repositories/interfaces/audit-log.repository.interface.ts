import { AuditLog } from '@task-manager/shared-types';

export interface IAuditLogRepository {
  insert(log: AuditLog): Promise<void>;

  findByTaskId(taskId: string): Promise<AuditLog[]>;

  existsByTaskId(taskId: string): Promise<boolean>;
}
