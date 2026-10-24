import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cx } from '../../../styles/recipes';
import { Icon } from '../../Icon';

/** Figma `State` (default, hover and focus are the interaction). */
export type GradeCellState = 'empty' | 'filled' | 'error' | 'saving' | 'saved';

export type GradeCellProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'aria-label'> & {
  /** Names the cell: the student and the assessment ("ציון של Lorem במבחן 1"). */
  label: string;
  /** Defaults to empty or filled by the value. */
  state?: GradeCellState;
  /** The error message (a grade out of range). It describes the cell for screen readers. */
  error?: string;
};

/**
 * One cell of the grades entry table (screen G01): a number input with tabular digits, and the
 * saving, saved and error signs inside it.
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
  const current = value ?? defaultValue;
  const s: GradeCellState =
    state ?? (error ? 'error' : current === undefined || current === '' ? 'empty' : 'filled');
  const invalid = s === 'error';
  const words = { saving: 'שומר', saved: 'נשמר', error: error ?? 'ציון לא תקין' } as const;
  const word = s === 'saving' || s === 'saved' || s === 'error' ? words[s] : undefined;
  return (
    <div
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
          'num w-full min-w-0 bg-transparent text-center text-mono-num placeholder:text-fg-muted focus:outline-none',
          invalid ? 'text-danger-700' : s === 'saving' ? 'text-fg-muted' : 'text-fg',
        )}
        {...rest}
      />
      {word && (
        <span id={msgId} className="sr-only">
          {word}
        </span>
      )}
    </div>
  );
});
