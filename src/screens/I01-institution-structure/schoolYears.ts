export type SchoolYearOption = { value: string; label: string };

const TENS = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
const UNITS = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
const HUNDREDS = ['', 'ק', 'ר', 'ש'];

/** 787 -> תשפ"ז (המספר ללא אלפים) */
export function toHebrewNumeral(n: number): string {
  let rest = n;
  let out = '';

  while (rest >= 400) {
    out += 'ת';
    rest -= 400;
  }

  out += HUNDREDS[Math.floor(rest / 100)];
  rest %= 100;

  if (rest === 15) out += 'טו';
  else if (rest === 16) out += 'טז';
  else out += TENS[Math.floor(rest / 10)] + UNITS[rest % 10];

  return out.length > 1 ? `${out.slice(0, -1)}"${out.slice(-1)}` : `${out}'`;
}

/** השנה העברית (למשל 5787) לפי התאריך שנתון. */
export function getHebrewYear(date: Date): number {
  const text = new Intl.DateTimeFormat('en-u-ca-hebrew', { year: 'numeric' }).format(date);
  return parseInt(text, 10);
}

export function schoolYearOption(hebrewYear: number): SchoolYearOption {
  return { value: String(hebrewYear), label: toHebrewNumeral(hebrewYear % 1000) };
}

/** השנה הנוכחית והשנה הבאה. הראשונה היא ברירת המחדל. */
export function getSchoolYearOptions(now: Date = new Date()): SchoolYearOption[] {
  const current = getHebrewYear(now);
  return [schoolYearOption(current), schoolYearOption(current + 1)];
}
