import { seedAttendance, seedAttendanceAlerts } from './attendance';
import { seedGrading } from './grades';
import { CLASSES, seedInvites, seedStudents } from './people';
import { seedEvents, seedLessons, seedRooms, seedTeachingAssignments } from './timetable';

export { CLASSES, CLASS_ID, STAFF, STAFF_ID, SUBJECTS } from './people';
export type { MockClass, MockStaff, MockStudent, MockSubject } from './people';

export type GradingWeight = {
  id: string;
  classId: string;
  term: string;
  assessmentType: 'exam' | 'quiz' | 'assignment';
  weight: number;
};

export type TermStatus = { classId: string; term: string; closed: boolean };

const ASSESSMENT_TYPES: GradingWeight['assessmentType'][] = ['exam', 'quiz', 'assignment'];
const DEFAULT_WEIGHTS: Record<GradingWeight['assessmentType'], number> = {
  exam: 60,
  quiz: 20,
  assignment: 20,
};

function seedGradingWeights(): GradingWeight[] {
  return CLASSES.flatMap((cls) =>
    ['א', 'ב'].flatMap((term) =>
      ASSESSMENT_TYPES.map((type) => ({
        id: `gw-${cls.id}-${term}-${type}`,
        classId: cls.id,
        term,
        assessmentType: type,
        weight: DEFAULT_WEIGHTS[type],
      })),
    ),
  );
}

function seedTermStatuses(): TermStatus[] {
  return CLASSES.flatMap((cls) => [
    { classId: cls.id, term: 'א', closed: false },
    { classId: cls.id, term: 'ב', closed: true },
  ]);
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
