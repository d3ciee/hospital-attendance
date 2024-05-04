import type { THospitalEmployee } from "$lib/models/hospital/hospital-employee"
import { LayoutDashboard, Building, Users2, Clock } from "lucide-svelte"

const dashboardViews = new Map<THospitalEmployee["role"], { name: string, path: string }[]>()
    .set("admin",
        [
            { name: "Dashboard", path: "dashboard" },
            { name: "Departments", path: "departments" },
            { name: "Employees", path: "employees" },
            { name: "Attendance", path: "attendance" },
            { name: "Leave Requests", path: "leave-requests" }
        ]
    )
    .set("employee",
        [
            { name: "My attendance", path: "my-attendance" },
            { name: "Request leave", path: "request-leave" }
        ]
    )

export default dashboardViews