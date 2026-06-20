import { AuditLogRepository } from './repositories/audit-log.repository';
import { IAuditLogClient } from '../../shared/clients/audit-log.client.interface';
import { AuditLogClient } from './services/audit-log.client';

export interface AuditLogModule {
  client: IAuditLogClient;
}

export function createAuditLogModule(): AuditLogModule {
  const auditLogRepo = new AuditLogRepository();

  const client = new AuditLogClient(auditLogRepo);

  return { client };
}
