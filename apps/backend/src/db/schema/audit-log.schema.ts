import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { tasks } from './task.schema';

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  taskId: uuid('task_id')
    .notNull()
    .references(() => tasks.id),
  previousStatus: text('previous_status').notNull(),
  newStatus: text('new_status').notNull(),
  actor: text('actor').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
