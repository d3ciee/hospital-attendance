import type { Handle } from "@sveltejs/kit";
import initDB from "./lib/config/db";
import { sequence } from "@sveltejs/kit/hooks";
import useAuth from "$lib/config/auth/use-auth";

const useDB: Handle = ({ event, resolve }) => {
    const db = initDB();
    event.locals.db = db;
    return resolve(event);
}

export const handle: Handle = sequence(
    useDB,
    useAuth
) 