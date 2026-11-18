import { http, HttpResponse } from 'msw';
import type { Announcement } from '../api/types';
import { assessmentHandlers } from './assessments';
import {
  DEMO_PASSWORD,
  USERS,
  addAnnouncement,
  announcements,
  removeUncoveredLesson,
  t03AvailableTeachers,
  t03UncoveredLessons,
} from './data';
import { authz, err, userOf } from './http';
import { landingFor, permissionsFor } from './permissions';
import { joinInviteHandlers } from './joinInvite';
import { sharedHandlers } from './shared/handlers';
import { teachingHandlers } from './teaching';

/**
 * Mock API. Add handlers for your endpoints so your screen works before the server is ready.
 *
 * The GET handlers for the shared collections (rooms, events, lessons, teaching assignments,
 * invites, assessments, grades, student tags, attendance and attendance alerts) already exist in
 * ./shared/handlers.ts. Do not add them again here: add only the write handlers (POST, PUT,
 * PATCH, DELETE) of your own screen, and change the data in ./shared so the GET handlers see it.
 */
const MOCK_INSTITUTION = {
  id: 'inst-1',
  name: 'בית ספר לדוגמה',
  type: 'mixed',
  address: 'רחוב הדוגמה 1, תל אביב',
  phone: '03-1234567',
  contactEmail: 'office@school.example',
  activeYearId: 'y2026',
};

const MOCK_TERMS = [
  { id: 't1', name: "מחצית א'", startDate: '2026-09-01', endDate: '2027-01-31', status: 'closed' },
  { id: 't2', name: "מחצית ב'", startDate: '2027-02-01', endDate: '2027-06-30', status: 'open' },
];

export const handlers = [
  ...joinInviteHandlers,
  http.get('*/api/institutions/:id', ({ request }) => {
    const user = userOf(request);
    if (!user) return err(401, 'UNAUTHENTICATED', 'נדרשת התחברות');
    return HttpResponse.json(MOCK_INSTITUTION);
  }),

  http.get('*/api/terms', ({ request }) => {
    const user = userOf(request);
    if (!user) return err(401, 'UNAUTHENTICATED', 'נדרשת התחברות');
    return HttpResponse.json({ items: MOCK_TERMS });
  }),
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

  http.get('*/api/staff/available', ({ request }) => {
    const a = authz(request, 'T03', 'read');
    if (a.res) return a.res;
    return HttpResponse.json({ items: t03AvailableTeachers });
  }),
  // T02 owns GET /lessons. This handler answers only for the T03 list (uncovered=true);
  // returning nothing passes every other request on to the shared handler.
  http.get('*/api/lessons', ({ request }) => {
    if (new URL(request.url).searchParams.get('uncovered') !== 'true') return;
    const a = authz(request, 'T03', 'read');
    if (a.res) return a.res;
    return HttpResponse.json({ items: t03UncoveredLessons });
  }),

  http.post('*/api/lessons/:id/substitute', async ({ params, request }) => {
    const a = authz(request, 'T03', 'write');
    if (a.res) return a.res;
    const body = (await request.json()) as { date?: string; substituteTeacherId?: string };
    const details: { field: string; message: string }[] = [];
    if (!body.date || !/^\d{4}-\d{2}-\d{2}$/.test(body.date))
      details.push({ field: 'date', message: 'תאריך בפורמט YYYY-MM-DD' });
    if (!body.substituteTeacherId)
      details.push({ field: 'substituteTeacherId', message: 'חובה לבחור ממלא מקום' });
    if (details.length) return err(400, 'VALIDATION_ERROR', 'הנתונים שנשלחו אינם תקינים', details);
    const lesson = t03UncoveredLessons.find((l) => l.id === params.id);
    if (!lesson) return err(404, 'NOT_FOUND', 'השיעור לא נמצא או שכבר שובץ לו ממלא מקום');
    removeUncoveredLesson(lesson.id);
    // the shape of LessonSubstitution in openapi.yaml
    return HttpResponse.json({
      id: `sub-${lesson.id}`,
      lessonId: lesson.id,
      date: body.date,
      absentTeacherId: lesson.absentTeacher,
      substituteTeacherId: body.substituteTeacherId,
      assignedBy: userOf(request)?.email ?? '',
    });
  }),

  ...sharedHandlers,
  ...teachingHandlers,
  ...assessmentHandlers,
];
