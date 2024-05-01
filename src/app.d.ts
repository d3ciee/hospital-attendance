declare global {
	namespace App {

		interface Locals {
			db: import("$lib/config/db/").DB;
			auth: import("$lib/config/auth/").Auth;
			user: import("lucia").User | null;
			session: import("lucia").Session | null;
		}
	}
}

export { };
