import type { ReactNode } from 'react';
import { alert, btn, cx } from '../styles/recipes';
import { Icon } from './Icon';

/** The shared screen states (spec screen X02). Every list and form must use them. */
export function LoadingSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div role="status" aria-label="טוען" className="space-y-3">
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          className="h-4 animate-pulse rounded-full bg-subtle"
          style={{ width: `${95 - i * 12}%` }}
        />
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  text,
  action,
}: {
  title: string;
  text?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-line bg-surface px-6 py-12 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-600">
        <Icon name="layers" size={28} />
      </span>
      <p className="text-body-strong text-fg">{title}</p>
      {text && <p className="text-body text-fg-secondary">{text}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className={cx(alert.danger, 'flex items-center justify-between gap-4')}>
      <span>{message}</span>
      {onRetry && (
        <button type="button" className={btn.secondary} onClick={onRetry}>
          נסי שוב
        </button>
      )}
    </div>
  );
}

export function ForbiddenState() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-warning-50 text-warning-700">
        <Icon name="lock" size={28} />
      </span>
      <h1 className="text-h2 text-fg">אין לך הרשאה לצפות בעמוד זה</h1>
      <p className="text-body text-fg-secondary">אם נדרשת גישה, פני למנהל המוסד.</p>
    </div>
  );
}

export function NotFoundState() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
      <h1 className="text-h2 text-fg">העמוד לא נמצא</h1>
      <p className="text-body text-fg-secondary">ייתכן שהכתובת שגויה או שהעמוד הוסר.</p>
    </div>
  );
}
