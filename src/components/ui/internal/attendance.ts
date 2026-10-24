import type { IconName } from '../../Icon';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused' | 'unreported';

/** Color, sign and word of each attendance status (design guide: attendance statuses). */
export const ATTENDANCE: Record<AttendanceStatus, { label: string; icon: IconName; tone: string }> =
  {
    present: { label: 'נוכח', icon: 'check', tone: 'bg-success-50 text-success-700' },
    absent: { label: 'נעדר', icon: 'x', tone: 'bg-danger-50 text-danger-700' },
    late: { label: 'איחור', icon: 'clock', tone: 'bg-warning-50 text-warning-700' },
    excused: { label: 'מאושר', icon: 'shield-check', tone: 'bg-info-50 text-info-700' },
    unreported: { label: 'לא דווח', icon: 'minus', tone: 'bg-subtle text-fg-secondary' },
  };
