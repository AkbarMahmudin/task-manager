import { pgTable, uuid, timestamp, varchar } from 'drizzle-orm/pg-core';
import { tasks } from './task.schema';
import { users } from './user.schema';

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  taskId: uuid('task_id')
    .notNull()
    .references(() => tasks.id, { onDelete: 'cascade' }),
  fromStatus: varchar('from_status', { length: 20 }).notNull(),
  toStatus: varchar('to_status', { length: 20 }).notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  description: varchar('description', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
