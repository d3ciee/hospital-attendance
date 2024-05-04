import validateForm from '$lib/helpers/validate-form';
import Hospital from '$lib/models/hospital/hospital';
import HospitalEmployee from '$lib/models/hospital/hospital-employee';
import User from '$lib/models/user/user';
import type { PageServerLoad } from './$types';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from "uuid";

import { z } from "zod";


const validationSchema = z.object({
    hospitalId: z.string({ required_error: "A hospital Id is required." }).min(3, { message: "Registration ID must be at least 3 characters long." }).max(32, { message: "Registration ID must be at most 32 characters long." }),
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

        let employee: {
            id: string;
            passwordHash: string;
            role: "admin" | "employee";
            hospitalId: string;
        } | null = null;

        try {
            employee = await e.locals.db.query.User.findFirst({
                columns: {
                    id: true,
                    passwordHash: true
                },
                where: ({ username }, { eq }) => eq(username, body.data.username)
            }).then(async (u) => {
                if (!u) return null;
                const em = await e.locals.db.query.HospitalEmployee.findFirst({
                    columns: {
                        role: true,
                        hospitalId: true,

                    },
                    where: ({ userId, hospitalId }, { eq, and }) => and(eq(userId, u.id), eq(hospitalId, body.data.hospitalId))
                })
                if (!em) return null
                return { ...u, ...em }
            })

            if (!employee || !bcrypt.compareSync(body.data.password, employee.passwordHash)) return fail(400, {
                errors: [{ message: "Invalid username or password." }]
            })

            const session = await e.locals.auth.createSession(employee.id, {});
            const sessionCookie = e.locals.auth.createSessionCookie(session.id);
            e.cookies.set(sessionCookie.name, sessionCookie.value, {
                path: ".",
                ...sessionCookie.attributes
            });

        }
        catch (e: any) {
            console.log(e);
            return fail(500, {
                errors: [{ message: "An error occurred while logging into your account." }]
            })
        }

        if (employee.role == "admin")
            throw redirect(302, `/hospital/${body.data.hospitalId}/dashboard`)
        else throw redirect(302, `/hospital/${body.data.hospitalId}/my-attendance`)
    }
}