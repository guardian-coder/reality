CREATE TABLE `economic_authorizations` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`task_external_id` text NOT NULL,
	`run_id` text NOT NULL,
	`action_external_id` text NOT NULL,
	`category` text NOT NULL,
	`label` text NOT NULL,
	`estimated_cost_micros` integer NOT NULL,
	`disposition` text NOT NULL,
	`reason_code` text NOT NULL,
	`policy_version` text NOT NULL,
	`created_at` text NOT NULL,
	`consumed_at` text,
	FOREIGN KEY (`workspace_id`) REFERENCES `economic_workspaces`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_economic_authorizations_action` ON `economic_authorizations` (`workspace_id`,`task_external_id`,`run_id`,`action_external_id`);--> statement-breakpoint
CREATE INDEX `idx_economic_authorizations_workspace_created` ON `economic_authorizations` (`workspace_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `economic_records` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`task_external_id` text NOT NULL,
	`run_id` text NOT NULL,
	`disposition` text NOT NULL,
	`actual_cost_micros` integer NOT NULL,
	`accepted_value_micros` integer NOT NULL,
	`policy_version` text NOT NULL,
	`record_json` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `economic_workspaces`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_economic_records_run` ON `economic_records` (`workspace_id`,`task_external_id`,`run_id`);--> statement-breakpoint
CREATE INDEX `idx_economic_records_workspace_updated` ON `economic_records` (`workspace_id`,`updated_at`);--> statement-breakpoint
CREATE TABLE `economic_runs` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`task_external_id` text NOT NULL,
	`run_id` text NOT NULL,
	`contract_json` text NOT NULL,
	`budget_micros` integer NOT NULL,
	`estimated_value_micros` integer NOT NULL,
	`policy_version` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `economic_workspaces`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_economic_runs_workspace_run` ON `economic_runs` (`workspace_id`,`task_external_id`,`run_id`);--> statement-breakpoint
CREATE INDEX `idx_economic_runs_workspace_created` ON `economic_runs` (`workspace_id`,`created_at`);