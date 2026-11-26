import { http, HttpResponse } from 'msw';
import type { Invite, RoleKey } from '../api/types';
import { authz, err } from './http';
import { shared } from './shared';

// A07 write handlers (GET /invites is in ./shared/handlers.ts)
const ROLES: RoleKey[] = ['homeroom', 'teacher', 'parent', 'secretary', 'coordinator'];
const WEEK = 7 * 24 * 60 * 60 * 1000;
let nextId = 100;

/** The mock mail service (v1): no email goes out, the content is returned for the invites log. */
const mailOf = ({ email, expiresAt, message }: Invite) => ({
  to: email,
  subject: 'הזמנה להצטרף למערכת בית הספר',
  body: `שלום,\nהוזמנת להצטרף למערכת בית הספר.\n${message ? `${message}\n` : ''}להשלמת ההרשמה: ${location.origin}/join/${Math.random().toString(36).slice(2)}\nהקישור חד-פעמי ותקף עד ${new Date(expiresAt).toLocaleDateString('he-IL')}.`,
  sentAt: new Date().toISOString(),
});

export const inviteHandlers = [
  http.post('*/api/invites', async ({ request }) => {
    const a = authz(request, 'A07', 'write');
    if (a.res) return a.res;
    const body = (await request.json()) as { email?: string; role?: RoleKey; message?: string };
    const email = body.email?.trim().toLowerCase() ?? '';
    if (!/^\S+@\S+\.\S+$/.test(email) || !ROLES.includes(body.role!))
      return err(400, 'VALIDATION_ERROR', 'יש להזין כתובת אימייל תקינה ותפקיד');
    if (shared.invites.some((i) => i.status === 'pending' && i.email === email))
      return err(409, 'DUPLICATE_INVITE', `כבר קיימת הזמנה ממתינה לכתובת ${email}.`);
    const invite: Invite = {
      id: `inv-${nextId++}`,
      email,
      role: body.role!,
      status: 'pending',
      invitedBy: a.user!.email,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + WEEK).toISOString(),
      ...(body.message?.trim() ? { message: body.message.trim() } : {}),
    };
    shared.invites.unshift(invite);
    return HttpResponse.json({ id: invite.id, mail: mailOf(invite) }, { status: 201 });
  }),

  // a new link (the old one is no longer valid) and a new expiry period
  http.post('*/api/invites/:id/resend', ({ params, request }) => {
    const a = authz(request, 'A07', 'write');
    if (a.res) return a.res;
    const invite = shared.invites.find((i) => i.id === params.id && i.status === 'pending');
    if (!invite) return err(404, 'NOT_FOUND', 'ההזמנה לא נמצאה');
    invite.createdAt = new Date().toISOString();
    invite.expiresAt = new Date(Date.now() + WEEK).toISOString();
    return HttpResponse.json({ id: invite.id, mail: mailOf(invite) });
  }),

  http.delete('*/api/invites/:id', ({ params, request }) => {
    const a = authz(request, 'A07', 'write');
    if (a.res) return a.res;
    const invite = shared.invites.find((i) => i.id === params.id);
    if (!invite) return err(404, 'NOT_FOUND', 'ההזמנה לא נמצאה');
    invite.status = 'revoked';
    return new HttpResponse(null, { status: 204 });
  }),
];
