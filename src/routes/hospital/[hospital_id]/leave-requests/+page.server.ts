import { v4 as uuid } from "uuid";
import type { PageServerLoad, Actions } from './$types';
import { z } from "zod"
import validateForm from '$lib/helpers/validate-form';
import { fail, redirect } from '@sveltejs/kit';
import HospitalDepartment from '$lib/models/hospital/hospital-department';
import { eq } from "drizzle-orm";
import HospitalEmployee from "$lib/models/hospital/hospital-employee";
import bcrypt from "bcryptjs"
import User from "$lib/models/user/user";
import Attendance from "$lib/models/attendance/attendance";
import LeaveRequests from "$lib/models/leave-requests/leave-requests";

const validationSchema = z.object({
    id: z.string({ required_error: "An ID is required." }).min(3, { message: "ID must be at least 3 characters long." }).max(64, { message: "ID must be at most 64 characters long." }),
    username: z.string({ required_error: "A username is required." }).min(3, { message: "Username must be at least 3 characters long." }).max(64, { message: "Username must be at most 64 characters long." }),
    firstName: z.string({ required_error: "An employee first name is required." }).min(3, { message: "Employee first name must be at least 3 characters long." }).max(64, { message: "Employee first name must be at most 64 characters long." }),
    lastName: z.string({ required_error: "An employee last name is required." }).min(3, { message: "Employee last name must be at least 3 characters long." }).max(64, { message: "Employee last name must be at most 64 characters long." }),
    hospitalDepartmentUId: z.string({ required_error: "A department is required." }),
    email: z.string({ required_error: "An email is required." }).email({ message: "Please enter a valid email address." }),
    password: z.string({ required_error: "A password is required." }).min(8, { message: "Password must be at least 8 characters long." }),
})

export const load = (async (e) => {
    const leaveRequests = await e.locals.db.query.LeaveRequests.findMany({

        where: ({ hospitalId, status }, { eq, and }) => and(eq(hospitalId, e.params.hospital_id), eq(status, "pending")),

        with: {
            employee: true
        }
    })

    console.log(leaveRequests)
    return { leaveRequests };
}) satisfies PageServerLoad;

export const actions: Actions = {
    accept: async (e) => {
        const formData = await e.request.formData();
        console.log(formData.get("employeeUId"));

        try {
            await e.locals.db.insert(Attendance).values({
                employeeUId: formData.get("employeeUId")?.toString() ?? "",
                checkInAt: Date.now(),
                absentedAt: Date.now(),
                hospitalId: e.params.hospital_id,
                uuid: uuid()
            })
            await e.locals.db.update(LeaveRequests).set({
                status: "accepted"
            })

        }
        catch (e) {
            console.log(e);
            return fail(500, {
                errors: [{ message: "An error occured.  Try again later." }]
            })
        }
        throw redirect(302, "?")

    },
    reject: async (e) => {
        const formData = await e.request.formData();
        console.log(formData.get("employeeUId"));

        try {
            await e.locals.db.update(LeaveRequests).set({
                status: "rejected"
            })
        }
        catch (e) {
            console.log(e);
            return fail(500, {
                errors: [{ message: "An error occured.  Try again later." }]
            })
        }

        throw redirect(302, "?");
    },
    delete: async (e) => {
        const formData = await e.request.formData();
        const employeeUId = formData.get("departmentUId")?.toString();

        if (!employeeUId) return fail(400, {
            errors: [{ message: "No employee id attached" }]
        })
        try {
            const result = await e.locals.db.delete(HospitalEmployee).where(eq(HospitalEmployee.uuid, employeeUId));
            if (result.rowsAffected === 0) return fail(400, {
                errors: [{ message: "There is no such employee" }]
            })
        }
        catch (e) {
            console.log(e);
            return fail(500, {
                errors: [{ message: "An error occured.  Try again later." }]
            })
        }
        throw redirect(302, "?")
    },

    create: async (e) => {
        const body = validateForm(await e.request.formData(), validationSchema);
        if (!body.valid) {
            return {
                status: 400,
                errors: body.errors
            }
        }
        if (await e.locals.db.query.HospitalEmployee.findFirst({
            columns: {
                id: true
            },
            where: ({ hospitalId, id }, { eq, and }) => and(eq(hospitalId, e.params.hospital_id), eq(id, body.data.id))
        })) return fail(
            400, {
            errors: [{ message: "An employee with this ID already exists" }]
        })

        const userId = uuid();

        try {
            await e.locals.db.batch([
                e.locals.db.insert(User).values({
                    id: userId,
                    username: body.data.username,
                    passwordHash: bcrypt.hashSync(body.data.password, 10)
                }),
                e.locals.db.insert(HospitalEmployee).values({
                    ...body.data,
                    userId,
                    uuid: uuid(),
                    role: "employee",
                    hospitalId: e.params.hospital_id
                })
            ])
        }
        catch (e: any) {
            if (e.message.includes("UNIQUE constraint failed: user.username"))
                return fail(400, {
                    errors: [{ message: "A user with this username already exists." }]
                })

            if (e.message.includes("UNIQUE constraint failed: hospital_employee.email"))
                return fail(400, {
                    errors: [{ message: "A user with this email already exists." }]
                })
            if (e.message.includes("SqliteError: FOREIGN KEY constraint failed"))
                return fail(400, {
                    errors: [{ message: "Please set a department." }]
                })
            if (e.message.includes("UNIQUE constraint failed: hospital_employee.id"))
                return fail(400, {
                    errors: [{ message: "An employee with this ID already exists." }]
                })

            console.log(e);
            return fail(500, {
                errors: [{ message: "An error occured.  Try again later." }]
            })
        }
        throw redirect(302, "?")
    }
}