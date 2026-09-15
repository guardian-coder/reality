CREATE TABLE `reality_claims` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`external_id` text NOT NULL,
	`subject` text NOT NULL,
	`assertion` text NOT NULL,
	`state` text NOT NULL,
	`reason_codes_json` text NOT NULL,
	`evaluated_at` text NOT NULL,
	`valid_until` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `economic_workspaces`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_reality_claims_workspace_external` ON `reality_claims` (`workspace_id`,`external_id`);
--> statement-breakpoint
CREATE INDEX `idx_reality_claims_workspace_updated` ON `reality_claims` (`workspace_id`,`updated_at`);
--> statement-breakpoint
CREATE TABLE `reality_evidence` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`claim_external_id` text NOT NULL,
	`source_name` text NOT NULL,
	`source_ref` text NOT NULL,
	`relation` text NOT NULL,
	`lineage_id` text NOT NULL,
	`observed_at` text NOT NULL,
	`valid_until` text,
	`integrity_status` text NOT NULL,
	`raw_json` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `economic_workspaces`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_reality_evidence_workspace_claim` ON `reality_evidence` (`workspace_id`,`claim_external_id`);
--> statement-breakpoint
CREATE INDEX `idx_reality_evidence_workspace_created` ON `reality_evidence` (`workspace_id`,`created_at`);
