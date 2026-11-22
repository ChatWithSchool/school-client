import { http, HttpResponse } from 'msw';
import { authz, err } from './http';
import { CLASSES, STAFF, SUBJECTS, shared } from './shared';

const pageOf = <T,>(items: T[]) => ({
  items,
  total: items.length,
  page: 1,
  size: items.length,
});

export const subjectsAssignmentsHandlers = [
  http.get('*/api/subjects', ({ request }) => {
    const auth = authz(request, 'I06', 'read');
    if (auth.res) return auth.res;
    return HttpResponse.json(pageOf(SUBJECTS));
  }),

  http.get('*/api/classes', ({ request }) => {
    const auth = authz(request, 'I06', 'read');
    if (auth.res) return auth.res;
    return HttpResponse.json(pageOf(CLASSES));
  }),

  http.get('*/api/staff', ({ request }) => {
    const auth = authz(request, 'I06', 'read');
    if (auth.res) return auth.res;
    return HttpResponse.json(pageOf(STAFF.filter((staff) => staff.status === 'active')));
  }),

  http.put('*/api/classes/:id/teaching-assignments', async ({ params, request }) => {
    const auth = authz(request, 'I06', 'write');
    if (auth.res) return auth.res;
    const body = (await request.json()) as { subjectId?: string; teacherId?: string | null };
    if (!body.subjectId || body.teacherId === undefined)
      return err(400, 'VALIDATION_ERROR', 'יש לבחור מקצוע ולשלוח מורה או ללא שיוך');
    if (!CLASSES.some((schoolClass) => schoolClass.id === params.id))
      return err(404, 'NOT_FOUND', 'הכיתה לא נמצאה');
    if (!SUBJECTS.some((subject) => subject.id === body.subjectId))
      return err(404, 'NOT_FOUND', 'המקצוע לא נמצא');
    if (
      body.teacherId !== null &&
      !STAFF.some((teacher) => teacher.id === body.teacherId && teacher.status === 'active')
    )
      return err(404, 'NOT_FOUND', 'המורה לא נמצא');

    const existing = shared.teachingAssignments.find(
      (assignment) => assignment.classId === params.id && assignment.subjectId === body.subjectId,
    );
    if (body.teacherId === null) {
      if (existing) {
        shared.teachingAssignments.splice(shared.teachingAssignments.indexOf(existing), 1);
      }
    } else if (existing) {
      existing.teacherId = body.teacherId;
    } else {
      shared.teachingAssignments.push({
        id: `ta-${params.id}-${body.subjectId}`,
        classId: String(params.id),
        subjectId: body.subjectId,
        teacherId: body.teacherId,
      });
    }
    return new HttpResponse(null, { status: 204 });
  }),
];
