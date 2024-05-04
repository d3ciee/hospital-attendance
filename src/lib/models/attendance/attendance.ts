import { sqliteTable, text, int } from "drizzle-orm/sqlite-core"
import HospitalEmployee from "../hospital/hospital-employee";
import { relations } from "drizzle-orm";
import Hospital from "../hospital/hospital";

const Attendance = sqliteTable("attendance", {
    uuid: text("uuid").notNull().primaryKey(),
    employeeUId: text("employee_u_id").notNull().references(() => HospitalEmployee.uuid),
    checkInAt: int("check_in_at").notNull(),
    absentedAt: int("absented_at"),
    hospitalId: text("hospital_u_id").notNull().references(() => Hospital.registrationId),
});

const attendanceRelations = relations(Attendance, ({ one }) => ({
    employee: one(HospitalEmployee, {
        fields: [Attendance.employeeUId],
        references: [HospitalEmployee.uuid]
    }),
    hospital: one(Hospital, {
        fields: [Attendance.hospitalId],
        references: [Hospital.registrationId]
    })
}))

export type TAttendance = typeof Attendance.$inferSelect;
export { attendanceRelations };
export default Attendance;