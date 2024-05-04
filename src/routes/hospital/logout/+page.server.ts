import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (e) => {
    const sc = e.locals.auth.createBlankSessionCookie()

    e.cookies.delete(sc.name, { path: '/' })
    throw redirect(302, '/hospital/login');
}) satisfies PageServerLoad;