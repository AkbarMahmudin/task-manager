import { Pool } from 'pg';
import { IDbClient } from '../shared/clients/db.client.interface';
import { DrizzleDbClient } from './db.client';

export function createDbClient(): IDbClient {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return new DrizzleDbClient(pool);
}
