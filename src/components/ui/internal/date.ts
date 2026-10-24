/** Small date helpers for the DatePicker. Dates are local days; the time is ignored. */

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const addDays = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/** The same day of another month, clamped to the month's last day (31 Jan + 1 = 28/29 Feb). */
export function addMonths(d: Date, n: number) {
  const last = new Date(d.getFullYear(), d.getMonth() + n + 1, 0).getDate();
  return new Date(d.getFullYear(), d.getMonth() + n, Math.min(d.getDate(), last));
}

export const sameDay = (a: Date | null | undefined, b: Date | null | undefined) =>
  !!a && !!b && startOfDay(a).getTime() === startOfDay(b).getTime();

/** The weeks of a month, Sunday first, with null for the days outside it. */
export function monthGrid(month: Date): (Date | null)[][] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = Array.from({ length: first.getDay() }, () => null);
  for (let i = 1; i <= days; i++) cells.push(new Date(month.getFullYear(), month.getMonth(), i));
  while (cells.length % 7) cells.push(null);
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** dd/mm/yyyy, the format of the design guide. */
export const formatDate = (d: Date) =>
  `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;

/** "ינואר 2026": the title of the month grid. */
export const formatMonth = (d: Date) =>
  new Intl.DateTimeFormat('he', { month: 'long', year: 'numeric' }).format(d);

/** The full date, for the accessible name of a day: "יום ראשון, 4 בינואר 2026". */
export const formatLong = (d: Date) =>
  new Intl.DateTimeFormat('he', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);

/** The short names of the days, Sunday first. */
export const WEEKDAYS = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
