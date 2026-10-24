import { useDirection } from '@radix-ui/react-direction';
import * as Popover from '@radix-ui/react-popover';
import { forwardRef, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { cx } from '../../../styles/recipes';
import { Icon } from '../../Icon';
import { IconButton } from '../IconButton/IconButton';
import {
  WEEKDAYS,
  addDays,
  addMonths,
  formatDate,
  formatLong,
  formatMonth,
  monthGrid,
  sameDay,
  startOfDay,
} from '../internal/date';
import { FieldLabel, FieldMessage } from '../internal/FieldParts';
import { fieldBox, focusRing } from '../internal/styles';
import { useField } from '../internal/useField';

export type DateRange = { from: Date | null; to: Date | null };

type CommonProps = {
  label: string;
  hint?: string;
  /** The error message. It also sets `aria-invalid` (Figma `State: error`). */
  error?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  className?: string;
  /** Figma `State: open`: open from the start (stories). */
  defaultOpen?: boolean;
};

/** Figma `Mode: single`: one day. */
export type SingleDatePickerProps = CommonProps & {
  mode?: 'single';
  value: Date | null;
  onChange: (value: Date | null) => void;
};

/** Figma `Mode: range`: a first and a last day (the second click closes the calendar). */
export type RangeDatePickerProps = CommonProps & {
  mode: 'range';
  value: DateRange;
  onChange: (value: DateRange) => void;
};

export type DatePickerProps = SingleDatePickerProps | RangeDatePickerProps;

const display = (p: DatePickerProps) => {
  if (p.mode === 'range') {
    const { from, to } = p.value;
    return from ? `${formatDate(from)} – ${to ? formatDate(to) : ''}` : '';
  }
  return p.value ? formatDate(p.value) : '';
};

/**
 * A date field: a button with the chosen date that opens a month grid (Radix Popover). In the
 * grid the arrow keys move by day and week (mirrored in RTL), PageUp/PageDown by month, Enter
 * picks, Escape closes.
 */
export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(
  function DatePicker(props, ref) {
    const { label, hint, error, disabled, required, id, className, defaultOpen } = props;
    const f = useField({ id, hint, error });
    const labelId = useId();
    const valueId = useId();
    const [open, setOpen] = useState(defaultOpen ?? false);
    const text = display(props);
    const placeholder = props.mode === 'range' ? 'dd/mm/yyyy – dd/mm/yyyy' : 'dd/mm/yyyy';

    const pick = (day: Date) => {
      if (props.mode === 'range') {
        const { from, to } = props.value;
        if (!from || to) props.onChange({ from: day, to: null });
        else {
          // the second click closes the range, in either order
          const [a, b] = day < from ? [day, from] : [from, day];
          props.onChange({ from: a, to: b });
          setOpen(false);
        }
      } else {
        props.onChange(day);
        setOpen(false);
      }
    };

    const anchor =
      props.mode === 'range' ? (props.value.from ?? new Date()) : (props.value ?? new Date());

    return (
      <div className={className}>
        <FieldLabel id={labelId} htmlFor={f.fieldId} required={required}>
          {label}
        </FieldLabel>
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger
            ref={ref}
            disabled={disabled}
            {...f.inputProps}
            aria-labelledby={`${labelId} ${valueId}`}
            className={cx(
              fieldBox.base,
              'h-10 text-start',
              focusRing,
              disabled
                ? fieldBox.disabled
                : error
                  ? fieldBox.error
                  : cx(fieldBox.normal, 'data-[state=open]:border-primary-500'),
            )}
          >
            <span
              id={valueId}
              className={cx('num min-w-0 flex-1 truncate text-start', !text && 'text-fg-muted')}
            >
              {text || placeholder}
            </span>
            <Icon name="calendar" size={16} className="text-fg-secondary" />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              sideOffset={4}
              align="start"
              aria-label="בחירת תאריך"
              // the grid focuses its own day
              onOpenAutoFocus={(e) => e.preventDefault()}
              className="z-50 rounded-lg border border-line bg-surface p-3 shadow-md focus:outline-none"
            >
              <Calendar
                anchor={anchor}
                isSelected={(d) =>
                  props.mode === 'range'
                    ? sameDay(d, props.value.from) || sameDay(d, props.value.to)
                    : sameDay(d, props.value)
                }
                inRange={(d) =>
                  props.mode === 'range' && !!props.value.from && !!props.value.to
                    ? d > props.value.from && d < props.value.to
                    : false
                }
                onPick={pick}
              />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
        <FieldMessage hintId={f.hintId} hint={hint} errorId={f.errorId} error={error} />
      </div>
    );
  },
);

/** The month grid. One day is in the tab order (roving focus); it gets focus on open. */
function Calendar({
  anchor,
  isSelected,
  inRange,
  onPick,
}: {
  anchor: Date;
  isSelected: (d: Date) => boolean;
  inRange: (d: Date) => boolean;
  onPick: (d: Date) => void;
}) {
  const rtl = useDirection() === 'rtl';
  const [focused, setFocused] = useState(() => startOfDay(anchor));
  const grid = useRef<HTMLTableElement>(null);
  // focus follows the day on open and on keyboard moves, not after a click on the month buttons
  const moveFocus = useRef(true);
  const today = startOfDay(new Date());

  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    grid.current?.querySelector<HTMLButtonElement>('button[tabindex="0"]')?.focus();
  }, [focused]);

  const keys = (e: KeyboardEvent<HTMLButtonElement>) => {
    const step: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focused, rtl ? 1 : -1),
      ArrowRight: () => addDays(focused, rtl ? -1 : 1),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      PageUp: () => addMonths(focused, -1),
      PageDown: () => addMonths(focused, 1),
      Home: () => addDays(focused, -focused.getDay()),
      End: () => addDays(focused, 6 - focused.getDay()),
    };
    if (step[e.key]) {
      e.preventDefault();
      moveFocus.current = true;
      setFocused(step[e.key]());
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {/* chevron-left is mirrored in RTL: it points to the right, to the previous month */}
        <IconButton
          icon="chevron-left"
          label="החודש הקודם"
          size="S"
          onClick={() => setFocused(addMonths(focused, -1))}
        />
        <p aria-live="polite" className="text-body-strong text-fg">
          {formatMonth(focused)}
        </p>
        <IconButton
          icon="chevron-right"
          label="החודש הבא"
          size="S"
          onClick={() => setFocused(addMonths(focused, 1))}
        />
      </div>
      <table ref={grid} role="grid" aria-label={formatMonth(focused)} className="border-collapse">
        <thead>
          <tr>
            {WEEKDAYS.map((d) => (
              <th key={d} scope="col" className="h-8 w-8 text-caption text-fg-muted">
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {monthGrid(focused).map((week, i) => (
            <tr key={i}>
              {week.map((day, j) => {
                if (!day) return <td key={j} className="h-8 w-8" />;
                const selected = isSelected(day);
                const mid = !selected && inRange(day);
                return (
                  <td key={j} className="p-0">
                    <button
                      type="button"
                      tabIndex={sameDay(day, focused) ? 0 : -1}
                      aria-label={formatLong(day)}
                      aria-pressed={selected}
                      aria-current={sameDay(day, today) ? 'date' : undefined}
                      onClick={() => onPick(day)}
                      onKeyDown={keys}
                      onFocus={() => !sameDay(day, focused) && setFocused(day)}
                      className={cx(
                        'num flex h-8 w-8 items-center justify-center rounded-md text-body',
                        focusRing,
                        selected
                          ? 'bg-primary-600 text-body-strong text-white'
                          : mid
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-fg hover:bg-subtle',
                        sameDay(day, today) && !selected && 'font-semibold text-primary-600',
                      )}
                    >
                      {day.getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
