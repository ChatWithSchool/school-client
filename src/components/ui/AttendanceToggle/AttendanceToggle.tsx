import * as RadixRadio from '@radix-ui/react-radio-group';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from '../../../styles/recipes';
import { Icon } from '../../Icon';
import { ATTENDANCE } from '../internal/attendance';

/** Figma `Value`: none = not marked yet. */
export type AttendanceValue = 'present' | 'absent' | 'late' | 'none';
export type AttendanceToggleSize = 'M' | 'L';
/** Figma `State` (focus is the keyboard focus itself). */
export type AttendanceToggleState = 'default' | 'saving' | 'error';

export type AttendanceToggleProps = Omit<
  ComponentPropsWithoutRef<typeof RadixRadio.Root>,
  'value' | 'defaultValue' | 'onValueChange' | 'orientation' | 'dir' | 'children'
> & {
  /** Names the group: the student's name. */
  label: string;
  value: AttendanceValue;
  onValueChange: (value: Exclude<AttendanceValue, 'none'>) => void;
  /** M = 40 high; L = 48, the touch target for a tablet in class. */
  size?: AttendanceToggleSize;
  /** saving: the choice is being sent; error: it was not saved (the message is `errorText`). */
  state?: AttendanceToggleState;
  errorText?: string;
};

/** The order of the segments: present first, at the start (on the right in RTL). */
const OPTIONS = ['present', 'absent', 'late'] as const;

const SIZE: Record<AttendanceToggleSize, string> = { M: 'h-10 px-3', L: 'h-12 px-4' };

/**
 * The quick attendance switch of screen N01: one radio per status, each with color, sign and
 * word. The arrow keys move between them (mirrored in RTL) and choose.
 */
export const AttendanceToggle = forwardRef<HTMLDivElement, AttendanceToggleProps>(
  function AttendanceToggle(
    {
      label,
      value,
      onValueChange,
      size = 'M',
      state = 'default',
      errorText = 'השמירה נכשלה',
      disabled,
      className,
      ...rest
    },
    ref,
  ) {
    const saving = state === 'saving';
    const error = state === 'error';
    return (
      <div className={cx('inline-flex items-center gap-2', className)}>
        <RadixRadio.Root
          ref={ref}
          aria-label={label}
          aria-busy={saving || undefined}
          aria-invalid={error || undefined}
          orientation="horizontal"
          loop
          value={value === 'none' ? '' : value}
          onValueChange={(v) => onValueChange(v as Exclude<AttendanceValue, 'none'>)}
          disabled={disabled}
          className={cx(
            'inline-flex overflow-hidden rounded-md border bg-surface',
            error ? 'border-danger-600' : 'border-line',
            saving && 'opacity-60',
          )}
          {...rest}
        >
          {OPTIONS.map((key, i) => {
            const a = ATTENDANCE[key];
            const on = value === key;
            return (
              <RadixRadio.Item
                key={key}
                value={key}
                className={cx(
                  'flex items-center gap-1.5 text-body-strong',
                  SIZE[size],
                  i > 0 && 'border-s border-line',
                  'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-primary-500/35',
                  'disabled:cursor-not-allowed',
                  on ? a.tone : 'text-fg-secondary hover:bg-subtle',
                )}
              >
                <Icon name={a.icon} size={16} className={on ? undefined : 'text-fg-muted'} />
                {a.label}
              </RadixRadio.Item>
            );
          })}
        </RadixRadio.Root>
        {saving && (
          <Icon
            name="loader-circle"
            size={16}
            label="שומר"
            className="animate-spin text-fg-muted"
          />
        )}
        {error && (
          <Icon name="circle-alert" size={16} label={errorText} className="text-danger-700" />
        )}
      </div>
    );
  },
);
