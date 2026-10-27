export type Level = 'full' | 'scoped' | 'read';
export type Page<T> = { items: T[]; total: number; page: number; size: number };
/** A list without paging (the *List schemas in the contract). */
export type List<T> = { items: T[] };

export type ApiErrorBody = {
  error: { code: string; message: string; details?: { field: string; message: string }[] };
};

export type Me = {
  user: { id: string; firstName: string; lastName: string; email: string; roles: string[] };
  /** screen id -> access level; a missing screen means no access */
  permissions: Record<string, Level>;
  landing: string;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  audience: 'all' | 'staff';
  pinned: boolean;
  createdAt: string;
  read: boolean;
};

// Shared collections (openapi.yaml components/schemas). Dates without a time are 'YYYY-MM-DD'
// strings, date-times are ISO strings. A field with `?` may be left out of the response. A field
// typed `| null` is always sent, with null when it has no value, so check it with `=== null`.

export type Room = {
  id: string;
  name: string;
  type?: 'classroom' | 'lab' | 'hall';
  capacity?: number;
  notes?: string;
  active: boolean;
};

export type SchoolEvent = {
  id: string;
  title: string;
  type: 'holiday' | 'event' | 'parents_day' | 'vacation';
  startDate: string;
  endDate: string;
  /** grade letters such as 'ח'; empty = the whole institution */
  gradeLevels: string[];
};

export type TeachingAssignment = {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
};

export type Lesson = {
  id: string;
  classId: string;
  groupId: string | null;
  subjectId: string;
  teacherId: string;
  roomId: string | null;
  /** 0 = Sunday ... 5 = Friday */
  dayOfWeek: number;
  /** 1 to 10 */
  period: number;
};

export type RoleKey =
  'management' | 'coordinator' | 'secretary' | 'homeroom' | 'teacher' | 'parent' | 'student';

/** The invite token is never returned: it is only sent in the link. */
export type Invite = {
  id: string;
  email: string;
  role: RoleKey;
  classIds?: string[];
  studentIds?: string[];
  message?: string;
  status: 'pending' | 'accepted' | 'revoked' | 'expired';
  invitedBy: string;
  createdAt: string;
  expiresAt: string;
};

export type Assessment = {
  id: string;
  title: string;
  type: 'exam' | 'quiz' | 'assignment';
  classId: string;
  groupId: string | null;
  subjectId: string;
  teacherId: string;
  termId: string | null;
  date: string | null;
  /** 0 to 100 */
  weight?: number;
  /** how many grades were entered (the column in G04) */
  gradedCount?: number;
};

export type Grade = {
  id: string;
  assessmentId: string;
  studentId: string;
  /** 0 to 100; null = not entered yet (not the same as 0) */
  score: number | null;
  updatedBy?: string;
  updatedAt: string;
};

export type GradeFeedback = {
  id: string;
  gradeId: string;
  studentId: string;
  text: string;
  authorId: string;
  createdAt: string;
};

export type AttendanceRecord = {
  id: string;
  classId: string;
  studentId: string;
  date: string;
  /** null = daily attendance */
  period: number | null;
  status: 'present' | 'absent' | 'late';
  markedBy: string;
  updatedAt?: string;
};

export type AttendanceAlert = {
  id: string;
  studentId: string;
  classId: string;
  type: 'streak' | 'monthly';
  /** the first absence of the case */
  since: string;
  /** 'YYYY-MM' of a monthly alert; null for a streak */
  month: string | null;
  /** how many absences: the length of the streak, or the absences in the month */
  count?: number;
  status: 'open' | 'closed';
  closeNote?: string;
  /** staff id; null while the alert is open */
  closedBy: string | null;
  closedAt: string | null;
};
