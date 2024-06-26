import { sqliteTable, text } from "drizzle-orm/sqlite-core"

const User = sqliteTable("user", {
    id: text("id").notNull().primaryKey(),
    username: text("username").notNull(),
    passwordHash: text("password_hash").notNull(),
})

export type TUser = typeof User.$inferSelect;
export default User;
