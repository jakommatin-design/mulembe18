CREATE TABLE `announcements` (
	`id` varchar(64) NOT NULL,
	`chapter_id` varchar(64),
	`county_code` varchar(3),
	`title` varchar(200) NOT NULL,
	`content` text NOT NULL,
	`priority` varchar(32) NOT NULL DEFAULT 'routine',
	`expires_at` datetime,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `announcements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` varchar(64) NOT NULL,
	`actor_id` varchar(128) NOT NULL,
	`action` varchar(100) NOT NULL,
	`target_entity` varchar(50) NOT NULL,
	`target_id` varchar(128) NOT NULL,
	`payload_before` json,
	`payload_after` json,
	`ip_address` varchar(45),
	`user_agent` text,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chapters` (
	`id` varchar(64) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`name` varchar(150) NOT NULL,
	`county_code` varchar(3) NOT NULL,
	`sub_county_id` varchar(64),
	`description` text,
	`meeting_venue` varchar(255),
	`meeting_schedule` varchar(255),
	`status` varchar(32) NOT NULL DEFAULT 'active',
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` datetime,
	CONSTRAINT `chapters_id` PRIMARY KEY(`id`),
	CONSTRAINT `unq_chapters_slug` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `counties` (
	`code` varchar(3) NOT NULL,
	`name` varchar(100) NOT NULL,
	`region` varchar(100) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `counties_code` PRIMARY KEY(`code`),
	CONSTRAINT `unq_counties_name` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` varchar(64) NOT NULL,
	`chapter_id` varchar(64),
	`title` varchar(200) NOT NULL,
	`slug` varchar(200) NOT NULL,
	`description` text NOT NULL,
	`category` varchar(50) NOT NULL DEFAULT 'cultural',
	`start_time` datetime NOT NULL,
	`end_time` datetime NOT NULL,
	`venue_name` varchar(255) NOT NULL,
	`venue_address` varchar(255),
	`online_url` varchar(500),
	`capacity` int DEFAULT 0,
	`status` varchar(32) NOT NULL DEFAULT 'published',
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` datetime,
	CONSTRAINT `events_id` PRIMARY KEY(`id`),
	CONSTRAINT `unq_events_slug` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `memberships` (
	`id` varchar(64) NOT NULL,
	`user_id` varchar(128) NOT NULL,
	`chapter_id` varchar(64) NOT NULL,
	`role` varchar(32) NOT NULL DEFAULT 'member',
	`status` varchar(32) NOT NULL DEFAULT 'pending',
	`joined_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `memberships_id` PRIMARY KEY(`id`),
	CONSTRAINT `unq_user_chapter` UNIQUE(`user_id`,`chapter_id`)
);
--> statement-breakpoint
CREATE TABLE `rsvps` (
	`id` varchar(64) NOT NULL,
	`event_id` varchar(64) NOT NULL,
	`user_id` varchar(128) NOT NULL,
	`status` varchar(32) NOT NULL DEFAULT 'attending',
	`guests_count` int NOT NULL DEFAULT 0,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rsvps_id` PRIMARY KEY(`id`),
	CONSTRAINT `unq_event_user` UNIQUE(`event_id`,`user_id`)
);
--> statement-breakpoint
CREATE TABLE `sub_counties` (
	`id` varchar(64) NOT NULL,
	`county_code` varchar(3) NOT NULL,
	`name` varchar(100) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `sub_counties_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(128) NOT NULL,
	`membership_id` varchar(32),
	`full_name` varchar(150) NOT NULL,
	`email` varchar(150) NOT NULL,
	`phone` varchar(32) NOT NULL,
	`national_id` varchar(64),
	`gender` varchar(20),
	`clan` varchar(100),
	`role` varchar(32) NOT NULL DEFAULT 'member',
	`ancestral_county_code` varchar(3),
	`current_county_code` varchar(3),
	`status` varchar(32) NOT NULL DEFAULT 'pending',
	`kdpa_consent_at` datetime,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` datetime,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_membership_id_unique` UNIQUE(`membership_id`),
	CONSTRAINT `unq_users_email` UNIQUE(`email`),
	CONSTRAINT `unq_users_phone` UNIQUE(`phone`)
);
--> statement-breakpoint
CREATE TABLE `wards` (
	`id` varchar(64) NOT NULL,
	`sub_county_id` varchar(64) NOT NULL,
	`name` varchar(100) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `wards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `chapters` ADD CONSTRAINT `chapters_county_code_counties_code_fk` FOREIGN KEY (`county_code`) REFERENCES `counties`(`code`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `memberships` ADD CONSTRAINT `memberships_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `memberships` ADD CONSTRAINT `memberships_chapter_id_chapters_id_fk` FOREIGN KEY (`chapter_id`) REFERENCES `chapters`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rsvps` ADD CONSTRAINT `rsvps_event_id_events_id_fk` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rsvps` ADD CONSTRAINT `rsvps_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sub_counties` ADD CONSTRAINT `sub_counties_county_code_counties_code_fk` FOREIGN KEY (`county_code`) REFERENCES `counties`(`code`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `wards` ADD CONSTRAINT `wards_sub_county_id_sub_counties_id_fk` FOREIGN KEY (`sub_county_id`) REFERENCES `sub_counties`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_announcements_scope` ON `announcements` (`chapter_id`,`county_code`,`expires_at`);--> statement-breakpoint
CREATE INDEX `idx_audit_actor` ON `audit_logs` (`actor_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_audit_target` ON `audit_logs` (`target_entity`,`target_id`);--> statement-breakpoint
CREATE INDEX `idx_chapters_county` ON `chapters` (`county_code`);--> statement-breakpoint
CREATE INDEX `idx_chapters_status` ON `chapters` (`status`);--> statement-breakpoint
CREATE INDEX `idx_events_chapter_start` ON `events` (`chapter_id`,`start_time`);--> statement-breakpoint
CREATE INDEX `idx_events_status_start` ON `events` (`status`,`start_time`);--> statement-breakpoint
CREATE INDEX `idx_memberships_chapter_status` ON `memberships` (`chapter_id`,`status`);--> statement-breakpoint
CREATE INDEX `idx_memberships_user` ON `memberships` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_rsvps_event` ON `rsvps` (`event_id`);--> statement-breakpoint
CREATE INDEX `idx_subcounties_county` ON `sub_counties` (`county_code`);--> statement-breakpoint
CREATE INDEX `idx_users_role` ON `users` (`role`);--> statement-breakpoint
CREATE INDEX `idx_users_status` ON `users` (`status`);--> statement-breakpoint
CREATE INDEX `idx_users_current_county` ON `users` (`current_county_code`);--> statement-breakpoint
CREATE INDEX `idx_wards_subcounty` ON `wards` (`sub_county_id`);