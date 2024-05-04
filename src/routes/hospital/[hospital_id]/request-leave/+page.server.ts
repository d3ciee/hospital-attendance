import { addIssueToContext } from 'zod';
import type { PageServerLoad, Actions } from './$types';
import { z } from 'zod';
import validateForm from '$lib/helpers/validate-form';
import LeaveRequests from '$lib/models/leave-requests/leave-requests';
import { v4 as uuid } from 'uuid';
import { error, fail, redirect } from '@sveltejs/kit';

const validationSchema = z.object({
    startDate: z.string({ required_error: "A start date is required." }),
    endDate: z.string({ required_error: "An end date is required." }),
    type: z.string({ required_error: "A leave type is required." }),
    additionalDetails: z.string({ required_error: "Additional details are required." })
})

export const load = (async (e) => {
    const employee = await e.locals.db.query.HospitalEmployee.findFirst({
        where: ({ userId }, { eq }) => eq(userId, e.locals.user?.id ?? "")
    })

    if (!employee) throw error(400, "employee_not_found");

    const leaveRequest = await e.locals.db.query.LeaveRequests.findFirst({
        where: ({ employeeUId }, { eq }) => eq(employeeUId, employee.uuid),
        orderBy: ({ startDate }, { desc }) => desc(startDate)
    })

    return { leaveRequest };
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async (e) => {
        const body = validateForm(await e.request.formData(), validationSchema);
        if (!body.valid) {
            return fail(400, {
                errors: body.errors
            })
        }

        const employee = await e.locals.db.query.HospitalEmployee.findFirst({
            where: ({ userId }, { eq }) => eq(userId, e.locals.user?.id ?? "")
        })

        if (!employee) {
            return fail(403, {
                errors: [{ message: "You are not authorized to perform this action." }]
            })
        }

        const today = Date.now();
        const existingLeaveRequests = await e.locals.db.query.LeaveRequests.findFirst({
            where: ({ employeeUId, type }, { gte, and, eq }) => and(eq(employeeUId, employee.uuid), eq(type, "pending"))
        })

        if (existingLeaveRequests) return fail(403, {
            errors: [{ message: "There is an existing pending leave request." }]
        })

        try {
            await e.locals.db.insert(LeaveRequests).values({
                startDate: body.data.startDate,
                endDate: body.data.endDate,
                type: body.data.type,
                additionalDetails: body.data.additionalDetails,
                id: uuid(),
                status: "pending",
                employeeUId: employee.uuid,
                hospitalId: employee?.hospitalId,

            })
        }
        catch (e) {
            console.log(e);
            return fail(500, {
                errors: [{ message: "An error occured.  Try again later." }]
            })
        }

        throw redirect(302, "?")
    }
}