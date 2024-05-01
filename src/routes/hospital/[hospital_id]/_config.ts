import type { THospitalEmployee } from "$lib/models/hospital/hospital-employee"
import { LayoutDashboard, Building, Users2, Clock } from "lucide-svelte"

const dashboardViews = new Map<THospitalEmployee["role"], { name: string, path: string }[]>()
    .set("admin",
        [
            { name: "Dashboard", path: "dashboard" },
            { name: "Departments", path: "departments" },
            { name: "Employees", path: "employees" },
            { name: "Attendance", path: "attendance" }
        ]
    )
    .set("employee",
        [
            { name: "Dashboard", path: "dashboard" },
            { name: "Attendance", path: "employee-attendance" }
        ]
    )

export default dashboardViews