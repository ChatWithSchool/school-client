import type { BadgeTone, AttendanceStatus } from '../../components/ui';

/**
 * Mock data for S03 (sprint 1 - client only).
 * When the server is ready (sprint 4) replace these with RTK Query hooks:
 *   GET /students/{id}          -> Student
 *   GET /students/{id}/summary  -> StudentSummary
 * The shapes below match what the screen needs, so only this file changes.
 */

export type StudentTag = { label: string; tone: BadgeTone };

export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  birthDate: string; // dd.MM.yyyy
  classLabel: string;
  address: string;
  guardianPhone: string;
  guardianEmail: string;
  tags: StudentTag[];
  /** today's attendance, shown as a chip in the header */
  todayStatus: AttendanceStatus;
};

export type StudentSummary = {
  attendancePercent: number;
  attendanceTarget: number;
  gradeAverage: number;
  gradeDelta: number; // negative = a drop
  openNotes: number;
  lastNoteDaysAgo: number;
};

export type GradeTrend = 'up' | 'down' | 'stable';
export type SubjectGrade = {
  subject: string;
  /** the latest scores, newest first */
  recent: number[];
  average: number;
  trend: GradeTrend;
};
export type TeacherFeedback = { subject: string; text: string };

export type AttendanceRecord = {
  id: string;
  date: string; // dd.MM
  lesson: string;
  status: AttendanceStatus;
  note: string;
};
export type AttendanceStats = { percent: number; absences: number; lates: number };

export const DEFAULT_STUDENT_ID = 'st-1';

const STUDENTS: Student[] = [
  {
    id: 'st-1',
    firstName: 'אור',
    lastName: 'שפירא',
    nationalId: '000000000',
    birthDate: '01.01.2012',
    classLabel: 'ח3',
    address: 'כתובת לדוגמה 1',
    guardianPhone: '050-000-0000',
    guardianEmail: 'parent@example.com',
    tags: [
      { label: 'מעקב', tone: 'warning' },
      { label: 'תמיכה', tone: 'accent' },
    ],
    todayStatus: 'absent',
  },
  {
    id: 'st-2',
    firstName: 'נועה',
    lastName: 'כהן',
    nationalId: '000000018',
    birthDate: '14.05.2012',
    classLabel: 'ח2',
    address: 'כתובת לדוגמה 2',
    guardianPhone: '050-111-1111',
    guardianEmail: 'cohen.parent@example.com',
    tags: [],
    todayStatus: 'present',
  },
];

const SUMMARIES: Record<string, StudentSummary> = {
  'st-1': {
    attendancePercent: 58,
    attendanceTarget: 85,
    gradeAverage: 74,
    gradeDelta: -6,
    openNotes: 2,
    lastNoteDaysAgo: 3,
  },
  'st-2': {
    attendancePercent: 96,
    attendanceTarget: 85,
    gradeAverage: 88,
    gradeDelta: 2,
    openNotes: 0,
    lastNoteDaysAgo: 0,
  },
};

/** The last 30 school days, oldest first. In the last 10 days: 5 absences (as in the design). */
const ATTENDANCE_30: AttendanceStatus[] = [
  ...(Array.from({ length: 20 }, (_, i) =>
    i === 4 || i === 13 ? 'late' : 'present',
  ) as AttendanceStatus[]),
  'present',
  'absent',
  'present',
  'absent',
  'absent',
  'late',
  'absent',
  'present',
  'absent',
  'present',
];

const GRADES: SubjectGrade[] = [
  { subject: 'מתמטיקה', recent: [87, 92, 78], average: 86, trend: 'stable' },
  { subject: 'עברית', recent: [94, 85, 96], average: 90, trend: 'up' },
  { subject: 'אנגלית', recent: [74, 78, 73], average: 75, trend: 'down' },
  { subject: 'מדעים', recent: [88, 91, 90], average: 90, trend: 'up' },
  { subject: 'תנ"ך', recent: [95, 93, 94], average: 94, trend: 'stable' },
  { subject: 'היסטוריה', recent: [82, 79, 81], average: 81, trend: 'stable' },
];

const FEEDBACK: TeacherFeedback[] = [
  { subject: 'מתמטיקה', text: 'התקדמות יפה, כדאי להמשיך לתרגל בבית.' },
  { subject: 'עברית', text: 'מצטיין בכתיבה ובהבעה, משתתף פעיל בשיעור.' },
  { subject: 'אנגלית', text: 'כדאי לחזק את אוצר המילים ולהשלים את המטלות.' },
];

const ATTENDANCE_RECORDS: AttendanceRecord[] = [
  { id: 'a-1', date: '18.10', lesson: 'שיעור 1 · מתמטיקה', status: 'present', note: '—' },
  { id: 'a-2', date: '17.10', lesson: 'שיעור 2 · עברית', status: 'late', note: 'איחור של 10 דקות' },
  { id: 'a-3', date: '16.10', lesson: 'יום שלם', status: 'absent', note: '—' },
  { id: 'a-4', date: '15.10', lesson: 'שיעור 1 · אנגלית', status: 'excused', note: 'יציאה מוקדמת' },
];

export const findStudent = (id: string): Student | undefined => STUDENTS.find((s) => s.id === id);
export const summaryFor = (id: string): StudentSummary | undefined => SUMMARIES[id];
export const attendanceFor = (_id: string): AttendanceStatus[] => ATTENDANCE_30;
export const gradesFor = (_id: string): SubjectGrade[] => GRADES;
export const feedbackFor = (_id: string): TeacherFeedback[] => FEEDBACK;
export const attendanceRecordsFor = (_id: string): AttendanceRecord[] => ATTENDANCE_RECORDS;
export const attendanceStatsFor = (_id: string): AttendanceStats => ({
  percent: 94,
  absences: 12,
  lates: 12,
});
export const fullName = (s: Student): string => `${s.firstName} ${s.lastName}`;
