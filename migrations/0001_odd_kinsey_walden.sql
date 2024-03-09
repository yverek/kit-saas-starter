CREATE TABLE `tokens` (
	`token` text(15) PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`type` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
