import type { PageServerLoad } from './$types';

export const load = (async (e) => {

    let today = new Date();

    today.setHours(0, 0, 0, 0);
    let startTimestamp = today.getTime();

    today.setHours(23, 59, 59, 999);
    let endTimestamp = today.getTime();

    const attendance = (await e.locals.db.query.Attendance.findMany({
        with: {
            employee: {
                with: {
                    department: {
                        columns: {
                            checkInAt: true,
                        }
                    }
                },
            }
        },
        where: ({ hospitalId, checkInAt }, { eq, and, between }) => and(between(checkInAt, startTimestamp, endTimestamp), eq(hospitalId, e.params.hospital_id))
    })).map(a => {

        const [hours, minutes] = a.employee.department.checkInAt.split(":").map(Number);
        const [myHours, myMinutes] = new Date(a.checkInAt).toLocaleTimeString("en-US", { hour12: false }).split(":").map(Number);

        const cameInAt = hours * 60 + minutes;
        const expected = myHours * 60 + myMinutes;


        return ({
            status: expected <= cameInAt ? "present" : "late"
        })
    })

    const attendanceArray = await e.locals.db.query.Attendance.findMany({
        where: ({ hospitalId }, { eq }) => eq(hospitalId, e.params.hospital_id)
    });

    let attendanceCounts = attendanceArray.reduce((acc: any, record) => {
        let date = new Date(record.checkInAt).toISOString().split('T')[0];
        if (!acc[date]) {
            acc[date] = 0;
        }
        if (record.checkInAt >= startTimestamp && record.checkInAt <= endTimestamp) {
            acc[date]++;
        }
        return acc;
    }, {});

    let countsArray = [0, ...Object.values(attendanceCounts)];

    return {
        countsArray,
        sums: {
            total: (await e.locals.db.query.HospitalEmployee.findMany({ columns: { id: true }, where: ({ hospitalId, role }, { eq, and }) => and(eq(hospitalId, e.params.hospital_id), eq(role, "employee")) })).length,
            present: attendance.filter(a => a.status === "present").length,
            late: attendance.filter(a => a.status === "late").length,
            absent: 0,
        }
    };
}) satisfies PageServerLoad;