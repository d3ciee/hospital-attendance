import { sqliteTable, text } from "drizzle-orm/sqlite-core"
import User from "../user/user";
import { relations } from "drizzle-orm";
import Hospital from "./hospital";
import HospitalDepartment from "./hospital-department";

const HospitalEmployee = sqliteTable("hospital_employee", {
    uuid: text("uuid").notNull().primaryKey(),
    id: text("id").notNull(),
    hospitalId: text("hospital_id").notNull().references(() => Hospital.registrationId),
    userId: text("user_id").notNull().unique().references(() => User.id),
    role: text("role", { enum: ["admin", "employee"] }).notNull(),
    hospitalDepartmentUId: text("hospital_department_u_id").notNull().references(() => HospitalDepartment.uuid),
    email: text("email").notNull(),
    firstName: text("first_name").notNull().default(""),
    lastName: text("last_name").notNull().default(""),
});

const hospitalEmployeeRelations = relations(HospitalEmployee, ({ one }) => ({
    user: one(User, {
        fields: [HospitalEmployee.userId],
        references: [User.id]
    }),
    hospital: one(Hospital, {
        fields: [HospitalEmployee.hospitalId],
        references: [Hospital.registrationId]
    }),
    department: one(HospitalDepartment, {
        fields: [HospitalEmployee.hospitalDepartmentUId],
        references: [HospitalDepartment.uuid]
    })
}))

export type THospitalEmployee = typeof HospitalEmployee.$inferSelect;
export { hospitalEmployeeRelations };
export default HospitalEmployee;