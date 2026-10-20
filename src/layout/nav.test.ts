import type { Level } from '../api/types';
import { permissionsFor } from '../mocks/permissions';
import { familyOf, sidebarKeyOf, visibleSidebar, visibleSubnav } from './nav';

const labels = (p: Record<string, Level>) => visibleSidebar(p).map((i) => i.label);

describe('navigation by permissions', () => {
  it('shows every module to management', () => {
    expect(labels(permissionsFor(['management']))).toEqual([
      'דשבורד',
      'תלמידים',
      'כיתות וקבוצות',
      'מערכת שעות',
      'נוכחות',
      'ציונים',
      'צוות',
      'הגדרות',
    ]);
  });
  it('hides settings and staff from a teacher, and opens the schedule on "my day"', () => {
    const p = permissionsFor(['teacher']);
    const l = labels(p);
    expect(l).not.toContain('הגדרות');
    expect(l).not.toContain('דשבורד');
    expect(visibleSidebar(p).find((i) => i.key === 'schedule')?.entry).toBe('T06');
  });
  it('gives a parent only the child, attendance and grades screens', () => {
    const p = permissionsFor(['parent']);
    expect(Object.keys(p).filter((id) => ['A04', 'I03', 'S01'].includes(id))).toEqual([]);
    expect(p.S03).toBe('scoped');
  });
});

describe('modules and sub navigation', () => {
  it('puts users and permissions inside the settings module', () => {
    expect(familyOf('A04')).toBe('settings');
    expect(familyOf('A09')).toBe('settings');
    expect(familyOf('I03')).toBe('settings');
    expect(visibleSubnav('settings', permissionsFor(['management'])).map((s) => s.screen)).toEqual([
      'I03',
      'A04',
      'A07',
      'A09',
      'I06',
      'I07',
      'I08',
    ]);
  });
  it('keeps the account screens out of the sidebar highlight', () => {
    expect(sidebarKeyOf('A05')).toBeNull();
    expect(sidebarKeyOf('S08')).toBe('classes');
    expect(sidebarKeyOf('I04')).toBe('staff');
  });
});
