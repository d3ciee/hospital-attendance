import { sqliteTable, text } from "drizzle-orm/sqlite-core"

const User = sqliteTable("user", {
    id: text("id").notNull().primaryKey(),
    username: text("username").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
})

export type User = typeof User.$inferSelect;
export default User;
