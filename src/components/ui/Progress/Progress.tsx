import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../../styles/recipes';

export type ProgressTone = 'primary' | 'success';

export type ProgressProps = HTMLAttributes<HTMLDivElement> & {
  /** 0 to 100. */
  value: number;
  /** Names the bar for screen readers ("העלאת הקובץ"). */
  label: string;
  tone?: ProgressTone;
};

const TONE: Record<ProgressTone, string> = { primary: 'bg-primary-600', success: 'bg-success-500' };

/** A progress bar for wizards and uploads. It fills from the start: from the right in RTL. */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value, label, tone = 'primary', className, ...rest },
  ref,
) {
  const pct = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <div
      ref={ref}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className={cx('flex h-2 w-full overflow-hidden rounded-full bg-subtle', className)}
      {...rest}
    >
      <div
        className={cx('h-full rounded-full transition-all', TONE[tone])}
        // eslint-disable-next-line local/no-inline-style -- the width is the value itself, set at run time
        style={{ width: `${pct}%` }}
      />
    </div>
  );
});
