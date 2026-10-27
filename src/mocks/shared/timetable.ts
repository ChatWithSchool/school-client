import type { Lesson, Room, SchoolEvent, TeachingAssignment } from '../../api/types';
import { CLASS_ID, STAFF } from './people';

export const seedRooms = (): Room[] => [
  { id: 'room-101', name: 'כיתה 101', type: 'classroom', capacity: 32, active: true },
  { id: 'room-102', name: 'כיתה 102', type: 'classroom', capacity: 32, active: true },
  { id: 'room-201', name: 'כיתה 201', type: 'classroom', capacity: 35, active: true },
  { id: 'room-202', name: 'כיתה 202', type: 'classroom', capacity: 35, active: true },
  { id: 'room-203', name: 'כיתה 203', type: 'classroom', capacity: 35, active: true },
  { id: 'room-301', name: 'כיתה 301', type: 'classroom', capacity: 35, active: true },
  {
    id: 'room-302',
    name: 'כיתה 302',
    type: 'classroom',
    capacity: 30,
    notes: 'סגורה לשיפוץ עד סוף החודש',
    active: false,
  },
  {
    id: 'room-lab',
    name: 'מעבדת מדעים',
    type: 'lab',
    capacity: 24,
    notes: 'כיורים ועמדות ניסוי',
    active: true,
  },
  { id: 'room-hall', name: 'אולם', type: 'hall', capacity: 200, active: true },
];

export const seedEvents = (): SchoolEvent[] => [
  {
    id: 'ev-1',
    title: 'אסיפת הורים',
    type: 'parents_day',
    startDate: '2026-11-10',
    endDate: '2026-11-10',
    gradeLevels: [],
  },
  {
    id: 'ev-2',
    title: 'טיול שנתי',
    type: 'event',
    startDate: '2026-11-18',
    endDate: '2026-11-19',
    gradeLevels: ['ח'],
  },
  {
    id: 'ev-3',
    title: 'יום עיון',
    type: 'event',
    startDate: '2026-11-03',
    endDate: '2026-11-03',
    gradeLevels: ['ז', 'ט'],
  },
  {
    id: 'ev-4',
    title: 'יום חופש לתלמידים (השתלמות צוות)',
    type: 'holiday',
    startDate: '2026-11-24',
    endDate: '2026-11-24',
    gradeLevels: [],
  },
  {
    id: 'ev-5',
    title: 'חופשת חנוכה',
    type: 'vacation',
    startDate: '2026-12-06',
    endDate: '2026-12-13',
    gradeLevels: [],
  },
];

/**
 * One assignment for every class and subject of an active teacher, from the staff table of the
 * server seed. The art teacher is disabled there, so art has no assignments.
 */
export const seedTeachingAssignments = (): TeachingAssignment[] =>
  STAFF.filter((t) => t.status === 'active' && t.subjectId).flatMap((t) =>
    t.classIds.map((classId) => ({
      id: `ta-${classId}-${t.subjectId}`,
      classId,
      subjectId: t.subjectId!,
      teacherId: t.id,
    })),
  );

// Weekly grids: one row per day (Sunday to Thursday), one subject code per period (1 to 4).
// The same English teacher teaches both classes, so the ENG periods of the two never overlap.
const GRID: Record<string, { roomId: string; days: string[][] }> = {
  [CLASS_ID['ז1']]: {
    roomId: 'room-101',
    days: [
      ['HEB', 'ENG', 'HIS', 'HEB'],
      ['ENG', 'HEB', 'HEB', 'HIS'],
      ['HEB', 'HIS', 'ENG', 'HEB'],
      ['HIS', 'HEB', 'ENG', 'ENG'],
      ['HEB', 'ENG', 'HIS', 'HEB'],
    ],
  },
  [CLASS_ID['ח1']]: {
    roomId: 'room-201',
    days: [
      ['ENG', 'MATH', 'MATH', 'MATH'],
      ['MATH', 'MATH', 'ENG', 'MATH'],
      ['ENG', 'MATH', 'MATH', 'MATH'],
      ['ENG', 'MATH', 'MATH', 'MATH'],
      ['MATH', 'MATH', 'ENG', 'ENG'],
    ],
  },
};

/** Lessons of the grids above; each teacher comes from the class's teaching assignment. */
export function seedLessons(assignments: TeachingAssignment[]): Lesson[] {
  return Object.entries(GRID).flatMap(([classId, { roomId, days }]) =>
    days.flatMap((codes, dayOfWeek) =>
      codes.map((code, p) => {
        const subjectId = `sub-${code.toLowerCase()}`;
        const ta = assignments.find((a) => a.classId === classId && a.subjectId === subjectId);
        if (!ta) throw new Error(`No teaching assignment for ${classId} ${subjectId}`);
        const period = p + 1;
        return {
          id: `les-${classId}-${dayOfWeek}-${period}`,
          classId,
          groupId: null,
          subjectId,
          teacherId: ta.teacherId,
          // one lesson has no room yet, to show the empty state of the room field
          roomId: classId === CLASS_ID['ז1'] && dayOfWeek === 3 && period === 1 ? null : roomId,
          dayOfWeek,
          period,
        };
      }),
    ),
  );
}
