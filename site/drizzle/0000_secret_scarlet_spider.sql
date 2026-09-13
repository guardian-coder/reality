CREATE TABLE `economic_events` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`task_external_id` text NOT NULL,
	`run_id` text NOT NULL,
	`event_type` text NOT NULL,
	`category` text,
	`label` text NOT NULL,
	`cost_micros` integer DEFAULT 0 NOT NULL,
	`criterion_id` text,
	`evidence_state` text,
	`source` text,
	`occurred_at` text NOT NULL,
	`received_at` text NOT NULL,
	`raw_json` text NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `economic_workspaces`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_economic_events_workspace_task` ON `economic_events` (`workspace_id`,`task_external_id`);--> statement-breakpoint
CREATE INDEX `idx_economic_events_workspace_received` ON `economic_events` (`workspace_id`,`received_at`);--> statement-breakpoint
CREATE TABLE `economic_tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`external_id` text NOT NULL,
	`objective` text NOT NULL,
	`budget_micros` integer NOT NULL,
	`estimated_value_micros` integer NOT NULL,
	`criteria_json` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `economic_workspaces`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_economic_tasks_workspace_external` ON `economic_tasks` (`workspace_id`,`external_id`);--> statement-breakpoint
CREATE INDEX `idx_economic_tasks_workspace_updated` ON `economic_tasks` (`workspace_id`,`updated_at`);--> statement-breakpoint
CREATE TABLE `economic_workspaces` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`token_hash` text NOT NULL,
	`token_prefix` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_economic_workspaces_owner` ON `economic_workspaces` (`owner_id`);