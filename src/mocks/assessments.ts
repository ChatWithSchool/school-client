import { http, HttpResponse } from 'msw';
import type { AssessmentInput } from '../api/assessmentsApi';
import type { Assessment } from '../api/types';
import { authz, err } from './http';
import { permissionsFor } from './permissions';
import { shared } from './shared';

const TYPES: Assessment['type'][] = ['exam', 'quiz', 'assignment'];

/** The field errors of a create or an update, as the server would send them (400 VALIDATION_ERROR). */
function invalid(body: Partial<AssessmentInput>) {
  const details: { field: string; message: string }[] = [];
  if (!body.title || body.title.trim().length < 2)
    details.push({ field: 'title', message: 'חובה שם (לפחות 2 תווים)' });
  if (!body.classId) details.push({ field: 'classId', message: 'חובה לבחור כיתה' });
  if (!body.subjectId) details.push({ field: 'subjectId', message: 'חובה לבחור מקצוע' });
  if (!body.type || !TYPES.includes(body.type))
    details.push({ field: 'type', message: 'חובה לבחור סוג' });
  if (body.date && !/^\d{4}-\d{2}-\d{2}$/.test(body.date))
    details.push({ field: 'date', message: 'תאריך לא תקין' });
  if (body.weight !== undefined && !(body.weight >= 0 && body.weight <= 100))
    details.push({ field: 'weight', message: 'משקל בין 0 ל-100' });
  return details.length
    ? err(400, 'VALIDATION_ERROR', 'הנתונים שנשלחו אינם תקינים', details)
    : null;
}

/** A teacher (scoped) may only use a class and subject she teaches; management (full) any. */
function notHers(user: { email: string; roles: string[] }, classId: string, subjectId: string) {
  if (permissionsFor(user.roles).G04 === 'full') return null;
  const teaches = shared.teachingAssignments.some(
    (t) => t.teacherId === user.email && t.classId === classId && t.subjectId === subjectId,
  );
  return teaches ? null : err(403, 'FORBIDDEN', 'אי אפשר ליצור מבחן לכיתה שאינה שלך');
}

/** An empty grade table (score null) for each student of the class: G01 can enter grades at once. */
function emptyGrades(a: Assessment) {
  const now = new Date().toISOString();
  shared.grades = shared.grades.filter((g) => g.assessmentId !== a.id);
  for (const s of shared.students.filter((x) => x.classId === a.classId))
    shared.grades.push({
      id: `grd-${a.id}-${s.id}`,
      assessmentId: a.id,
      studentId: s.id,
      score: null,
      updatedBy: a.teacherId,
      updatedAt: now,
    });
}

const fields = (body: AssessmentInput) => ({
  title: body.title.trim(),
  type: body.type,
  classId: body.classId,
  subjectId: body.subjectId,
  date: body.date || null,
  weight: body.weight,
});

/** G04: create and edit an assessment. The GET is in ./shared/handlers.ts. */
export const assessmentHandlers = [
  http.post('*/api/assessments', async ({ request }) => {
    const a = authz(request, 'G04', 'write');
    if (a.res) return a.res;
    const body = (await request.json()) as AssessmentInput;
    const bad = invalid(body) ?? notHers(a.user, body.classId, body.subjectId);
    if (bad) return bad;
    const created: Assessment = {
      id: `asm-${shared.assessments.length + 1}`,
      ...fields(body),
      groupId: null,
      teacherId: a.user.email,
      termId: null,
      gradedCount: 0,
    };
    shared.assessments.push(created);
    emptyGrades(created);
    return HttpResponse.json({ id: created.id }, { status: 201 });
  }),

  http.put('*/api/assessments/:id', async ({ params, request }) => {
    const a = authz(request, 'G04', 'write');
    if (a.res) return a.res;
    const found = shared.assessments.find((x) => x.id === params.id);
    if (!found) return err(404, 'NOT_FOUND', 'המבחן לא נמצא');
    const body = (await request.json()) as AssessmentInput;
    const bad =
      invalid(body) ??
      notHers(a.user, found.classId, found.subjectId) ??
      notHers(a.user, body.classId, body.subjectId);
    if (bad) return bad;
    const moved = body.classId !== found.classId || body.subjectId !== found.subjectId;
    if (moved && found.gradedCount)
      return err(409, 'CONFLICT', 'כבר הוזנו ציונים: אי אפשר להעביר את המבחן לכיתה או למקצוע אחר');
    Object.assign(found, fields(body));
    if (moved) emptyGrades(found);
    return HttpResponse.json({ id: found.id });
  }),
];
