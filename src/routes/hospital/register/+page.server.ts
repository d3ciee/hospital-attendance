import validateForm from '$lib/helpers/validate-form';
import Hospital from '$lib/models/hospital/hospital';
import HospitalEmployee from '$lib/models/hospital/hospital-employee';
import User from '$lib/models/user/user';
import { DrizzleError } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from "uuid";

import { z } from "zod";
import HospitalDepartment from '$lib/models/hospital/hospital-department';


const validationSchema = z.object({
    name: z.string({ required_error: "A hospital name is required." }).min(3, { message: "Hospital name must be at least 3 characters long." }).max(64, { message: "Hospital name must be at most 64 characters long." }),
    registrationId: z.string({ required_error: "A registration ID is required." }).min(3, { message: "Registration ID must be at least 3 characters long." }).max(32, { message: "Registration ID must be at most 32 characters long." }),
    address: z.string({ required_error: "An address is required." }).min(3, { message: "Address must be at least 3 characters long." }).max(128, { message: "Address must be at most 100 characters long." }),
    email: z.string({ required_error: "An email is required." }).email({ message: "Please enter a valid email address." }),
    password: z.string({ required_error: "A password is required." }).min(8, { message: "Password must be at least 8 characters long." }),
    username: z.string({ required_error: "A username is required." }).min(3, { message: "Username must be at least 3 characters long." }).max(64, { message: "Username must be at most 64 characters long." }),
})


export const load = (async (e) => {

    const userId = e.locals.user?.id;
    const hospital = await e.locals.db.query.HospitalEmployee.findFirst({
        columns: {
            role: true
        },
        with: {
            hospital: {
                columns: {
                    registrationId: true
                }
            }
        },
        where: ({ userId }, { eq }) => eq(userId, userId)
    })

    console.log("hospital", hospital)

    if (userId && hospital) {
        throw redirect(302, `/hospital/${hospital.hospital.registrationId}`);
    }
}) satisfies PageServerLoad;



export const actions: Actions = {
    default: async (e) => {
        const body = validateForm(await e.request.formData(), validationSchema);
        if (!body.valid) {
            console.log(body);
            return fail(400, {
                errors: body.errors
            })
        }

        const passwordHash = bcrypt.hashSync(body.data.password, 10);

        const userId = uuid();
        const adminDepartmentId = uuid();

        try {
            await e.locals.db.batch([
                e.locals.db.insert(Hospital).values({
                    address: body.data.address,
                    name: body.data.name,
                    registrationId: body.data.registrationId
                }),
                e.locals.db.insert(User).values({
                    id: userId,
                    passwordHash,
                    username: body.data.username,
                }),
                e.locals.db.insert(HospitalDepartment).values({
                    uuid: adminDepartmentId,
                    checkInAt: "00:00",
                    checkOutAt: "00:00",
                    description: "Administrative department",
                    hospitalId: body.data.registrationId,
                    id: "DP-ADMIN-1",
                    name: "Admin Department"
                }),
                e.locals.db.insert(HospitalEmployee).values({
                    id: userId,
                    hospitalDepartmentUId: adminDepartmentId,
                    uuid: uuid(),
                    role: "admin",
                    hospitalId: body.data.registrationId,
                    userId,
                    email: body.data.email
                })
            ])
        }
        catch (e: any) {
            if (e.message.includes("UNIQUE constraint failed: hospital.registration_id"))
                return fail(400, {
                    errors: [{ message: "A hospital with this registration ID already exists." }]
                })

            if (e.message.includes("UNIQUE constraint failed: user.username"))
                return fail(400, {
                    errors: [{ message: "A user with this username already exists." }]
                })

            if (e.message.includes("UNIQUE constraint failed: hospital_employee.email"))
                return fail(400, {
                    errors: [{ message: "A user with this email already exists." }]
                })

            console.log(e);
            return fail(500, {
                errors: [{ message: "An error occurred while registering the hospital." }]
            })
        }

        const session = await e.locals.auth.createSession(userId, {});
        const sessionCookie = e.locals.auth.createSessionCookie(session.id);
        e.cookies.set(sessionCookie.name, sessionCookie.value, {
            path: ".",
            ...sessionCookie.attributes
        });

        throw redirect(302, `/hospital/${body.data.registrationId}/dashboard`)
    }
}