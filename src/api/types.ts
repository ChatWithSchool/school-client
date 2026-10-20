export type Level = 'full' | 'scoped' | 'read';
export type Page<T> = { items: T[]; total: number; page: number; size: number };

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
