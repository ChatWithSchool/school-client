import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../../styles/recipes';
import { Icon } from '../../Icon';

export type StepState = 'done' | 'current' | 'upcoming';

export type StepperProps = Omit<HTMLAttributes<HTMLOListElement>, 'children'> & {
  /** Figma `Steps: 3-5`: the names of the steps. */
  steps: string[];
  /** Figma `Current: 1-5`: the current step, from 1. */
  current: number;
};

const WORD: Record<StepState, string> = { done: 'הושלם', current: 'שלב נוכחי', upcoming: 'בהמשך' };

/**
 * The steps of a wizard (screens I01, I02, S05, A03). The first step is at the start (on the right
 * in RTL). A done step has a check, the current one is outlined (`aria-current="step"`).
 */
export const Stepper = forwardRef<HTMLOListElement, StepperProps>(function Stepper(
  { steps, current, className, 'aria-label': ariaLabel = 'שלבים', ...rest },
  ref,
) {
  return (
    <ol
      ref={ref}
      aria-label={ariaLabel}
      className={cx('flex items-start gap-2', className)}
      {...rest}
    >
      {steps.map((name, i) => {
        const n = i + 1;
        const state: StepState = n < current ? 'done' : n === current ? 'current' : 'upcoming';
        return (
          // the connector sits in the step before it, so the list has one item per step
          <li
            key={`${n}-${name}`}
            aria-current={state === 'current' ? 'step' : undefined}
            className="flex items-start gap-2"
          >
            <span className="flex flex-col items-center gap-1">
              <span
                className={cx(
                  'flex h-7 w-7 items-center justify-center rounded-full',
                  state === 'done' && 'bg-primary-600 text-white',
                  state === 'current' && 'border-2 border-primary-600 bg-surface text-primary-600',
                  state === 'upcoming' && 'border border-line bg-surface text-fg-muted',
                )}
              >
                {state === 'done' ? (
                  <Icon name="check" size={16} />
                ) : (
                  <span className="num text-body-strong">{n}</span>
                )}
              </span>
              <span
                className={cx(
                  'text-caption',
                  state === 'current' ? 'text-fg' : 'text-fg-secondary',
                )}
              >
                {name}
                <span className="sr-only">{`, ${WORD[state]}`}</span>
              </span>
            </span>
            {n < steps.length && (
              <span
                aria-hidden="true"
                className={cx(
                  'mt-3.5 h-0.5 w-8 shrink-0',
                  n < current ? 'bg-primary-600' : 'bg-line',
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
});
