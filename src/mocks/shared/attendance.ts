import type { AttendanceAlert, AttendanceRecord } from '../../api/types';
import { CLASS_ID, STAFF_ID, studentsOf, type MockStudent } from './people';

/** One school week, Sunday to Thursday. */
const ATTENDANCE_DATES = ['2026-10-18', '2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22'];

// everyone is present except these; stu-4 is absent three days in a row (the open streak alert)
const EXCEPTIONS: Record<string, Record<string, 'absent' | 'late'>> = {
  'stu-2': { '2026-10-18': 'absent' },
  'stu-6': { '2026-10-19': 'late' },
  'stu-4': { '2026-10-20': 'absent', '2026-10-21': 'absent', '2026-10-22': 'absent' },
};

/** Daily attendance (period: null) of class ז1 for one week, marked by its homeroom teacher. */
export const seedAttendance = (students: MockStudent[]): AttendanceRecord[] =>
  ATTENDANCE_DATES.flatMap((date) =>
    studentsOf(students, CLASS_ID['ז1']).map((s) => ({
      id: `att-${date}-${s.id}`,
      classId: s.classId,
      studentId: s.id,
      date,
      period: null,
      status: EXCEPTIONS[s.id]?.[date] ?? 'present',
      markedBy: STAFF_ID.hebZ1,
      updatedAt: `${date}T06:00:00.000Z`,
    })),
  );

export const seedAttendanceAlerts = (): AttendanceAlert[] => [
  {
    id: 'al-1',
    studentId: 'stu-4',
    classId: CLASS_ID['ז1'],
    type: 'streak',
    since: '2026-10-20',
    count: 3,
    status: 'open',
    closedAt: null,
  },
  {
    id: 'al-2',
    studentId: 'stu-20',
    classId: CLASS_ID['ח1'],
    type: 'monthly',
    since: '2026-10-01',
    count: 6,
    status: 'open',
    closedAt: null,
  },
  {
    id: 'al-3',
    studentId: 'stu-30',
    classId: CLASS_ID['ח2'],
    type: 'streak',
    since: '2026-10-19',
    count: 4,
    status: 'open',
    closedAt: null,
  },
  {
    id: 'al-4',
    studentId: 'stu-10',
    classId: CLASS_ID['ז2'],
    type: 'monthly',
    since: '2026-09-01',
    count: 5,
    status: 'closed',
    closeNote: 'שוחחנו עם ההורים. ההיעדרויות היו בגלל מחלה.',
    closedAt: '2026-09-29T10:00:00.000Z',
  },
];
