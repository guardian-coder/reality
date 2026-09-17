CREATE TABLE `reality_sources` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`mode` text NOT NULL,
	`lineage_id` text NOT NULL,
	`token_hash` text NOT NULL,
	`token_prefix` text NOT NULL,
	`freshness_minutes` integer NOT NULL,
	`status` text NOT NULL,
	`last_event_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `economic_workspaces`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_reality_sources_token_hash` ON `reality_sources` (`token_hash`);
--> statement-breakpoint
CREATE INDEX `idx_reality_sources_workspace_updated` ON `reality_sources` (`workspace_id`,`updated_at`);
