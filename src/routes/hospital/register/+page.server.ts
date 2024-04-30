import validateForm from '$lib/helpers/validate-form';
import Hospital from '$lib/models/hospital/hospital';
import HospitalEmployee from '$lib/models/hospital/hospital-employee';
import User from '$lib/models/user/user';
import { DrizzleError } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { fail, type Actions } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from "uuid";

import { z } from "zod";


const validationSchema = z.object({
    name: z.string({ required_error: "A hospital name is required." }).min(3, { message: "Hospital name must be at least 3 characters long." }).max(64, { message: "Hospital name must be at most 64 characters long." }),
    registrationId: z.string({ required_error: "A registration ID is required." }).min(3, { message: "Registration ID must be at least 3 characters long." }).max(32, { message: "Registration ID must be at most 32 characters long." }),
    address: z.string({ required_error: "An address is required." }).min(3, { message: "Address must be at least 3 characters long." }).max(128, { message: "Address must be at most 100 characters long." }),
    email: z.string({ required_error: "An email is required." }).email({ message: "Please enter a valid email address." }),
    password: z.string({ required_error: "A password is required." }).min(8, { message: "Password must be at least 8 characters long." }),
    username: z.string({ required_error: "A username is required." }).min(3, { message: "Username must be at least 3 characters long." }).max(64, { message: "Username must be at most 64 characters long." }),
})

export const load = (async (e) => {
    //TODO: Redirect to /hospital/<h_id>/dashboard if user is already logged in
    return {};
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

        try {
            e.locals.db.batch([
                e.locals.db.insert(Hospital).values({
                    address: body.data.address,
                    name: body.data.name,
                    registrationID: body.data.registrationId
                }),
                e.locals.db.insert(User).values({
                    id: userId,
                    passwordHash,
                    username: body.data.username,
                }),
                e.locals.db.insert(HospitalEmployee).values({
                    id: userId,
                    role: "admin",
                    hospitalId: body.data.registrationId,
                    userId,
                    email: body.data.email
                })
            ])
        }
        catch (e) {
            console.log(e);
            return fail(500, {
                errors: [{ message: "An error occurred while registering the hospital." }]
            })
        }


    }
}