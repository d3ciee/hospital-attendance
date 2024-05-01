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
    })).map(a => ({
        name: a.employee.firstName + " " + a.employee.lastName,
        department: a.employee.department.name,
        checkInAt: a.employee.department.checkInAt,
        checkOutAt: a.employee.department.checkOutAt,
        checkedInAt: a.checkInAt
    }))



    return { attendance };
}) satisfies PageServerLoad;
