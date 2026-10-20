import type { Level } from '../api/types';
import type { IconName } from '../components/Icon';

export type SidebarItem = { key: string; label: string; icon: IconName; screens: string[] };

/**
 * Sidebar entries. The entry screen is the first screen in the list that the user may open.
 * The events calendar (I07) is viewable by everyone but is not an entry point of 'settings':
 * otherwise every teacher would see a 'settings' item that holds only the calendar.
 */
export const SIDEBAR: SidebarItem[] = [
  { key: 'dashboard', label: 'דשבורד', icon: 'home', screens: ['X03'] },
  {
    key: 'students',
    label: 'תלמידים',
    icon: 'users',
    screens: ['S01', 'S02', 'S03', 'S05', 'S06', 'S07', 'S09', 'S10'],
  },
  { key: 'classes', label: 'כיתות וקבוצות', icon: 'layers', screens: ['S04', 'S08'] },
  {
    key: 'schedule',
    label: 'מערכת שעות',
    icon: 'calendar',
    screens: ['T06', 'T01', 'T02', 'T03', 'T04'],
  },
  {
    key: 'attendance',
    label: 'נוכחות',
    icon: 'attendance',
    screens: ['N01', 'N02', 'N03', 'N04', 'N05', 'N06'],
  },
  {
    key: 'grades',
    label: 'ציונים',
    icon: 'award',
    screens: ['G01', 'G02', 'G03', 'G04', 'G05', 'G06', 'G07', 'G08'],
  },
  { key: 'staff', label: 'צוות', icon: 'briefcase', screens: ['I04', 'I05'] },
  {
    key: 'settings',
    label: 'הגדרות',
    icon: 'settings',
    screens: ['I03', 'I01', 'I06', 'I08', 'A04', 'A07', 'A08', 'A09'],
  },
];

const FAMILY_OF: Record<string, string> = {
  I03: 'settings',
  A04: 'settings',
  A07: 'settings',
  A08: 'settings',
  A09: 'settings',
  I01: 'settings',
  I06: 'settings',
  I07: 'settings',
  I08: 'settings',
  A05: 'account',
  A06: 'account',
  I02: 'staff',
  I04: 'staff',
  I05: 'staff',
};
const LETTER_FAMILY: Record<string, string> = {
  X: 'dashboard',
  S: 'students',
  T: 'schedule',
  N: 'attendance',
  G: 'grades',
};

export function familyOf(screenId: string): string | null {
  return FAMILY_OF[screenId] ?? LETTER_FAMILY[screenId[0]] ?? null;
}

/** Which sidebar item is highlighted for a screen (the account screens highlight none). */
export function sidebarKeyOf(screenId: string): string | null {
  const f = familyOf(screenId);
  if (f === 'students' && (screenId === 'S04' || screenId === 'S08')) return 'classes';
  return f === 'account' ? null : f;
}

export type SubItem = { label: string; screen: string };

/** The sub navigation under the top bar: one per module. */
export const SUBNAV: Record<string, SubItem[]> = {
  settings: [
    { label: 'מוסד', screen: 'I03' },
    { label: 'משתמשים', screen: 'A04' },
    { label: 'הזמנות', screen: 'A07' },
    { label: 'תפקידים ופרטיות', screen: 'A09' },
    { label: 'מקצועות ושיוך', screen: 'I06' },
    { label: 'יומן', screen: 'I07' },
    { label: 'חדרים', screen: 'I08' },
  ],
  account: [
    { label: 'ההרשאות שלי', screen: 'A05' },
    { label: 'אבטחת חשבון', screen: 'A06' },
  ],
  students: [
    { label: 'תלמידים', screen: 'S01' },
    { label: 'כיתות וקבוצות', screen: 'S04' },
    { label: 'ייבוא', screen: 'S05' },
    { label: 'פעולות קבוצתיות', screen: 'S10' },
    { label: 'חיפוש', screen: 'S09' },
  ],
  schedule: [
    { label: 'מערכת שבועית', screen: 'T01' },
    { label: 'עריכה', screen: 'T02' },
    { label: 'ממלא מקום', screen: 'T03' },
    { label: 'ייבוא וייצוא', screen: 'T04' },
    { label: 'היום שלי', screen: 'T06' },
  ],
  attendance: [
    { label: 'סימון נוכחות', screen: 'N01' },
    { label: 'היסטוריית תלמיד', screen: 'N02' },
    { label: 'דוח חודשי', screen: 'N03' },
    { label: 'התראות', screen: 'N04' },
    { label: 'אישורים', screen: 'N05' },
    { label: 'דשבורד מוסדי', screen: 'N06' },
  ],
  grades: [
    { label: 'ציונים', screen: 'G01' },
    { label: 'גיליון תלמיד', screen: 'G02' },
    { label: 'היסטוריה', screen: 'G03' },
    { label: 'מבחנים', screen: 'G04' },
    { label: 'סטטיסטיקות', screen: 'G05' },
    { label: 'משקלים', screen: 'G06' },
    { label: 'תעודות', screen: 'G07' },
    { label: 'המקצועות שלי', screen: 'G08' },
  ],
};
/** Screens reached from another screen: the tab of the parent stays highlighted. */
export const SUBACTIVE: Record<string, string> = {
  A08: 'A07',
  I01: 'I03',
  S02: 'S01',
  S03: 'S01',
  S06: 'S01',
  S07: 'S01',
  S08: 'S04',
};

/** Sidebar items the user may see, each with the screen it opens. */
export function visibleSidebar(
  permissions: Record<string, Level>,
): (SidebarItem & { entry: string })[] {
  const out: (SidebarItem & { entry: string })[] = [];
  for (const item of SIDEBAR) {
    const entry = item.screens.find((id) => permissions[id]);
    if (entry) out.push({ ...item, entry });
  }
  return out;
}

export function visibleSubnav(
  family: string | null,
  permissions: Record<string, Level>,
): SubItem[] {
  return family && SUBNAV[family] ? SUBNAV[family].filter((s) => permissions[s.screen]) : [];
}
