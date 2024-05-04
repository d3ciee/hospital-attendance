CREATE TABLE `leave_requests` (
	`uuid` text PRIMARY KEY NOT NULL,
	`employee_u_id` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`type` text NOT NULL,
	`additional_details` text,
	`status` text NOT NULL,
	`hospital_id` text NOT NULL
);
