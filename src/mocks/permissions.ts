import matrix from '../permissions/matrix.json';

type Level = 'full' | 'scoped' | 'read';
type Entry = { access: Record<string, Level> };
const screens = matrix.screens as unknown as Record<string, Entry>;
const ORDER: Record<Level, number> = { read: 1, scoped: 2, full: 3 };

/** Same rules as the server (school-server/src/permissions), only for the mock data. */
export function permissionsFor(roles: string[]): Record<string, Level> {
  const out: Record<string, Level> = {};
  for (const [id, entry] of Object.entries(screens)) {
    let best: Level | null = null;
    for (const r of roles) {
      const l = entry.access[r];
      if (l && (!best || ORDER[l] > ORDER[best])) best = l;
    }
    if (best) out[id] = best;
  }
  return out;
}

export function landingFor(roles: string[]): string {
  const order: [string, string][] = [
    ['management', 'X03'],
    ['secretary', 'S01'],
    ['homeroom', 'T06'],
    ['teacher', 'T06'],
    ['parent', 'S03'],
    ['student', 'G02'],
  ];
  for (const [role, screen] of order) if (roles.includes(role)) return screen;
  return 'X02';
}
