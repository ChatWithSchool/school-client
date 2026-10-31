export type AvailableTeacher = {
  id: string;
  name: string;
  subjects: string;
  hoursThatDay: number;
};

export type UncoveredLesson = {
  id: string;
  lessonNumber: number;
  className: string;
  subject: string;
  absentTeacher: string;
};

export const DAY_OPTIONS = [
  { value: 'all', label: 'הכול' },
  { value: 'sun', label: 'ראשון' },
  { value: 'mon', label: 'שני' },
  { value: 'tue', label: 'שלישי' },
  { value: 'wed', label: 'רביעי' },
  { value: 'thu', label: 'חמישי' },
];

export const SLOT_OPTIONS = [
  { value: 'all', label: 'הכול' },
  { value: '1', label: 'שיעור 1 (08:00)' },
  { value: '2', label: 'שיעור 2 (08:50)' },
  { value: '3', label: 'שיעור 3 (09:50)' },
  { value: '4', label: 'שיעור 4 (10:40)' },
];

export const MOCK_TEACHERS: AvailableTeacher[] = [
  { id: 't1', name: 'דנה כהן', subjects: 'מתמטיקה, פיזיקה', hoursThatDay: 3 },
  { id: 't2', name: 'רות לוי', subjects: 'אנגלית', hoursThatDay: 2 },
  { id: 't3', name: 'מיכל אברהם', subjects: 'תנ"ך, היסטוריה', hoursThatDay: 4 },
];

export const MOCK_UNCOVERED: UncoveredLesson[] = [
  { id: 'l1', lessonNumber: 3, className: 'ז׳1', subject: 'מתמטיקה', absentTeacher: 'שרה גולד' },
  { id: 'l2', lessonNumber: 5, className: 'ח׳2', subject: 'אנגלית', absentTeacher: 'שרה גולד' },
];