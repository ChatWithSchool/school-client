import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../../styles/recipes';
import { Icon, type IconName } from '../../Icon';
import { IconButton } from '../IconButton/IconButton';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

export type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  tone?: AlertTone;
  title?: ReactNode;
  /** Figma `Dismissible: on`: shows a close button. Give `onDismiss` to hide the alert. */
  dismissible?: boolean;
  onDismiss?: () => void;
};

/** The sign and the word of each tone: the icon is named, so color is never the only signal. */
const TONE: Record<AlertTone, { box: string; icon: IconName; word: string }> = {
  info: { box: 'border-info-100 bg-info-50 text-info-700', icon: 'info', word: 'מידע' },
  success: {
    box: 'border-success-100 bg-success-50 text-success-700',
    icon: 'circle-check',
    word: 'הצלחה',
  },
  warning: {
    box: 'border-warning-100 bg-warning-50 text-warning-700',
    icon: 'triangle-alert',
    word: 'אזהרה',
  },
  danger: {
    box: 'border-danger-100 bg-danger-50 text-danger-700',
    icon: 'circle-alert',
    word: 'שגיאה',
  },
};

/**
 * A message on the page (the alert recipe). Only `danger` is announced at once (`role="alert"`);
 * the other tones are a polite `status`.
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { tone = 'info', title, dismissible = false, onDismiss, className, children, ...rest },
  ref,
) {
  const t = TONE[tone];
  return (
    <div
      ref={ref}
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cx(
        'flex items-start gap-3 rounded-lg border px-4 py-3 text-body',
        t.box,
        className,
      )}
      {...rest}
    >
      <Icon name={t.icon} label={t.word} className="mt-0.5" />
      <div className="min-w-0 flex-1">
        {title && <p className="text-body-strong">{title}</p>}
        {children}
      </div>
      {dismissible && (
        <IconButton
          icon="x"
          label="סגירה"
          size="S"
          onClick={onDismiss}
          className="-my-1 -me-2 text-current hover:bg-white/60 hover:text-current"
        />
      )}
    </div>
  );
});
