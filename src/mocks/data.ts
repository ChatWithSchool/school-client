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

export type MockSubject = { id: string; name: string; code: string; grades: string[] };
const SUBJECT_SEED: MockSubject[] = [
  { id: '000000000000000000000001', name: 'מתמטיקה', code: 'MATH', grades: ['ז', 'ח', 'ט'] },
  { id: '000000000000000000000002', name: 'עברית', code: 'HEB', grades: ['ז', 'ח', 'ט'] },
  { id: '000000000000000000000003', name: 'אנגלית', code: 'ENG', grades: ['ז', 'ח', 'ט'] },
  { id: '000000000000000000000004', name: 'מדעים', code: 'SCI', grades: ['ז', 'ח', 'ט'] },
  { id: '000000000000000000000005', name: 'תנ״ך', code: 'BIB', grades: ['ז', 'ח', 'ט'] },
];
export const mockSubjects: MockSubject[] = [...SUBJECT_SEED];

export const mockTeachingClasses = [
  { id: '000000000000000000000101', name: 'ז1', grade: 'ז' },
  { id: '000000000000000000000102', name: 'ז2', grade: 'ז' },
  { id: '000000000000000000000103', name: 'ח1', grade: 'ח' },
  { id: '000000000000000000000104', name: 'ח2', grade: 'ח' },
  { id: '000000000000000000000105', name: 'ט1', grade: 'ט' },
];

export const mockTeachingTeachers = [
  { id: '000000000000000000000201', firstName: 'עמית', lastName: 'כהן' },
  { id: '000000000000000000000202', firstName: 'מור', lastName: 'דהן' },
];

const ASSIGNMENT_SEED = [
  {
    classId: mockTeachingClasses[0].id,
    subjectId: mockSubjects[2].id,
    teacherId: mockTeachingTeachers[1].id,
  },
  {
    classId: mockTeachingClasses[2].id,
    subjectId: mockSubjects[0].id,
    teacherId: mockTeachingTeachers[0].id,
  },
];
export const mockAssignments = [...ASSIGNMENT_SEED];

/** Puts all the mock data back to the seed (the test setup calls it after every test). */
export const resetData = (): void => {
  announcements = seed();
  resetShared();
  mockSubjects.splice(0, mockSubjects.length, ...SUBJECT_SEED);
  mockAssignments.splice(0, mockAssignments.length, ...ASSIGNMENT_SEED);
};

export const addAnnouncement = (a: Announcement): void => {
  announcements = [a, ...announcements];
};

export const addMockSubject = (subject: MockSubject): void => {
  mockSubjects.push(subject);
};