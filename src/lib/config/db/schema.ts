import UserSession from "../../models/user/user-session";
import User from "../../models/user/user";
import Hospital from "../../models/hospital/hospital";
import HospitalEmployee, { hospitalEmployeeRelations } from "../../models/hospital/hospital-employee";
import HospitalDepartment, { hospitalDepartmentRelations } from "../../models/hospital/hospital-department";
import Attendance, { attendanceRelations } from "../../models/attendance/attendance";

export {
    User,
    Hospital,
    UserSession,
    HospitalEmployee,
    HospitalDepartment,
    hospitalEmployeeRelations,
    hospitalDepartmentRelations,
    Attendance,
    attendanceRelations,
}