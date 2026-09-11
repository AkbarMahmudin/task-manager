// import { drizzle } from 'drizzle-orm/node-postgres';
// import { Pool } from 'pg';

// const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// export const db = drizzle({ client: pool });

// db/db.client.ts
import { drizzle, NodePgQueryResultHKT } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import type {
  IDbClient,
  DbInstance,
} from '../shared/clients/db.client.interface';
import { PgAsyncTransaction } from 'drizzle-orm/pg-core';
import { EmptyRelations } from 'drizzle-orm';

export class DrizzleDbClient implements IDbClient {
  private readonly db: DbInstance;

  constructor(private readonly pool: Pool) {
    this.db = drizzle({ client: this.pool });
  }

  getDb(): DbInstance {
    return this.db;
  }

  async transaction<T>(
    fn: (
      trx: PgAsyncTransaction<NodePgQueryResultHKT, EmptyRelations>,
    ) => Promise<T>,
  ): Promise<T> {
    return this.db.transaction(fn);
  }
}
