import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Attendance from '$lib/models/attendance/attendance';
import { v4 as uuid } from "uuid"

export const POST: RequestHandler = async (e) => {
    const employeeUId = e.url.searchParams.get("employeeUId");

    if (!employeeUId) return json({ message: "Employee UId is required", isSuccess: false }, { status: 400 });

    try {
        const lastScan = await e.locals.db.query.Attendance.findFirst({
            where: ({ employeeUId: ee }, { eq }) => eq(ee, employeeUId),
            orderBy: ({ checkInAt }, { desc }) => desc(checkInAt)
        })

        if (lastScan) {
            const now = Date.now();
            const T24_HOUR = 1000 * 60 * 60 * 24;
            const timeLeft = lastScan.checkInAt + T24_HOUR - now;

            if (timeLeft > 0) return json({ message: "This employee has already scanned in for the day", isSuccess: false }, { status: 400 });
        }

        console.log("employeeUId", employeeUId);
        await e.locals.db.insert(Attendance).values({
            uuid: uuid(),
            hospitalId: e.params.hospital_id,
            employeeUId,
            checkInAt: Date.now()
        })
    }
    catch (e: any) {
        console.error(e);
        if (e.message.includes("SQLITE_CONSTRAINT_FOREIGNKEY: FOREIGN KEY constraint failed"))
            return json({ message: "Employee not found", isSuccess: false }, { status: 400 });

        return json({ message: "An error has occured", isSuccess: false }, { status: 500 });
    }

    return json({ isSuccess: true }, { status: 200 });
};