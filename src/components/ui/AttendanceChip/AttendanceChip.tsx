import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../../styles/recipes';
import { Icon } from '../../Icon';
import { ATTENDANCE, type AttendanceStatus } from '../internal/attendance';

export type { AttendanceStatus } from '../internal/attendance';

export type AttendanceChipProps = HTMLAttributes<HTMLSpanElement> & {
  status: AttendanceStatus;
  size?: 'S' | 'M';
  /** Replaces the default word, for example to add the minutes of a late arrival. */
  label?: string;
};

/** The attendance status of a student: always color, sign and word together. */
export const AttendanceChip = forwardRef<HTMLSpanElement, AttendanceChipProps>(
  function AttendanceChip({ status, size = 'M', label, className, ...rest }, ref) {
    const s = ATTENDANCE[status];
    return (
      <span
        ref={ref}
        className={cx(
          'inline-flex items-center whitespace-nowrap rounded-full',
          s.tone,
          // both sizes use the label text (13/18), as in the Figma library; S is only lower
          'gap-1 px-2 text-label',
          size === 'S' ? 'h-5' : 'h-6',
          className,
        )}
        {...rest}
      >
        <Icon name={s.icon} size={size === 'S' ? 12 : 14} />
        {label ?? s.label}
      </span>
    );
  },
);
