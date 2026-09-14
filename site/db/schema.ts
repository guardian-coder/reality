import { integer, sqliteTable, text, uniqueIndex, index } from 'drizzle-orm/sqlite-core';

export const workspaces = sqliteTable('economic_workspaces', {
  id: text('id').primaryKey(),
  ownerId: text('owner_id').notNull(),
  name: text('name').notNull(),
  tokenHash: text('token_hash').notNull(),
  tokenPrefix: text('token_prefix').notNull(),
  createdAt: text('created_at').notNull(),
}, (table) => [uniqueIndex('idx_economic_workspaces_owner').on(table.ownerId)]);

export const tasks = sqliteTable('economic_tasks', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  externalId: text('external_id').notNull(),
  objective: text('objective').notNull(),
  budgetMicros: integer('budget_micros').notNull(),
  estimatedValueMicros: integer('estimated_value_micros').notNull(),
  criteriaJson: text('criteria_json').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (table) => [
  uniqueIndex('idx_economic_tasks_workspace_external').on(table.workspaceId, table.externalId),
  index('idx_economic_tasks_workspace_updated').on(table.workspaceId, table.updatedAt),
]);

export const runs = sqliteTable('economic_runs', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  taskExternalId: text('task_external_id').notNull(),
  runId: text('run_id').notNull(),
  contractJson: text('contract_json').notNull(),
  budgetMicros: integer('budget_micros').notNull(),
  estimatedValueMicros: integer('estimated_value_micros').notNull(),
  policyVersion: text('policy_version').notNull(),
  createdAt: text('created_at').notNull(),
}, (table) => [
  uniqueIndex('idx_economic_runs_workspace_run').on(table.workspaceId, table.taskExternalId, table.runId),
  index('idx_economic_runs_workspace_created').on(table.workspaceId, table.createdAt),
]);

export const events = sqliteTable('economic_events', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  taskExternalId: text('task_external_id').notNull(),
  runId: text('run_id').notNull(),
  eventType: text('event_type').notNull(),
  category: text('category'),
  label: text('label').notNull(),
  costMicros: integer('cost_micros').notNull().default(0),
  criterionId: text('criterion_id'),
  evidenceState: text('evidence_state'),
  source: text('source'),
  occurredAt: text('occurred_at').notNull(),
  receivedAt: text('received_at').notNull(),
  rawJson: text('raw_json').notNull(),
}, (table) => [
  index('idx_economic_events_workspace_task').on(table.workspaceId, table.taskExternalId),
  index('idx_economic_events_workspace_received').on(table.workspaceId, table.receivedAt),
]);

export const authorizations = sqliteTable('economic_authorizations', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  taskExternalId: text('task_external_id').notNull(),
  runId: text('run_id').notNull(),
  actionExternalId: text('action_external_id').notNull(),
  category: text('category').notNull(),
  label: text('label').notNull(),
  estimatedCostMicros: integer('estimated_cost_micros').notNull(),
  disposition: text('disposition').notNull(),
  reasonCode: text('reason_code').notNull(),
  policyVersion: text('policy_version').notNull(),
  createdAt: text('created_at').notNull(),
  consumedAt: text('consumed_at'),
}, (table) => [
  uniqueIndex('idx_economic_authorizations_action').on(table.workspaceId, table.taskExternalId, table.runId, table.actionExternalId),
  index('idx_economic_authorizations_workspace_created').on(table.workspaceId, table.createdAt),
]);

export const records = sqliteTable('economic_records', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  taskExternalId: text('task_external_id').notNull(),
  runId: text('run_id').notNull(),
  disposition: text('disposition').notNull(),
  actualCostMicros: integer('actual_cost_micros').notNull(),
  acceptedValueMicros: integer('accepted_value_micros').notNull(),
  policyVersion: text('policy_version').notNull(),
  recordJson: text('record_json').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (table) => [
  uniqueIndex('idx_economic_records_run').on(table.workspaceId, table.taskExternalId, table.runId),
  index('idx_economic_records_workspace_updated').on(table.workspaceId, table.updatedAt),
]);
