import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (e) => {
    const emp = await e.locals.db.query.HospitalEmployee.findFirst({
        where: ({ userId }, { eq }) => eq(userId, e.locals?.user?.id ?? "")
    })

    if (!emp) throw error(302, "no_user")

    if (emp.role == "admin")
        throw redirect(302, `/hospital/${e.params.hospital_id}/dashboard`)
    else throw redirect(302, `/hospital/${e.params.hospital_id}/my-attendance`)

}) satisfies PageServerLoad;