/**
 * Mock data for S06 (sprint 1 - client only).
 * When the server is ready (sprint 4) replace this file with RTK Query hooks:
 *   GET  /students/{id}/notes   -> BehaviorNote[]
 *   POST /students/{id}/notes   -> { id }
 */

export type NoteKind = 'positive' | 'discipline' | 'other';

export type BehaviorNote = {
  id: string;
  /** yyyy-MM-dd */
  date: string;
  kind: NoteKind;
  severity: string;
  authorName: string;
  visibleToParent: boolean;
  description: string;
};

export const KIND_LABEL: Record<NoteKind, string> = {
  positive: 'חיובי',
  discipline: 'משמעת',
  other: 'אחר',
};

const NOTES: Record<string, BehaviorNote[]> = {
  'st-1': [
    {
      id: 'n-1',
      date: '2026-10-16',
      kind: 'positive',
      severity: '',
      authorName: 'עמית כהן',
      visibleToParent: true,
      description: 'השתתף באופן פעיל בדיון הכיתתי.',
    },
    {
      id: 'n-2',
      date: '2026-10-14',
      kind: 'discipline',
      severity: 'בינונית',
      authorName: 'מור דהן',
      visibleToParent: false,
      description: 'אי-קיום כללי הכיתה במהלך השיעור.',
    },
    {
      id: 'n-3',
      date: '2026-10-09',
      kind: 'positive',
      severity: '',
      authorName: 'אופיר שפירא',
      visibleToParent: true,
      description: 'עזר לחבר לכיתה שהתקשה בשיעור.',
    },
  ],
  'st-2': [],
};

export const notesFor = (studentId: string): BehaviorNote[] => [...(NOTES[studentId] ?? [])];

/** 2026-10-16 -> 16.10 */
export const shortDate = (iso: string): string => `${iso.slice(8, 10)}.${iso.slice(5, 7)}`;

export const todayIso = (): string => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};
