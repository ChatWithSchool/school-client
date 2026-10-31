import { pathFor } from '../../routes/screens';

/**
 * Links INTO the student card (S03). Use these from other screens, for example from the rows of
 * the students list (S01), the global search (S09) or the dashboard:
 *   <Link to={studentCardPath(student.id)}>...</Link>
 * The registry path of S03 is '/students/s03/:id', so the id has to be filled in.
 */
export const studentCardPath = (id: string, tab?: 'details' | 'attendance' | 'grades' | 'notes') =>
  pathFor('S03').replace(':id', encodeURIComponent(id)) + (tab ? `?tab=${tab}` : '');

/** The stand-alone behavior notes screen (S06) of one student. */
export const behaviorNotesPath = (id: string) => `${pathFor('S06')}?student=${encodeURIComponent(id)}`;
