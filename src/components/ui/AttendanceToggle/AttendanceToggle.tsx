import * as RadixRadio from '@radix-ui/react-radio-group';
import { forwardRef, useId, useRef, type ComponentPropsWithoutRef } from 'react';
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
  /**
   * saving: the choice is being sent; error: it was not saved (the message is `errorText`).
   * While saving the toggle stays usable, so the teacher can correct a choice at once. The screen
   * must handle responses that arrive out of order: send only the latest value (cancel or ignore
   * the earlier request), so an older response never overwrites a newer choice.
   */
  state?: AttendanceToggleState;
  /** The visible error text of the error state (announced, and describes the group). */
  errorText?: string;
};

/** The order of the segments: present first, at the start (on the right in RTL). */
const OPTIONS = ['present', 'absent', 'late'] as const;

const ARROWS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

const SIZE: Record<AttendanceToggleSize, string> = { M: 'h-10 px-3', L: 'h-12 px-4' };

/**
 * The quick attendance switch of screen N01: one radio per status, each with color, sign and
 * word. The arrow keys only move the focus between them (mirrored in RTL); Space or Enter
 * chooses. Unlike a plain radio group, moving with the arrows does not save each status on the
 * way, since every choice is sent to the server at once.
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
      'aria-describedby': describedBy,
      onKeyDown,
      onKeyUp,
      ...rest
    },
    ref,
  ) {
    const errorId = useId();
    // true while an arrow key is down: Radix then clicks the item it focuses, and we cancel that
    const arrowing = useRef(false);
    const saving = state === 'saving';
    const error = state === 'error';
    return (
      <div className={cx('inline-flex items-center gap-2', className)}>
        <RadixRadio.Root
          ref={ref}
          aria-label={label}
          aria-busy={saving || undefined}
          aria-invalid={error || undefined}
          aria-describedby={[describedBy, error && errorId].filter(Boolean).join(' ') || undefined}
          orientation="horizontal"
          loop
          value={value === 'none' ? '' : value}
          onValueChange={(v) => onValueChange(v as Exclude<AttendanceValue, 'none'>)}
          disabled={disabled}
          onKeyDown={(e) => {
            if (ARROWS.includes(e.key)) arrowing.current = true;
            onKeyDown?.(e);
          }}
          onKeyUp={(e) => {
            arrowing.current = false;
            onKeyUp?.(e);
          }}
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
                // Radix checks the item that the arrow keys focus (a click); the arrows only move
                onClick={(e) => {
                  if (arrowing.current) e.preventDefault();
                }}
                // Radix ignores Enter on a radio; here it chooses, as Space does
                onKeyDown={(e) => {
                  if (e.key === 'Enter') e.currentTarget.click();
                }}
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
          <p
            id={errorId}
            role="alert"
            className="flex items-center gap-1 text-caption text-danger-700"
          >
            <Icon name="circle-alert" size={16} />
            {errorText}
          </p>
        )}
      </div>
    );
  },
);
