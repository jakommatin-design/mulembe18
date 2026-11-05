CREATE TABLE `notification_preferences` (
	`id` varchar(64) NOT NULL,
	`user_id` varchar(128) NOT NULL,
	`email_enabled` boolean NOT NULL DEFAULT true,
	`sms_enabled` boolean NOT NULL DEFAULT true,
	`urgent_only` boolean NOT NULL DEFAULT false,
	`event_reminders` boolean NOT NULL DEFAULT true,
	`announcements` boolean NOT NULL DEFAULT true,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notification_preferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `unq_notif_pref_user` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` varchar(64) NOT NULL,
	`user_id` varchar(128),
	`channel` varchar(32) NOT NULL,
	`title` varchar(200) NOT NULL,
	`message` text NOT NULL,
	`priority` varchar(32) NOT NULL DEFAULT 'routine',
	`status` varchar(32) NOT NULL DEFAULT 'pending',
	`target_destination` varchar(255),
	`metadata` json,
	`retry_count` int NOT NULL DEFAULT 0,
	`max_retries` int NOT NULL DEFAULT 3,
	`last_error` text,
	`sent_at` datetime,
	`read_at` datetime,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `notification_preferences` ADD CONSTRAINT `notification_preferences_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_notifications_user_status` ON `notifications` (`user_id`,`status`);--> statement-breakpoint
CREATE INDEX `idx_notifications_queue` ON `notifications` (`status`,`retry_count`);--> statement-breakpoint
CREATE INDEX `idx_notifications_created_at` ON `notifications` (`created_at`);