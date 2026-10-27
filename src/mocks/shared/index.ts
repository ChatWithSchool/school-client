import { seedAttendance, seedAttendanceAlerts } from './attendance';
import { seedGrading } from './grades';
import { seedInvites, seedStudents } from './people';
import { seedEvents, seedLessons, seedRooms, seedTeachingAssignments } from './timetable';

export { CLASSES, CLASS_ID, STAFF, STAFF_ID, SUBJECTS } from './people';
export type { MockClass, MockStaff, MockStudent, MockSubject } from './people';

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
