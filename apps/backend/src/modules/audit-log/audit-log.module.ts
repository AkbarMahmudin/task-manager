import { AuditLogRepository } from './audit-log.repository';
import { IAuditLogClient } from '../../shared/clients/audit-log.client.interface';
import { AuditLogClient } from './audit-log.client';
import { IDbClient } from '../../shared/clients/db.client.interface';

export interface AuditLogModuleDependencies {
  dbClient: IDbClient;
}

export interface AuditLogModule {
  client: IAuditLogClient;
}

export function createAuditLogModule(
  deps: AuditLogModuleDependencies,
): AuditLogModule {
  const auditLogRepo = new AuditLogRepository(deps.dbClient);

  const client = new AuditLogClient(auditLogRepo);

  return { client };
}
