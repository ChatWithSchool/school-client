import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../../styles/recipes';
import { Icon, type IconName } from '../../Icon';

export type BadgeTone =
  'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'accent';
export type BadgeSize = 'S' | 'M';

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
  size?: BadgeSize;
  /** An icon before the text. The status tones have one by default, so color is never alone. */
  icon?: IconName;
};

const TONE: Record<BadgeTone, string> = {
  neutral: 'bg-subtle text-fg-secondary',
  primary: 'bg-primary-50 text-primary-700',
  success: 'bg-success-50 text-success-700',
  warning: 'bg-warning-50 text-warning-700',
  danger: 'bg-danger-50 text-danger-700',
  info: 'bg-info-50 text-info-700',
  accent: 'bg-accent-100 text-accent-700',
};

/** The status tones carry a sign as well as a color (design guide: color, sign and word). */
const STATUS_ICON: Partial<Record<BadgeTone, IconName>> = {
  success: 'circle-check',
  warning: 'triangle-alert',
  danger: 'circle-x',
  info: 'info',
};

const SIZE: Record<BadgeSize, { box: string; icon: number }> = {
  S: { box: 'h-5 gap-1 px-2 text-label', icon: 12 },
  M: { box: 'h-6 gap-1 px-3 text-label', icon: 14 },
};

/** A short label for a status or a category (the badge recipe in recipes.ts, with sizes). */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = 'neutral', size = 'M', icon, className, children, ...rest },
  ref,
) {
  const glyph = icon ?? STATUS_ICON[tone];
  return (
    <span
      ref={ref}
      className={cx(
        'inline-flex items-center whitespace-nowrap rounded-full',
        TONE[tone],
        SIZE[size].box,
        className,
      )}
      {...rest}
    >
      {glyph && <Icon name={glyph} size={SIZE[size].icon} />}
      {children}
    </span>
  );
});
