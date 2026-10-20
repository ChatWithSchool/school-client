import { http, HttpResponse } from 'msw';
import type { Announcement } from '../api/types';
import { DEMO_PASSWORD, USERS, addAnnouncement, announcements } from './data';
import { landingFor, permissionsFor } from './permissions';

const err = (
  status: number,
  code: string,
  message: string,
  details?: { field: string; message: string }[],
) => HttpResponse.json({ error: { code, message, details } }, { status });

function userOf(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '') ?? '';
  const email = token.startsWith('mock.') ? token.slice(5) : '';
  return USERS[email] ? { email, ...USERS[email] } : null;
}

/** Same rule as the server: 401 without a user, 403 without access, 403 READ_ONLY when writing with a read level. */
function authz(request: Request, screen: string, action: 'read' | 'write') {
  const user = userOf(request);
  if (!user) return { res: err(401, 'UNAUTHENTICATED', 'נדרשת התחברות') };
  const level = permissionsFor(user.roles)[screen];
  if (!level) return { res: err(403, 'FORBIDDEN', 'אין הרשאה לפעולה זו') };
  if (action === 'write' && level === 'read')
    return { res: err(403, 'READ_ONLY', 'יש הרשאת צפייה בלבד') };
  return { user };
}

/** Mock API. Add handlers for your endpoints so your screen works before the server is ready. */
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
];
