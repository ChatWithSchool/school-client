import { forwardRef, useId, useState, type InputHTMLAttributes } from 'react';
import { cx } from '../../../styles/recipes';
import { Icon } from '../../Icon';
import { Tooltip } from '../Tooltip/Tooltip';

/** Figma `State` (default, hover and focus are the interaction). */
export type GradeCellState = 'empty' | 'filled' | 'error' | 'saving' | 'saved';

export type GradeCellProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'aria-label'> & {
  /** Names the cell: the student and the assessment ("ציון של Lorem במבחן 1"). */
  label: string;
  /** Defaults to empty or filled by the value. */
  state?: GradeCellState;
  /**
   * The error message (a grade out of range). It describes the cell for screen readers, and a
   * tooltip on the error sign shows it while the cell has focus or the sign is hovered.
   */
  error?: string;
};

/**
 * One cell of the grades entry table (screen G01): a number input with tabular digits, and the
 * saving, saved and error signs inside it. Saving and saved are announced politely. Needs the
 * TooltipProvider (mounted in App.tsx).
 */
export const GradeCell = forwardRef<HTMLInputElement, GradeCellProps>(function GradeCell(
  {
    label,
    state,
    error,
    value,
    defaultValue,
    className,
    placeholder = '—',
    'aria-describedby': describedBy,
    ...rest
  },
  ref,
) {
  const msgId = useId();
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const current = value ?? defaultValue;
  const s: GradeCellState =
    state ?? (error ? 'error' : current === undefined || current === '' ? 'empty' : 'filled');
  const invalid = s === 'error';
  const words = { saving: 'שומר', saved: 'נשמר', error: error ?? 'ציון לא תקין' } as const;
  const word = s === 'saving' || s === 'saved' || s === 'error' ? words[s] : undefined;
  return (
    <div
      // focus events bubble in React: the cell knows when its input has focus
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={cx(
        'flex h-10 w-grade-cell items-center justify-center gap-1 rounded-sm border px-2',
        'focus-within:border-2 focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-500/20',
        invalid ? 'border-danger-600 bg-danger-50' : 'border-line bg-surface hover:bg-primary-50',
        className,
      )}
    >
      {s === 'saving' && (
        <Icon name="loader-circle" size={14} className="animate-spin text-fg-muted" />
      )}
      {s === 'saved' && <Icon name="check" size={14} className="text-success-500" />}
      {invalid && (
        // the sign appears beside the input, so the input is not remounted and keeps focus
        <Tooltip content={words.error} open={focused || hovered} onOpenChange={setHovered}>
          <span className="flex shrink-0 text-danger-700">
            <Icon name="circle-alert" size={14} />
          </span>
        </Tooltip>
      )}
      <input
        ref={ref}
        inputMode="decimal"
        aria-label={label}
        aria-invalid={invalid || undefined}
        aria-describedby={[describedBy, word && msgId].filter(Boolean).join(' ') || undefined}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={cx(
          // the cell shows the focus ring; the input has none of its own
          'num w-full min-w-0 bg-transparent text-center text-mono-num placeholder:text-fg-muted focus:outline-none focus-visible:ring-0',
          invalid ? 'text-danger-700' : s === 'saving' ? 'text-fg-muted' : 'text-fg',
        )}
        {...rest}
      />
      {/* always mounted, so a change of the word is announced (saving, then saved) */}
      <span id={msgId} aria-live="polite" className="sr-only">
        {word}
      </span>
    </div>
  );
});
