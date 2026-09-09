/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve(__dirname, 'apps/backend/.env') });

export default defineConfig({
  schema: './apps/backend/src/db/schema/index.ts',
  out: './apps/backend/src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
});
