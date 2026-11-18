import { http, HttpResponse } from 'msw';
import type { Invite, RoleKey } from '../api/types';
import type { AcceptInviteBody, InvitePreview } from '../api/joinInviteApi';
import { missingInPassword } from '../screens/A02-join-invite/password';
import { USERS } from './data';
import { err } from './http';
import { landingFor } from './permissions';
import { STAFF_ID, shared } from './shared';

// A02 handlers. Demo links: /join/demo-teacher, /join/demo-parent (valid), /join/demo-expired.
const DEMO: Record<string, [string, RoleKey]> = {
  'demo-teacher': ['new.teacher@school.example', 'teacher'],
  'demo-parent': ['new.parent@school.example', 'parent'],
};

/** The seed invites have passed their date, so a valid demo invite is added when first used. */
function inviteOf(token: string): Invite | undefined {
  if (token === 'demo-expired') return shared.invites.find((i) => i.id === 'inv-4');
  const id = `inv-${token}`;
  if (DEMO[token] && !shared.invites.some((i) => i.id === id)) {
    const [email, role] = DEMO[token];
    const now = Date.now();
    shared.invites.push({
      ...{ id, email, role, status: 'pending', invitedBy: STAFF_ID.management },
      createdAt: new Date(now).toISOString(),
      expiresAt: new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }
  return shared.invites.find((i) => i.id === id);
}

const statusOf = (i: Invite): InvitePreview['status'] => {
  if (i.status === 'accepted') return 'used';
  return i.status === 'pending' && Date.parse(i.expiresAt) > Date.now() ? 'valid' : 'expired';
};

export const joinInviteHandlers = [
  http.get('*/api/invites/:token', ({ params }) => {
    const invite = inviteOf(String(params.token));
    if (!invite) return err(404, 'NOT_FOUND', 'ההזמנה לא נמצאה');
    const { role, email } = invite;
    const institutionName = 'בית הספר לדוגמה';
    return HttpResponse.json({ institutionName, role, email, status: statusOf(invite) });
  }),

  // creates the user, uses up the link and signs in (the mock token is mock.<email>)
  http.post('*/api/invites/:token/accept', async ({ params, request }) => {
    const invite = inviteOf(String(params.token));
    if (!invite) return err(404, 'NOT_FOUND', 'ההזמנה לא נמצאה');
    if (statusOf(invite) !== 'valid')
      return err(409, 'INVITE_NOT_VALID', 'קישור ההזמנה פג תוקף או שכבר נעשה בו שימוש');
    const body = (await request.json()) as AcceptInviteBody;
    const { firstName, lastName } = body;
    const missing = missingInPassword(body.password ?? '');
    if (!firstName?.trim() || !lastName?.trim() || missing.length)
      return err(400, 'VALIDATION_ERROR', `הנתונים אינם תקינים. ${missing.join(', ')}`);
    USERS[invite.email] = { firstName, lastName, roles: [invite.role] };
    invite.status = 'accepted';
    return HttpResponse.json({ token: `mock.${invite.email}`, landing: landingFor([invite.role]) });
  }),
];
