import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import Hospital from "./hospital";
import { relations } from "drizzle-orm";
import HospitalEmployee from "./hospital-employee";

const HospitalDepartment = sqliteTable("hospital_department", {
    uuid: text("uuid").notNull().primaryKey(),
    id: text("id").notNull(),
    hospitalId: text("hospital_id").notNull().references(() => Hospital.registrationId),
    name: text("name").notNull(),
    description: text("description").notNull(),
    checkInAt: text("check_in_at").notNull(),
    checkOutAt: text("check_out_at").notNull(),
})

const hospitalDepartmentRelations = relations(HospitalDepartment, ({ one, many }) => ({
    hospital: one(Hospital, {
        fields: [HospitalDepartment.hospitalId],
        references: [Hospital.registrationId]
    }),
    members: many(HospitalEmployee)
}))

type THospitalDepartment = typeof HospitalDepartment.$inferSelect;
export { type THospitalDepartment, hospitalDepartmentRelations };
export default HospitalDepartment;

