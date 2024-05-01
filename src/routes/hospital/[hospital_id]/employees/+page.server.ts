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
    const departments = (await e.locals.db.query.HospitalDepartment.findMany({
        columns: {
            name: true,
            uuid: true
        },
        where: ({ hospitalId, id }, { eq, and, ne }) => and(ne(id, "DP-ADMIN-1"), eq(hospitalId, e.params.hospital_id))
    }))

    const employees = (await e.locals.db.query.HospitalEmployee.findMany({
        columns: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            uuid: true
        },
        with: {
            department: {
                columns: {
                    name: true
                }
            }
        },
        where: ({ hospitalId, role }, { eq, and }) => and(eq(hospitalId, e.params.hospital_id), eq(role, "employee"))
    }))
        .map(e => ({
            ...e,
            name: `${e.firstName} ${e.lastName}`,
            status: "present",
            department: e.department.name
        }))

    return { departments, employees };
}) satisfies PageServerLoad;

export const actions: Actions = {
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