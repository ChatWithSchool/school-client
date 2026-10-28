import { http, HttpResponse } from 'msw';
import type { Announcement } from '../api/types';
import { DEMO_PASSWORD, USERS, addAnnouncement, announcements } from './data';
import { authz, err, userOf } from './http';
import { landingFor, permissionsFor } from './permissions';
import { sharedHandlers } from './shared/handlers';
import { STAFF, shared } from './shared';

/**
 * Mock API. Add handlers for your endpoints so your screen works before the server is ready.
 *
 * The GET handlers for the shared collections (rooms, events, lessons, teaching assignments,
 * invites, assessments, grades, student tags, attendance and attendance alerts) already exist in
 * ./shared/handlers.ts. Do not add them again here: add only the write handlers (POST, PUT,
 * PATCH, DELETE) of your own screen, and change the data in ./shared so the GET handlers see it.
 */
export const handlers = [
  http.post('*/api/auth/login', async ({ request }) => {
    const { email, password } = (await request.json()) as { email: string; password: string };
    const user = USERS[email.trim().toLowerCase()];
    if (!user || password !== DEMO_PASSWORD)
      return err(401, 'INVALID_CREDENTIALS', 'האימייל או הסיסמה שגויים');
    return HttpResponse.json({
      token: `mock.${email.trim().toLowerCase()}`,
      landing: landingFor(user.roles),
    });
  }),

  http.get('*/api/auth/me', ({ request }) => {
    const u = userOf(request);
    if (!u) return err(401, 'UNAUTHENTICATED', 'נדרשת התחברות');
    return HttpResponse.json({
      user: {
        id: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        roles: u.roles,
      },
      permissions: permissionsFor(u.roles),
      landing: landingFor(u.roles),
    });
  }),

  http.get('*/api/announcements', ({ request }) => {
    const a = authz(request, 'I10', 'read');
    if (a.res) return a.res;
    return HttpResponse.json({
      items: announcements,
      total: announcements.length,
      page: 1,
      size: 25,
    });
  }),

  http.post('*/api/announcements', async ({ request }) => {
    const a = authz(request, 'I10', 'write');
    if (a.res) return a.res;
    const body = (await request.json()) as { title?: string; body?: string; pinned?: boolean };
    const details: { field: string; message: string }[] = [];
    if (!body.title || body.title.trim().length < 2)
      details.push({ field: 'title', message: 'חובה כותרת (לפחות 2 תווים)' });
    if (!body.body || !body.body.trim()) details.push({ field: 'body', message: 'חובה תוכן' });
    if (details.length) return err(400, 'VALIDATION_ERROR', 'הנתונים שנשלחו אינם תקינים', details);
    const created: Announcement = {
      id: `a${announcements.length + 1}`,
      title: body.title!.trim(),
      body: body.body!.trim(),
      audience: 'staff',
      pinned: Boolean(body.pinned),
      createdAt: new Date().toISOString(),
      read: false,
    };
    addAnnouncement(created);
    return HttpResponse.json({ id: created.id }, { status: 201 });
  }),

  http.post('*/api/announcements/:id/read', ({ params, request }) => {
    const z = authz(request, 'I10', 'read');
    if (z.res) return z.res;
    const a = announcements.find((x) => x.id === params.id);
    if (!a) return err(404, 'NOT_FOUND', 'ההודעה לא נמצאה');
    a.read = true;
    return new HttpResponse(null, { status: 204 });
  }),

  http.get('*/api/me/teaching', ({ request }) => {
    const u = userOf(request);
    if (!u) return err(401, 'UNAUTHENTICATED', 'נדרשת התחברות');
    const staffMember = STAFF.find((s) => s.id === u.email);
    if (!staffMember) return HttpResponse.json({ items: [] });
    const assignments = shared.teachingAssignments.filter(
      (a) => a.teacherId === staffMember.id,
    );
    const items = assignments.map((a) => {
      const openAssessments = shared.assessments.filter(
        (x) => x.classId === a.classId && x.subjectId === a.subjectId && x.gradedCount === 0,
      ).length;
      const classStudents = shared.students.filter((s) => s.classId === a.classId);
      const gradedStudentIds = new Set(
        shared.grades
          .filter((g) =>
            shared.assessments.some(
              (x) => x.id === g.assessmentId && x.classId === a.classId && x.subjectId === a.subjectId,
            ),
          )
          .map((g) => g.studentId),
      );
      const studentsWithoutGrade = classStudents.filter((s) => !gradedStudentIds.has(s.id)).length;
      return {
        classId: a.classId,
        subjectId: a.subjectId,
        openAssessments,
        studentsWithoutGrade,
      };
    });
    return HttpResponse.json({ items });
  }),

  ...sharedHandlers,
];
