import type { AttendanceAlert, AttendanceRecord } from '../../api/types';
import { CLASSES, CLASS_ID, STAFF_ID, studentsOf, type MockStudent } from './people';

/** One school week, Sunday to Thursday. The last day is the latest school day of the mocks. */
const ATTENDANCE_DATES = ['2026-10-18', '2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22'];

/** The classes with attendance records. */
const ATTENDANCE_CLASSES = [CLASS_ID['ז1'], CLASS_ID['ח1']];

// Everyone is present except these. They follow the server rules for alerts:
// stu-4 is absent the last 3 days in a row (a streak, and also 3 absences this month);
// stu-20 is absent 3 separate days this month (monthly only, the run at the end is 1 day).
const EXCEPTIONS: Record<string, Record<string, 'absent' | 'late'>> = {
  'stu-2': { '2026-10-18': 'absent' },
  'stu-6': { '2026-10-19': 'late' },
  'stu-4': { '2026-10-20': 'absent', '2026-10-21': 'absent', '2026-10-22': 'absent' },
  'stu-20': { '2026-10-18': 'absent', '2026-10-20': 'absent', '2026-10-22': 'absent' },
  'stu-23': { '2026-10-21': 'late' },
};

const homeroomOf = (classId: string) => CLASSES.find((c) => c.id === classId)!.homeroomTeacherId;

/** Daily attendance (period: null) for one week, marked by the homeroom teacher of the class. */
export const seedAttendance = (students: MockStudent[]): AttendanceRecord[] =>
  ATTENDANCE_CLASSES.flatMap((classId) =>
    ATTENDANCE_DATES.flatMap((date) =>
      studentsOf(students, classId).map((s) => ({
        id: `att-${date}-${s.id}`,
        classId,
        studentId: s.id,
        date,
        period: null,
        status: EXCEPTIONS[s.id]?.[date] ?? 'present',
        markedBy: homeroomOf(classId),
        updatedAt: `${date}T06:00:00.000Z`,
      })),
    ),
  );

/**
 * The open alerts are exactly what the server rules give for the records above:
 * streak = 3 or more absences in a row up to the latest school day (since = first day of the run);
 * monthly = 3 or more absences in the current month (since = first of them, month = 'YYYY-MM').
 * The closed alert is an old case from September, before the records start.
 */
export const seedAttendanceAlerts = (): AttendanceAlert[] => [
  {
    id: 'al-1',
    studentId: 'stu-4',
    classId: CLASS_ID['ז1'],
    type: 'streak',
    since: '2026-10-20',
    month: null,
    count: 3,
    status: 'open',
    closedBy: null,
    closedAt: null,
  },
  {
    id: 'al-2',
    studentId: 'stu-4',
    classId: CLASS_ID['ז1'],
    type: 'monthly',
    since: '2026-10-20',
    month: '2026-10',
    count: 3,
    status: 'open',
    closedBy: null,
    closedAt: null,
  },
  {
    id: 'al-3',
    studentId: 'stu-20',
    classId: CLASS_ID['ח1'],
    type: 'monthly',
    since: '2026-10-18',
    month: '2026-10',
    count: 3,
    status: 'open',
    closedBy: null,
    closedAt: null,
  },
  {
    id: 'al-4',
    studentId: 'stu-10',
    classId: CLASS_ID['ז2'],
    type: 'monthly',
    since: '2026-09-07',
    month: '2026-09',
    count: 5,
    status: 'closed',
    closeNote: 'שוחחנו עם ההורים. ההיעדרויות היו בגלל מחלה.',
    closedBy: STAFF_ID.mathZ2,
    closedAt: '2026-09-29T10:00:00.000Z',
  },
];
