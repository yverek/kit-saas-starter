ALTER TABLE users ADD `verified` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE users ADD `token` text;--> statement-breakpoint
CREATE UNIQUE INDEX `users_token_unique` ON `users` (`token`);