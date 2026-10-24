import * as RadixRadio from '@radix-ui/react-radio-group';
import { forwardRef, useId, type ComponentPropsWithoutRef } from 'react';
import { cx } from '../../../styles/recipes';
import { focusRing } from '../internal/styles';

export type RadioOption = { value: string; label: string; disabled?: boolean };

export type RadioGroupProps = Omit<
  ComponentPropsWithoutRef<typeof RadixRadio.Root>,
  'orientation' | 'children' | 'dir'
> & {
  /** The question the group answers. It names the radiogroup. */
  label: string;
  options: RadioOption[];
  orientation?: 'vertical' | 'horizontal';
};

/**
 * A group of radio buttons (Radix). Tab enters the group, the arrow keys move between the options
 * (in RTL: the right arrow goes to the previous option).
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  { label, options, orientation = 'vertical', disabled, className, ...rest },
  ref,
) {
  const labelId = useId();
  return (
    <div className={className}>
      <p id={labelId} className="mb-2 text-label text-fg-secondary">
        {label}
      </p>
      <RadixRadio.Root
        ref={ref}
        aria-labelledby={labelId}
        orientation={orientation}
        disabled={disabled}
        className={cx('flex', orientation === 'vertical' ? 'flex-col gap-2' : 'flex-wrap gap-6')}
        {...rest}
      >
        {options.map((o) => {
          const off = disabled || o.disabled;
          return (
            <label
              key={o.value}
              className={cx(
                'inline-flex items-center gap-2 text-body',
                off ? 'cursor-not-allowed text-fg-muted' : 'cursor-pointer text-fg',
              )}
            >
              <RadixRadio.Item
                value={o.value}
                disabled={o.disabled}
                className={cx(
                  'flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border bg-surface data-[state=checked]:border-2',
                  focusRing,
                  off
                    ? 'border-line bg-subtle data-[state=checked]:border-ink-300'
                    : 'border-line-strong hover:border-primary-500 data-[state=checked]:border-primary-600',
                )}
              >
                <RadixRadio.Indicator
                  className={cx('h-2 w-2 rounded-full', off ? 'bg-ink-300' : 'bg-primary-600')}
                />
              </RadixRadio.Item>
              {o.label}
            </label>
          );
        })}
      </RadixRadio.Root>
    </div>
  );
});
