import type {
  NodePgDatabase,
  NodePgQueryResultHKT,
} from 'drizzle-orm/node-postgres';
import { EmptyRelations } from 'drizzle-orm';
import { Pool } from 'pg';
import { PgAsyncTransaction } from 'drizzle-orm/pg-core';

export type DbInstance = NodePgDatabase<EmptyRelations> & {
  $client: Pool;
};

export interface IDbClient {
  getDb(): DbInstance;
  transaction<T>(
    fn: (
      trx: PgAsyncTransaction<NodePgQueryResultHKT, EmptyRelations>,
    ) => Promise<T>,
  ): Promise<T>;
}
