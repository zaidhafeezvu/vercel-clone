import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  userId: text('user_id').notNull(), // Just store the user ID as text without FK constraint
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const deployments = sqliteTable('deployments', {
  id: text('id').primaryKey(),
  projectId: text('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  status: text('status').notNull(), // 'pending', 'building', 'success', 'error'
  url: text('url'),
  commitMessage: text('commit_message'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});