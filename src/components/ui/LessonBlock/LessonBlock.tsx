import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cx } from '../../../styles/recipes';
import { Icon, type IconName } from '../../Icon';

/** Figma `Tone`: the subject colors of the chart palette. */
export type LessonTone = 'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6';
export type LessonState = 'normal' | 'substitute' | 'cancelled' | 'conflict';

export type LessonBlockProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  subject: string;
  /** The class and the room: "Lorem · 4". */
  meta?: string;
  tone?: LessonTone;
  state?: LessonState;
  /** The block chosen for editing (screen T02): a selection ring. */
  selected?: boolean;
  /** Replaces the word of the state (for example the substitute teacher's name). */
  note?: string;
};

/** Literal classes per tone, so Tailwind keeps them. */
const TONE: Record<LessonTone, string> = {
  c1: 'border-chart-c1 bg-chart-c1/10 hover:bg-chart-c1/20',
  c2: 'border-chart-c2 bg-chart-c2/10 hover:bg-chart-c2/20',
  c3: 'border-chart-c3 bg-chart-c3/10 hover:bg-chart-c3/20',
  c4: 'border-chart-c4 bg-chart-c4/10 hover:bg-chart-c4/20',
  c5: 'border-chart-c5 bg-chart-c5/10 hover:bg-chart-c5/20',
  c6: 'border-chart-c6 bg-chart-c6/10 hover:bg-chart-c6/20',
};

/** The sign, word and color of each state: a state is never shown by color alone. */
const STATE: Partial<Record<LessonState, { icon: IconName; word: string; color: string }>> = {
  substitute: { icon: 'user', word: 'ממלא מקום', color: 'text-warning-700' },
  cancelled: { icon: 'circle-x', word: 'בוטל', color: 'text-fg-secondary' },
  conflict: { icon: 'triangle-alert', word: 'התנגשות', color: 'text-danger-700' },
};

/**
 * A lesson in the timetable (screens T01, T02, T06): the subject color as a bar at the start, the
 * subject and the class and room. A button: it opens or selects the lesson.
 */
export const LessonBlock = forwardRef<HTMLButtonElement, LessonBlockProps>(function LessonBlock(
  {
    subject,
    meta,
    tone = 'c1',
    state = 'normal',
    selected = false,
    note,
    type = 'button',
    className,
    ...rest
  },
  ref,
) {
  const conflict = state === 'conflict';
  const cancelled = state === 'cancelled';
  const st = STATE[state];
  return (
    <button
      ref={ref}
      type={type}
      aria-pressed={selected}
      className={cx(
        'flex min-h-16 w-40 flex-col items-start justify-center overflow-hidden rounded-md border-s-4 px-2 py-1 text-start',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/35',
        TONE[tone],
        conflict && 'outline outline-2 -outline-offset-2 outline-danger-600',
        selected && 'ring-2 ring-inset ring-primary-500',
        cancelled && 'opacity-60',
        className,
      )}
      {...rest}
    >
      <span
        className={cx('max-w-full truncate text-body-strong text-fg', cancelled && 'line-through')}
      >
        {subject}
      </span>
      {meta && <span className="max-w-full truncate text-caption text-fg-secondary">{meta}</span>}
      {st && (
        <span className={cx('flex max-w-full items-center gap-1 text-caption', st.color)}>
          <Icon name={st.icon} size={12} />
          <span className="truncate">{note ?? st.word}</span>
        </span>
      )}
    </button>
  );
});
