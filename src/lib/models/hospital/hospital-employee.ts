import { sqliteTable, text } from "drizzle-orm/sqlite-core"
import User from "../user/user";
import { relations } from "drizzle-orm";
import Hospital from "./hospital";

const HospitalEmployee = sqliteTable("hospital_employee", {
    id: text("id").notNull().primaryKey(),
    hospitalId: text("hospital_id").notNull().unique().references(() => Hospital.registrationID),
    userId: text("user_id").notNull().unique().references(() => User.id),
    role: text("role", { enum: ["admin", "employee"] }).notNull(),
    email: text("email").notNull().unique(),
});

const hospitalEmployeeRelations = relations(HospitalEmployee, ({ one }) => ({
    user: one(User, {
        fields: [HospitalEmployee.userId],
        references: [User.id]
    }),
    hospital: one(Hospital, {
        fields: [HospitalEmployee.id],
        references: [Hospital.registrationID]
    })
}))

export type THospitalEmployee = typeof HospitalEmployee.$inferSelect;
export { hospitalEmployeeRelations };
export default HospitalEmployee;