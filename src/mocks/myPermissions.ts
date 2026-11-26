import { http, HttpResponse } from 'msw';
import matrix from '../permissions/matrix.json';
import { err, userOf } from './http';
import { permissionsFor } from './permissions';

type ScreenInfo = { name: string; module: string };
const screenInfo = matrix.screens as unknown as Record<string, ScreenInfo>;

/** A05 · ההרשאות שלי: GET /me/permissions */
export const myPermissionsHandlers = [
  http.get('*/api/me/permissions', ({ request }) => {
    const u = userOf(request);
    if (!u) return err(401, 'UNAUTHENTICATED', 'נדרשת התחברות');

    // התפקיד הראשי: הראשון ברשימת התפקידים של המטריצה שהמשתמש שייך אליו
    const role = matrix.roles.find((r) => u.roles.includes(r.key));
    if (!role) return err(403, 'FORBIDDEN', 'אין הרשאה');

    const screens = Object.entries(permissionsFor(u.roles)).map(([screenId, level]) => ({
      screenId,
      name: screenInfo[screenId]?.name ?? screenId,
      module: screenInfo[screenId]?.module ?? '',
      level,
    }));

    return HttpResponse.json({
      role: role.key,
      roleName: role.name,
      scope: { classIds: [], studentIds: [] },
      screens,
    });
  }),
];