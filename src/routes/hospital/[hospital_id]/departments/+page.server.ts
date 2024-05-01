import { v4 as uuid } from "uuid";
import type { PageServerLoad, Actions } from './$types';
import { z } from "zod"
import validateForm from '$lib/helpers/validate-form';
import { fail, redirect } from '@sveltejs/kit';
import HospitalDepartment from '$lib/models/hospital/hospital-department';
import { eq } from "drizzle-orm";

const validationSchema = z.object({
    id: z.string({ required_error: "An ID is required." }).min(3, { message: "ID must be at least 3 characters long." }).max(64, { message: "ID must be at most 64 characters long." }),
    name: z.string({ required_error: "A department name is required." }).min(3, { message: "Department name must be at least 3 characters long." }).max(64, { message: "Department name must be at most 64 characters long." }),
    description: z.string({ required_error: "A description is required." }).min(3, { message: "Description must be at least 3 characters long." }).max(128, { message: "Description must be at most 128 characters long." }),
    checkInAt: z.string({ required_error: "A check-in time is required." }).regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Please enter a valid time." }),
    checkOutAt: z.string({ required_error: "A check-out time is required." }).regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Please enter a valid time." }),
})

export const load = (async (e) => {
    const departments = (await e.locals.db.query.HospitalDepartment.findMany({
        columns: {
            id: true,
            name: true,
            description: true,
            checkInAt: true,
            checkOutAt: true,
            uuid: true
        },
        with: {
            members: {
                columns: {
                    id: true
                }
            }
        },
        where: ({ hospitalId }, { eq }) => eq(hospitalId, e.params.hospital_id)
    })).map(d => ({
        ...d,
        members: d.members.length
    }))

    return { departments };
}) satisfies PageServerLoad;

export const actions: Actions = {
    delete: async (e) => {
        const formData = await e.request.formData();
        const departmentUId = formData.get("departmentUId")?.toString();

        if (!departmentUId) return fail(400, {
            errors: [{ message: "No department id attached" }]
        })
        try {
            const result = await e.locals.db.delete(HospitalDepartment).where(eq(HospitalDepartment.uuid, departmentUId));
            if (result.rowsAffected === 0) return fail(400, {
                errors: [{ message: "There is no such department" }]
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

        if (await e.locals.db.query.HospitalDepartment.findFirst({
            columns: {
                id: true
            },
            where: ({ hospitalId, id }, { eq, and }) => and(eq(hospitalId, e.params.hospital_id), eq(id, body.data.id))
        })) return fail(
            400, {
            errors: [{ message: "A department with this ID already exists" }]
        })

        try {
            await e.locals.db.insert(HospitalDepartment).values({
                ...body.data,
                uuid: uuid(),
                hospitalId: e.params.hospital_id
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