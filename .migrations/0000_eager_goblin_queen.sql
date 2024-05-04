CREATE TABLE `attendance` (
	`uuid` text PRIMARY KEY NOT NULL,
	`employee_u_id` text NOT NULL,
	`check_in_at` integer NOT NULL,
	`hospital_u_id` text NOT NULL,
	FOREIGN KEY (`employee_u_id`) REFERENCES `hospital_employee`(`uuid`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`hospital_u_id`) REFERENCES `hospital`(`registration_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `hospital` (
	`registration_id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`address` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `hospital_department` (
	`uuid` text PRIMARY KEY NOT NULL,
	`id` text NOT NULL,
	`hospital_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`check_in_at` text NOT NULL,
	`check_out_at` text NOT NULL,
	FOREIGN KEY (`hospital_id`) REFERENCES `hospital`(`registration_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `hospital_employee` (
	`uuid` text PRIMARY KEY NOT NULL,
	`id` text NOT NULL,
	`hospital_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role` text NOT NULL,
	`hospital_department_u_id` text NOT NULL,
	`email` text NOT NULL,
	`first_name` text DEFAULT '' NOT NULL,
	`last_name` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`hospital_id`) REFERENCES `hospital`(`registration_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`hospital_department_u_id`) REFERENCES `hospital_department`(`uuid`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `hospital_employee_user_id_unique` ON `hospital_employee` (`user_id`);