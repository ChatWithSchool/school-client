import type { Assessment, Grade, GradeFeedback } from '../../api/types';
import { CLASS_ID, STAFF_ID, studentsOf, type MockStudent } from './people';

type Seed = { assessments: Assessment[]; grades: Grade[]; gradeFeedback: GradeFeedback[] };

const ASSESSMENTS: Omit<Assessment, 'gradedCount'>[] = [
  {
    id: 'asm-1',
    title: 'מבחן בשברים',
    type: 'exam',
    classId: CLASS_ID['ח1'],
    groupId: null,
    subjectId: 'sub-math',
    teacherId: STAFF_ID.mathH1,
    termId: null,
    date: '2026-10-15',
    weight: 30,
  },
  {
    id: 'asm-2',
    title: 'בוחן אוצר מילים',
    type: 'quiz',
    classId: CLASS_ID['ח1'],
    groupId: null,
    subjectId: 'sub-eng',
    teacherId: STAFF_ID.eng,
    termId: null,
    date: '2026-10-21',
    weight: 10,
  },
  {
    id: 'asm-3',
    title: 'עבודה: קריאה מודרכת',
    type: 'assignment',
    classId: CLASS_ID['ז1'],
    groupId: null,
    subjectId: 'sub-heb',
    teacherId: STAFF_ID.hebZ1,
    termId: null,
    date: null,
    weight: 20,
  },
  {
    id: 'asm-4',
    title: 'מבחן אמצע',
    type: 'exam',
    classId: CLASS_ID['ז1'],
    groupId: null,
    subjectId: 'sub-eng',
    teacherId: STAFF_ID.eng,
    termId: null,
    date: '2026-11-05',
    weight: 30,
  },
];

// students without a score yet (score: null); asm-4 is in the future, so nobody has one
const NOT_ENTERED: Record<string, string[] | 'all'> = {
  'asm-1': ['stu-20'],
  'asm-2': ['stu-18', 'stu-25'],
  'asm-3': ['stu-3', 'stu-6', 'stu-7'],
  'asm-4': 'all',
};

/** One grade row per student of the class, a fixed score between 55 and 100, and gradedCount. */
export function seedGrading(students: MockStudent[]): Seed {
  const grades: Grade[] = ASSESSMENTS.flatMap((a, ai) => {
    const missing = NOT_ENTERED[a.id];
    return studentsOf(students, a.classId).map((s, si) => ({
      id: `grd-${a.id}-${s.id}`,
      assessmentId: a.id,
      studentId: s.id,
      score: missing === 'all' || missing.includes(s.id) ? null : 55 + ((si * 37 + ai * 13) % 46),
      updatedBy: a.teacherId,
      updatedAt: `${a.date ?? '2026-10-20'}T14:00:00.000Z`,
    }));
  });
  const assessments = ASSESSMENTS.map((a) => ({
    ...a,
    gradedCount: grades.filter((g) => g.assessmentId === a.id && g.score !== null).length,
  }));
  const gradeFeedback: GradeFeedback[] = [
    {
      id: 'fb-1',
      gradeId: 'grd-asm-1-stu-17',
      studentId: 'stu-17',
      text: 'עבודה מסודרת. כדאי לבדוק שוב את החישוב בשאלה האחרונה.',
      authorId: STAFF_ID.mathH1,
      createdAt: '2026-10-16T09:00:00.000Z',
    },
    {
      id: 'fb-2',
      gradeId: 'grd-asm-2-stu-19',
      studentId: 'stu-19',
      text: 'שיפור יפה מהבוחן הקודם.',
      authorId: STAFF_ID.eng,
      createdAt: '2026-10-22T12:30:00.000Z',
    },
  ];
  return { assessments, grades, gradeFeedback };
}
