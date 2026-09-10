import { AuditLog } from '@task-manager/shared-types';
import { IAuditLogRepository } from './interfaces/audit-log.repository.interface';
import { IDbClient } from '../../../shared/clients/db.client.interface';
import { auditLogs } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export class AuditLogRepository implements IAuditLogRepository {
  constructor(private readonly dbClient: IDbClient) {}

  async insert(log: AuditLog): Promise<void> {
    const db = this.dbClient.getDb();
    await db.insert(auditLogs).values({
      id: log.id,
      taskId: log.taskId,
      userId: log.userId,
      fromStatus: log.fromStatus,
      toStatus: log.toStatus,
      description: log.description,
    });
  }

  async findByTaskId(taskId: string): Promise<AuditLog[]> {
    const db = this.dbClient.getDb();

    const result = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.taskId, taskId));

    return result.map((row) => row as unknown as AuditLog);
  }

  async existsByTaskId(taskId: string): Promise<boolean> {
    const db = this.dbClient.getDb();
    const result = await db.$count(auditLogs, eq(auditLogs.taskId, taskId));

    return result < 1;
  }
}
