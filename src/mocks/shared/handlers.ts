import { http, HttpResponse } from 'msw';
import type { Invite, List, Page } from '../../api/types';
import { err, userOf } from '../http';
import { CLASSES, shared } from '.';

// GET handlers of the shared collections, in the shapes of openapi.yaml. Several screens read
// each collection, so these only check that the user is signed in (401). The write handlers,
// with the permission check of their screen (authz), stay with each screen owner.

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const INVITE_STATUSES: Invite['status'][] = ['pending', 'accepted', 'revoked', 'expired'];

const unauthenticated = (request: Request) =>
  userOf(request) ? null : err(401, 'UNAUTHENTICATED', 'נדרשת התחברות');

const invalid = (field: string, message: string) =>
  err(400, 'VALIDATION_ERROR', 'הנתונים שנשלחו אינם תקינים', [{ field, message }]);

/** The contract defines no paging parameters for these lists, so it is always the first page. */
const SIZE = 25;
const pageOf = <T>(items: T[]): Page<T> => ({
  items: items.slice(0, SIZE),
  total: items.length,
  page: 1,
  size: SIZE,
});
const listOf = <T>(items: T[]): List<T> => ({ items });

/** Reads a YYYY-MM-DD query parameter: undefined when missing, null when not a valid date. */
function dateParam(url: URL, name: string): string | undefined | null {
  const value = url.searchParams.get(name);
  if (value === null) return undefined;
  return DATE.test(value) ? value : null;
}

export const sharedHandlers = [
  http.get('*/api/rooms', ({ request }) => {
    const denied = unauthenticated(request);
    if (denied) return denied;
    return HttpResponse.json(pageOf(shared.rooms));
  }),

  // an event is returned when any of its days falls between from and to (both included)
  http.get('*/api/events', ({ request }) => {
    const denied = unauthenticated(request);
    if (denied) return denied;
    const url = new URL(request.url);
    const from = dateParam(url, 'from');
    const to = dateParam(url, 'to');
    if (from === null) return invalid('from', 'תאריך בפורמט YYYY-MM-DD');
    if (to === null) return invalid('to', 'תאריך בפורמט YYYY-MM-DD');
    const items = shared.events
      .filter((e) => (!from || e.endDate >= from) && (!to || e.startDate <= to))
      .sort((a, b) => a.startDate.localeCompare(b.startDate));
    return HttpResponse.json(listOf(items));
  }),

  http.get('*/api/lessons', ({ request }) => {
    const denied = unauthenticated(request);
    if (denied) return denied;
    const q = new URL(request.url).searchParams;
    const classId = q.get('classId');
    const teacherId = q.get('teacherId');
    const roomId = q.get('roomId');
    const items = shared.lessons.filter(
      (l) =>
        (!classId || l.classId === classId) &&
        (!teacherId || l.teacherId === teacherId) &&
        (!roomId || l.roomId === roomId),
    );
    return HttpResponse.json(listOf(items));
  }),

  http.get('*/api/classes/:id/teaching-assignments', ({ params, request }) => {
    const denied = unauthenticated(request);
    if (denied) return denied;
    if (!CLASSES.some((c) => c.id === params.id)) return err(404, 'NOT_FOUND', 'הכיתה לא נמצאה');
    return HttpResponse.json(
      listOf(shared.teachingAssignments.filter((a) => a.classId === params.id)),
    );
  }),

  http.get('*/api/invites', ({ request }) => {
    const denied = unauthenticated(request);
    if (denied) return denied;
    const status = new URL(request.url).searchParams.get('status');
    if (status && !INVITE_STATUSES.includes(status as Invite['status']))
      return invalid('status', 'סטטוס לא מוכר');
    return HttpResponse.json(pageOf(shared.invites.filter((i) => !status || i.status === status)));
  }),

  http.get('*/api/assessments', ({ request }) => {
    const denied = unauthenticated(request);
    if (denied) return denied;
    return HttpResponse.json(pageOf(shared.assessments));
  }),

  http.get('*/api/assessments/:id/grades', ({ params, request }) => {
    const denied = unauthenticated(request);
    if (denied) return denied;
    if (!shared.assessments.some((a) => a.id === params.id))
      return err(404, 'NOT_FOUND', 'המטלה לא נמצאה');
    return HttpResponse.json(listOf(shared.grades.filter((g) => g.assessmentId === params.id)));
  }),

  // the tags are the labels in Student.tags, so the list is of strings
  http.get('*/api/students/:id/tags', ({ params, request }) => {
    const denied = unauthenticated(request);
    if (denied) return denied;
    const student = shared.students.find((s) => s.id === params.id);
    if (!student) return err(404, 'NOT_FOUND', 'התלמיד לא נמצא');
    return HttpResponse.json(listOf(student.tags));
  }),

  // slot is a period number (1 to 10); without slot, both daily and per-period records return
  http.get('*/api/attendance', ({ request }) => {
    const denied = unauthenticated(request);
    if (denied) return denied;
    const url = new URL(request.url);
    const classId = url.searchParams.get('class');
    const date = dateParam(url, 'date');
    const slot = url.searchParams.get('slot');
    if (date === null) return invalid('date', 'תאריך בפורמט YYYY-MM-DD');
    const period = slot === null ? undefined : Number(slot);
    if (period !== undefined && !(Number.isInteger(period) && period >= 1 && period <= 10))
      return invalid('slot', 'מספר שיעור בין 1 ל-10');
    const items = shared.attendance.filter(
      (r) =>
        (!classId || r.classId === classId) &&
        (!date || r.date === date) &&
        (period === undefined || r.period === period),
    );
    return HttpResponse.json(listOf(items));
  }),

  http.get('*/api/attendance/alerts', ({ request }) => {
    const denied = unauthenticated(request);
    if (denied) return denied;
    return HttpResponse.json(pageOf(shared.attendanceAlerts));
  }),
];
