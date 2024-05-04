import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import dashboardViews from './_config';

export const load = (async (e) => {
    if (e.locals.user == null) return error(404, "User not logged in.");

    const dashboardView = e.url.pathname.split("/")[3];
    const employee = await e.locals.db.query.HospitalEmployee.findFirst({
        with: {
            department: {
                columns: {
                    id: true,
                }
            },
            user: {
                columns: {
                    username: true
                }
            }
        },
        where: ({ userId, hospitalId }, { eq, and }) => (and(eq(hospitalId, e.params.hospital_id), eq(userId, e.locals.user?.id ?? "")))
    })

    const hospital = await e.locals.db.query.Hospital.findFirst({
        where: ({ registrationId }, { eq }) => eq(registrationId, e.params.hospital_id)
    })

    if (!hospital) return error(404, "Hospital not found.");
    if (!employee) return error(403, "You are not authorized to view this page.");

    if (employee.hospitalId !== hospital.registrationId) return error(403, "You are not authorized to view this page.");

    const availableViews = employee.department.id.includes("DP-HR") ? [{ name: "Leave Requests", path: "leave-requests" }, ...dashboardViews.get(employee.role)!] : dashboardViews.get(employee.role)!;
    if (!availableViews.find(v => v.path === dashboardView) && dashboardView) return error(404, "You are not authorized to view this page.");


    return { employee, hospital, availableViews };
}) satisfies LayoutServerLoad;