import type { ReactNode } from 'react';
import { Icon } from './Icon';
import { Alert, Button, EmptyState as UiEmptyState, Skeleton } from './ui';

/**
 * The shared screen states (spec screen X02). Every list and form must use them. They are built
 * from components/ui (Skeleton, EmptyState, Alert, Button) and keep their old props.
 */
export function LoadingSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div role="status" aria-label="טוען" className="space-y-3">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} shape="line" style={{ width: `${95 - i * 12}%` }} />
      ))}
    </div>
  );
}

/** The first-use EmptyState of components/ui. Without `text`, only the title is shown. */
export function EmptyState({
  title,
  text,
  action,
}: {
  title: string;
  text?: string;
  action?: ReactNode;
}) {
  return <UiEmptyState variant="first-use" title={title} text={text ?? ''} action={action} />;
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <Alert tone="danger">
      <div className="flex items-center justify-between gap-4">
        <span>{message}</span>
        {onRetry && (
          <Button variant="secondary" onClick={onRetry}>
            נסי שוב
          </Button>
        )}
      </div>
    </Alert>
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
