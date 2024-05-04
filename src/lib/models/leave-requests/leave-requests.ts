import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core"
import HospitalEmployee from "../hospital/hospital-employee";

const LeaveRequests = sqliteTable("leave_requests", {
    id: text("uuid").notNull().primaryKey(),
    employeeUId: text("employee_u_id").notNull(),
    startDate: text("start_date").notNull(),
    endDate: text("end_date").notNull(),
    type: text("type").notNull(),
    additionalDetails: text("additional_details"),
    status: text("status").notNull(),
    hospitalId: text("hospital_id").notNull(),
});

const leaveRequestRelations = relations(LeaveRequests, ({ one }) => ({
    employee: one(HospitalEmployee, {
        fields: [LeaveRequests.employeeUId]
        , references: [HospitalEmployee.uuid]
    })
}))

export type TLeaveRequests = typeof LeaveRequests.$inferSelect;
export { leaveRequestRelations }
export default LeaveRequests;
