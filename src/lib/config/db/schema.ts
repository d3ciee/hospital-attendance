import UserSession from "../../models/user/user-session";
import User from "../../models/user/user";
import Hospital from "../../models/hospital/hospital";
import HospitalEmployee, { hospitalEmployeeRelations } from "../../models/hospital/hospital-employee";
import HospitalDepartment, { hospitalDepartmentRelations } from "../../models/hospital/hospital-department";
import Attendance, { attendanceRelations } from "../../models/attendance/attendance";
import LeaveRequests, { leaveRequestRelations } from "../../models/leave-requests/leave-requests";

export {
    User,
    Hospital,
    UserSession,
    LeaveRequests,
    HospitalEmployee,
    HospitalDepartment,
    hospitalEmployeeRelations,
    hospitalDepartmentRelations,
    leaveRequestRelations,
    Attendance,
    attendanceRelations,
}