import type { Invite } from '../../api/types';

// The same fictional people as the server seed (school-server/src/seed/core.ts and names.ts),
// built with the same formulas, so a screen shows the same names with the mocks and the server.
// Staff ids are their emails, because the mock /auth/me returns the email as user.id.

const FIRST = [
  'נועם',
  'יובל',
  'עדי',
  'טל',
  'אור',
  'גל',
  'שחר',
  'עמית',
  'ליאור',
  'מור',
  'אופק',
  'ים',
  'שי',
  'רז',
  'נוי',
  'דור',
];
const LAST = [
  'כהן',
  'לוי',
  'מזרחי',
  'ביטון',
  'פרידמן',
  'גולדשטיין',
  'רוזנברג',
  'שפירא',
  'קליין',
  'ברק',
  'דהן',
  'אזולאי',
  'חדד',
  'פרץ',
  'אברהמי',
  'סבן',
];
const FIRST_EN = [
  'noam',
  'yuval',
  'adi',
  'tal',
  'or',
  'gal',
  'shachar',
  'amit',
  'lior',
  'mor',
  'ofek',
  'yam',
  'shay',
  'raz',
  'noy',
  'dor',
];
const LAST_EN = [
  'cohen',
  'levi',
  'mizrahi',
  'biton',
  'friedman',
  'goldstein',
  'rosenberg',
  'shapira',
  'klein',
  'barak',
  'dahan',
  'azulay',
  'hadad',
  'peretz',
  'avrahami',
  'saban',
];

export type MockClass = { id: string; name: string; grade: string; homeroomTeacherId: string };
export type MockSubject = { id: string; name: string; code: string; grades: string[] };
export type MockStaff = {
  id: string;
  firstName: string;
  lastName: string;
  roles: string[];
  subjectId: string | null;
  classIds: string[];
  status: 'active' | 'disabled';
};
export type MockStudent = {
  id: string;
  firstName: string;
  lastName: string;
  classId: string;
  /** tag labels, as in Student.tags in the contract */
  tags: string[];
};

export const SUBJECTS: MockSubject[] = [
  { id: 'sub-math', name: 'מתמטיקה', code: 'MATH', grades: ['ז', 'ח', 'ט'] },
  { id: 'sub-heb', name: 'עברית', code: 'HEB', grades: ['ז', 'ח', 'ט'] },
  { id: 'sub-eng', name: 'אנגלית', code: 'ENG', grades: ['ז', 'ח', 'ט'] },
  { id: 'sub-sci', name: 'מדעים', code: 'SCI', grades: ['ז', 'ח', 'ט'] },
  { id: 'sub-bib', name: 'תנ״ך', code: 'BIB', grades: ['ז', 'ח', 'ט'] },
  { id: 'sub-his', name: 'היסטוריה', code: 'HIS', grades: ['ח', 'ט'] },
  { id: 'sub-geo', name: 'גיאוגרפיה', code: 'GEO', grades: ['ט'] },
  { id: 'sub-art', name: 'אמנות', code: 'ART', grades: ['ז', 'ח'] },
];

/** Class ids by class name, e.g. CLASS_ID['ז1'] === 'cls-z1'. */
export const CLASS_ID: Record<string, string> = {
  ז1: 'cls-z1',
  ז2: 'cls-z2',
  ח1: 'cls-h1',
  ח2: 'cls-h2',
  ח3: 'cls-h3',
  ט1: 'cls-t1',
};

const subjectId = (code: string) => `sub-${code.toLowerCase()}`;
const staffEmail = (i: number) =>
  `${FIRST_EN[(i * 3 + 1) % 16]}.${LAST_EN[(i * 7 + 2) % 16]}@school.example`;

// [roles, subject code, class names, status]: the same table as STAFF in the server seed
const STAFF_ROWS: [string[], string, string[], 'active' | 'disabled'][] = [
  [['management'], '', [], 'active'],
  [['secretary'], '', [], 'active'],
  [['homeroom', 'teacher'], 'MATH', ['ח1'], 'active'],
  [['homeroom', 'teacher'], 'HEB', ['ח2'], 'active'],
  [['homeroom', 'teacher'], 'BIB', ['ח3'], 'active'],
  [['homeroom', 'teacher'], 'HEB', ['ז1'], 'active'],
  [['homeroom', 'teacher'], 'MATH', ['ז2'], 'active'],
  [['homeroom', 'teacher'], 'SCI', ['ט1'], 'active'],
  [['teacher'], 'ENG', ['ז1', 'ז2', 'ח1'], 'active'],
  [['coordinator', 'teacher'], 'MATH', ['ח2', 'ח3'], 'active'],
  [['teacher'], 'HIS', ['ז1', 'ח2', 'ט1'], 'active'],
  [['teacher'], 'ART', ['ז1', 'ז2', 'ח1', 'ח2', 'ח3', 'ט1'], 'disabled'],
];

export const STAFF: MockStaff[] = STAFF_ROWS.map(([roles, code, classes, status], i) => ({
  id: staffEmail(i),
  firstName: FIRST[(i * 3 + 1) % 16],
  lastName: LAST[(i * 7 + 2) % 16],
  roles,
  subjectId: code ? subjectId(code) : null,
  classIds: classes.map((c) => CLASS_ID[c]),
  status,
}));

/** Staff ids by name, so the fixtures read clearly. */
export const STAFF_ID = {
  management: STAFF[0].id, // יובל מזרחי
  secretary: STAFF[1].id, // אור ברק
  mathH1: STAFF[2].id, // עמית כהן, מחנך/ת ח1
  hebZ1: STAFF[5].id, // נועם גולדשטיין, מחנך/ת ז1
  mathZ2: STAFF[6].id, // טל חדד, מחנך/ת ז2
  eng: STAFF[8].id, // מור דהן
  his: STAFF[10].id, // דור קליין
};

// homeroom teacher (index in STAFF) of each class, as HOMEROOM in the server seed
const HOMEROOM: Record<string, number> = { ז1: 5, ז2: 6, ח1: 2, ח2: 3, ח3: 4, ט1: 7 };
export const CLASSES: MockClass[] = Object.entries(HOMEROOM).map(([name, i]) => ({
  id: CLASS_ID[name],
  name,
  grade: name[0],
  homeroomTeacherId: STAFF[i].id,
}));

// students are numbered across the classes in this order, as CLASS_SIZES in the server seed
const CLASS_SIZES: Record<string, number> = { ז1: 8, ז2: 8, ח1: 12, ח2: 10, ח3: 10, ט1: 12 };

/** Student ids are 'stu-1', 'stu-2' ... in the order of the server seed. */
export function seedStudents(): MockStudent[] {
  const out: MockStudent[] = [];
  let i = 0;
  for (const [className, size] of Object.entries(CLASS_SIZES)) {
    for (let k = 0; k < size; k++, i++) {
      // the server seed tags every ninth student; stu-5 gets one more label for the demo
      const tags = i % 9 === 4 ? ['מעקב'] : [];
      if (i === 4) tags.push('תגבור קריאה');
      out.push({
        id: `stu-${i + 1}`,
        firstName: FIRST[i % 16],
        lastName: LAST[(i * 5 + 3) % 16],
        classId: CLASS_ID[className],
        tags,
      });
    }
  }
  return out;
}

/** The students of one class, in id order. */
export const studentsOf = (students: MockStudent[], classId: string) =>
  students.filter((s) => s.classId === classId);

export const seedInvites = (): Invite[] => [
  {
    id: 'inv-1',
    email: 'lior.peretz@school.example',
    role: 'teacher',
    classIds: [CLASS_ID['ח2'], CLASS_ID['ח3']],
    message: 'ברוכים הבאים לצוות. הקישור תקף לשבעה ימים.',
    status: 'pending',
    invitedBy: STAFF_ID.management,
    createdAt: '2026-10-25T08:00:00.000Z',
    expiresAt: '2026-11-01T08:00:00.000Z',
  },
  {
    id: 'inv-2',
    email: 'gal.azulay@school.example',
    role: 'secretary',
    status: 'pending',
    invitedBy: STAFF_ID.management,
    createdAt: '2026-10-26T09:30:00.000Z',
    expiresAt: '2026-11-02T09:30:00.000Z',
  },
  {
    id: 'inv-3',
    email: 'ofek.friedman@school.example',
    role: 'parent',
    studentIds: ['stu-2'],
    status: 'pending',
    invitedBy: STAFF_ID.secretary,
    createdAt: '2026-10-27T07:15:00.000Z',
    expiresAt: '2026-11-03T07:15:00.000Z',
  },
  {
    id: 'inv-4',
    email: 'yam.rosenberg@school.example',
    role: 'parent',
    studentIds: ['stu-17'],
    status: 'expired',
    invitedBy: STAFF_ID.secretary,
    createdAt: '2026-10-01T10:00:00.000Z',
    expiresAt: '2026-10-08T10:00:00.000Z',
  },
  {
    id: 'inv-5',
    email: 'noy.klein@school.example',
    role: 'coordinator',
    status: 'revoked',
    invitedBy: STAFF_ID.management,
    createdAt: '2026-10-12T11:00:00.000Z',
    expiresAt: '2026-10-19T11:00:00.000Z',
  },
];
