import type { PageServerLoad } from './$types';

export const load = (async (e) => {
    const attendance = (await e.locals.db.query.Attendance.findMany({
        with: {
            employee: {
                with: {
                    department: {
                        columns: {
                            name: true,
                            checkInAt: true,
                            checkOutAt: true
                        }
                    }
                },
                columns: {
                    firstName: true,
                    lastName: true
                }
            }
        },
        where: ({ hospitalId }, { eq }) => eq(hospitalId, e.params.hospital_id)
    })).map(a => {

        const [hours, minutes] = a.employee.department.checkInAt.split(":").map(Number);
        const [myHours, myMinutes] = new Date(a.checkInAt).toLocaleTimeString("en-US", { hour12: false }).split(":").map(Number);

        const cameInAt = hours * 60 + minutes;
        const expected = myHours * 60 + myMinutes;


        return ({
            name: a.employee.firstName + " " + a.employee.lastName,
            department: a.employee.department.name,
            checkInAt: a.employee.department.checkInAt,
            checkOutAt: a.employee.department.checkOutAt,
            checkedInAt: a.checkInAt,
            status: a.absentedAt ? "absented" : expected <= cameInAt ? "present" : "late"
        })
    })



    return { attendance };
}) satisfies PageServerLoad;
