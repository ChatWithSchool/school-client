import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../../styles/recipes';
import { Icon, type IconName } from '../../Icon';

export type EmptyStateVariant = 'first-use' | 'no-results' | 'error';

export type EmptyStateProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  variant?: EmptyStateVariant;
  /** Defaults to the sentence of the variant. */
  title?: string;
  /** Defaults to the sentence of the variant; an empty string hides it. */
  text?: string;
  /** A Button: add the first item, clear the filter, or try again. */
  action?: ReactNode;
};

const VARIANT: Record<
  EmptyStateVariant,
  { icon: IconName; circle: string; title: string; text: string }
> = {
  'first-use': {
    icon: 'layers',
    circle: 'bg-primary-50 text-primary-600',
    title: 'עוד לא נוספו פריטים',
    text: 'אפשר להוסיף פריט ראשון.',
  },
  'no-results': {
    icon: 'search',
    circle: 'bg-primary-50 text-primary-600',
    title: 'לא נמצאו תוצאות',
    text: 'נסו לשנות את הסינון.',
  },
  error: {
    icon: 'circle-alert',
    circle: 'bg-danger-50 text-danger-700',
    title: 'לא הצלחנו לטעון',
    text: 'הנתונים לא אבדו. נסי שוב.',
  },
};

/**
 * What a list shows when it has nothing to show: before the first item, after a filter with no
 * results, or when loading failed (that one is announced with `role="alert"`).
 */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { variant = 'first-use', title, text, action, className, ...rest },
  ref,
) {
  const v = VARIANT[variant];
  return (
    <div
      ref={ref}
      role={variant === 'error' ? 'alert' : undefined}
      className={cx(
        'flex flex-col items-center gap-3 rounded-lg border border-dashed border-line bg-surface px-6 py-12 text-center',
        className,
      )}
      {...rest}
    >
      <span className={cx('flex h-16 w-16 items-center justify-center rounded-full', v.circle)}>
        <Icon name={v.icon} size={28} />
      </span>
      <p className="text-body-strong text-fg">{title ?? v.title}</p>
      {(text ?? v.text) && <p className="text-body text-fg-secondary">{text ?? v.text}</p>}
      {action}
    </div>
  );
});
