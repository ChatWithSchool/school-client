import { http, HttpResponse } from 'msw';
import type { Announcement } from '../api/types';
import {
  DEMO_PASSWORD,
  USERS,
  addAnnouncement,
  addMockSubject,
  announcements,
  mockAssignments,
  mockSubjects,
  mockTeachingClasses,
  mockTeachingTeachers,
} from './data';
import { authz, err, userOf } from './http';
import { landingFor, permissionsFor } from './permissions';
import { sharedHandlers } from './shared/handlers';

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

  http.get('*/api/subjects', ({ request }) => {
    const auth = authz(request, 'I06', 'read');
    if (auth.res) return auth.res;
    return HttpResponse.json({
      items: mockSubjects,
      total: mockSubjects.length,
      page: 1,
      size: mockSubjects.length,
    });
  }),

  http.post('*/api/subjects', async ({ request }) => {
    const auth = authz(request, 'I06', 'write');
    if (auth.res) return auth.res;
    const body = (await request.json()) as { name?: string; code?: string; grades?: string[] };
    if (!body.name?.trim() || !body.code?.trim() || !body.grades?.length)
      return err(400, 'VALIDATION_ERROR', 'יש למלא שם, קוד ושכבות למקצוע');
    if (
      mockSubjects.some(
        (subject) =>
          subject.name.toLowerCase() === body.name!.trim().toLowerCase() ||
          subject.code.toLowerCase() === body.code!.trim().toLowerCase(),
      )
    )
      return err(409, 'SUBJECT_EXISTS', 'שם המקצוע או הקוד כבר קיימים');
    const created = {
      id: `${Date.now()}`.padStart(24, '0').slice(-24),
      name: body.name.trim(),
      code: body.code.trim().toUpperCase(),
      grades: body.grades,
    };
    addMockSubject(created);
    return HttpResponse.json({ id: created.id }, { status: 201 });
  }),

  http.get('*/api/teaching-assignments', ({ request }) => {
    const auth = authz(request, 'I06', 'read');
    if (auth.res) return auth.res;
    return HttpResponse.json({
      classes: mockTeachingClasses,
      teachers: mockTeachingTeachers,
      assignments: mockAssignments,
    });
  }),

  http.put('*/api/classes/:id/teaching-assignments', async ({ params, request }) => {
    const auth = authz(request, 'I06', 'write');
    if (auth.res) return auth.res;
    const body = (await request.json()) as { subjectId?: string; teacherId?: string | null };
    if (!body.subjectId || body.teacherId === undefined)
      return err(400, 'VALIDATION_ERROR', 'יש לבחור מקצוע ולשלוח מורה או ללא שיוך');
    const classExists = mockTeachingClasses.some((schoolClass) => schoolClass.id === params.id);
    const subjectExists = mockSubjects.some((subject) => subject.id === body.subjectId);
    const teacherExists =
      body.teacherId === null || mockTeachingTeachers.some((teacher) => teacher.id === body.teacherId);
    if (!classExists || !subjectExists || !teacherExists)
      return err(404, 'ASSIGNMENT_REFERENCE_NOT_FOUND', 'הכיתה, המקצוע או המורה לא נמצאו');
    const existingIndex = mockAssignments.findIndex(
      (item) => item.classId === params.id && item.subjectId === body.subjectId,
    );
    if (body.teacherId === null) {
      if (existingIndex >= 0) mockAssignments.splice(existingIndex, 1);
    } else {
      const assignment = {
        classId: String(params.id),
        subjectId: body.subjectId!,
        teacherId: body.teacherId,
      };
      if (existingIndex >= 0) mockAssignments[existingIndex] = assignment;
      else mockAssignments.push(assignment);
    }
    return new HttpResponse(null, { status: 204 });
  }),

  ...sharedHandlers,
];