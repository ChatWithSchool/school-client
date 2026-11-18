import type { Announcement } from '../api/types';
import { resetShared } from './shared';

export const DEMO_PASSWORD = 'Demo1234!';

/** Fictional demo users (the same people as in the design file and in the server seed). */
export const USERS: Record<string, { firstName: string; lastName: string; roles: string[] }> = {
  'yuval.mizrahi@school.example': { firstName: 'יובל', lastName: 'מזרחי', roles: ['management'] },
  'or.barak@school.example': { firstName: 'אור', lastName: 'ברק', roles: ['secretary'] },
  'amit.cohen@school.example': {
    firstName: 'עמית',
    lastName: 'כהן',
    roles: ['homeroom', 'teacher'],
  },
  'mor.dahan@school.example': { firstName: 'מור', lastName: 'דהן', roles: ['teacher'] },
  'amit.biton@school.example': { firstName: 'עמית', lastName: 'ביטון', roles: ['parent'] },
};

const seed = (): Announcement[] => [
  {
    id: 'a1',
    title: 'ברוכים הבאים לשנת הלימודים',
    body: 'נשמח לפגוש את כולם בישיבת הצוות הראשונה.',
    audience: 'staff',
    pinned: true,
    createdAt: '2026-09-01T08:00:00.000Z',
    read: false,
  },
  {
    id: 'a2',
    title: 'עדכון מערכת שעות',
    body: 'מערכת השעות החדשה תפורסם בתחילת השבוע.',
    audience: 'staff',
    pinned: false,
    createdAt: '2026-09-03T08:00:00.000Z',
    read: false,
  },
];

export let announcements: Announcement[] = seed();
/** Puts all the mock data back to the seed (the test setup calls it after every test). */
export const resetData = (): void => {
  announcements = seed();
  t03UncoveredLessons = seedUncovered();
  resetShared();
};
export const addAnnouncement = (a: Announcement): void => {
  announcements = [a, ...announcements];
};

/* T03: substitutes demo data */
export const t03AvailableTeachers = [
  { id: 't1', name: 'דנה כהן', subjects: 'מתמטיקה, פיזיקה', hoursThatDay: 3 },
  { id: 't2', name: 'רות לוי', subjects: 'אנגלית', hoursThatDay: 2 },
  { id: 't3', name: 'מיכל אברהם', subjects: 'תנ"ך, היסטוריה', hoursThatDay: 4 },
];

const seedUncovered = () => [
  { id: 'l1', lessonNumber: 3, className: 'ז׳1', subject: 'מתמטיקה', absentTeacher: 'שרה גולד' },
  { id: 'l2', lessonNumber: 5, className: 'ח׳2', subject: 'אנגלית', absentTeacher: 'שרה גולד' },
];

/** Lessons without a teacher. A substitution removes the lesson from this list. */
export let t03UncoveredLessons = seedUncovered();
export const removeUncoveredLesson = (id: string): void => {
  t03UncoveredLessons = t03UncoveredLessons.filter((l) => l.id !== id);
};
