import { sqliteTable, text } from "drizzle-orm/sqlite-core"

const Hospital = sqliteTable("hospital", {
    registrationID: text("registration_id").notNull().primaryKey(),
    name: text("name").notNull(),
    address: text("address").notNull(),
});

export type THospital = typeof Hospital.$inferSelect;
export default Hospital;