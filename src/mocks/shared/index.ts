import { seedAttendance, seedAttendanceAlerts } from './attendance';
import { seedGrading } from './grades';
import { seedInvites, seedStudents, SUBJECTS } from './people';
import { seedEvents, seedLessons, seedRooms, seedTeachingAssignments } from './timetable';

export { CLASSES, CLASS_ID, STAFF, STAFF_ID, SUBJECTS } from './people';
export type { MockClass, MockStaff, MockStudent, MockSubject } from './people';

export type WeightEntry = { type: 'exam' | 'quiz' | 'assignment'; percent: number };

export type GradingWeight = {
  id: string;
  gradeLevel: string;
  subjectId: string;
  termId: string;
  weights: WeightEntry[];
};

export type TermStatus = { termId: string; closed: boolean };

const TERMS = [
  { id: 'term-a', closed: false },
  { id: 'term-b', closed: true },
];

function seedGradingWeights(): GradingWeight[] {
  const gradeLevels = ['ז', 'ח', 'ט'];
  return gradeLevels.flatMap((gradeLevel) =>
    SUBJECTS.flatMap((subject) =>
      TERMS.map((term) => ({
        id: `gw-${gradeLevel}-${subject.id}-${term.id}`,
        gradeLevel,
        subjectId: subject.id,
        termId: term.id,
        weights: [
          { type: 'exam' as const, percent: 60 },
          { type: 'quiz' as const, percent: 20 },
          { type: 'assignment' as const, percent: 20 },
        ],
      })),
    ),
  );
}

function seedTermStatuses(): TermStatus[] {
  return TERMS.map((t) => ({ termId: t.id, closed: t.closed }));
}

function seed() {
  const students = seedStudents();
  const teachingAssignments = seedTeachingAssignments();
  return {
    students,
    rooms: seedRooms(),
    events: seedEvents(),
    teachingAssignments,
    lessons: seedLessons(teachingAssignments),
    invites: seedInvites(),
    ...seedGrading(students),
    attendance: seedAttendance(students),
    attendanceAlerts: seedAttendanceAlerts(),
    gradingWeights: seedGradingWeights(),
    termStatuses: seedTermStatuses(),
  };
}

/**
 * Mock data of the shared collections. The GET handlers in ./handlers.ts read from here.
 * A write handler of a screen changes it in place, e.g. `shared.rooms.push(room)` or
 * `shared.rooms = shared.rooms.filter(...)`. resetShared() puts the seed back (after every test).
 */
export const shared = seed();

export const resetShared = (): void => {
  Object.assign(shared, seed());
};
