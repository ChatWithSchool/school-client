import * as RadixSwitch from '@radix-ui/react-switch';
import { forwardRef, useId, type ComponentPropsWithoutRef } from 'react';
import { cx } from '../../../styles/recipes';
import { focusRing } from '../internal/styles';

export type SwitchProps = Omit<ComponentPropsWithoutRef<typeof RadixSwitch.Root>, 'children'> & {
  /** The setting it turns on or off. Without it, pass `aria-label`. */
  label?: string;
};

/**
 * An on/off switch for settings (Radix). Figma `On: off, on` is `checked`. The thumb moves to the
 * end side when on: to the left in RTL.
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { label, id, className, disabled, ...rest },
  ref,
) {
  const auto = useId();
  const switchId = id ?? auto;
  return (
    <div className={cx('inline-flex items-center gap-3', className)}>
      <RadixSwitch.Root
        ref={ref}
        id={switchId}
        disabled={disabled}
        className={cx(
          'inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5',
          focusRing,
          disabled
            ? 'cursor-not-allowed bg-ink-200 data-[state=checked]:bg-primary-200'
            : 'bg-ink-300 hover:bg-ink-400 data-[state=checked]:bg-primary-600 data-[state=checked]:hover:bg-primary-700',
        )}
        {...rest}
      >
        <RadixSwitch.Thumb className="block h-4 w-4 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-4 rtl:data-[state=checked]:-translate-x-4" />
      </RadixSwitch.Root>
      {label && (
        <label
          htmlFor={switchId}
          className={cx('text-body', disabled ? 'text-fg-muted' : 'cursor-pointer text-fg')}
        >
          {label}
        </label>
      )}
    </div>
  );
});
