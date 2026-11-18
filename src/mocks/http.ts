import { HttpResponse } from 'msw';
import { USERS } from './data';
import { permissionsFor } from './permissions';

/** An error response in the contract shape: { error: { code, message, details? } }. */
export const err = (
  status: number,
  code: string,
  message: string,
  details?: { field: string; message: string }[],
) => HttpResponse.json({ error: { code, message, details } }, { status });

export function userOf(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '') ?? '';
  const email = token.startsWith('mock.') ? token.slice(5) : '';
  return USERS[email] ? { email, ...USERS[email] } : null;
}

/** Same rule as the server: 401 without a user, 403 without access, 403 READ_ONLY when writing with a read level. */
export function authz(request: Request, screen: string, action: 'read' | 'write') {
  const user = userOf(request);
  if (!user) return { res: err(401, 'UNAUTHENTICATED', 'נדרשת התחברות') };
  const level = permissionsFor(user.roles)[screen];
  if (!level) return { res: err(403, 'FORBIDDEN', 'אין הרשאה לפעולה זו') };
  if (action === 'write' && level === 'read')
    return { res: err(403, 'READ_ONLY', 'יש הרשאת צפייה בלבד') };
  return { user };
}
