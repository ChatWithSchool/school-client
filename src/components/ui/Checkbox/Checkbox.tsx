import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { forwardRef, useId, type ComponentPropsWithoutRef } from 'react';
import { cx } from '../../../styles/recipes';
import { Icon } from '../../Icon';
import { focusRing } from '../internal/styles';

/** Figma `Checked`: off = false, on = true, mixed = 'mixed' (some rows of a table are selected). */
export type CheckedState = boolean | 'mixed';

export type CheckboxProps = Omit<
  ComponentPropsWithoutRef<typeof RadixCheckbox.Root>,
  'checked' | 'defaultChecked' | 'onCheckedChange' | 'children'
> & {
  checked?: CheckedState;
  defaultChecked?: CheckedState;
  onCheckedChange?: (checked: CheckedState) => void;
  /** The visible label. Without it, pass `aria-label` (for example in a table row). */
  label?: string;
};

const toRadix = (v: CheckedState | undefined) => (v === 'mixed' ? 'indeterminate' : v);

/** A checkbox (Radix) with an optional label on its side. Space toggles it. */
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  { checked, defaultChecked, onCheckedChange, label, id, className, disabled, ...rest },
  ref,
) {
  const auto = useId();
  const boxId = id ?? auto;
  return (
    <div className={cx('inline-flex items-center gap-2', className)}>
      <RadixCheckbox.Root
        ref={ref}
        id={boxId}
        checked={toRadix(checked)}
        defaultChecked={toRadix(defaultChecked)}
        onCheckedChange={(v) => onCheckedChange?.(v === 'indeterminate' ? 'mixed' : v)}
        disabled={disabled}
        className={cx(
          'group flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-sm border bg-surface',
          focusRing,
          disabled
            ? 'cursor-not-allowed border-line bg-subtle data-[state=checked]:bg-ink-300 data-[state=indeterminate]:bg-ink-300'
            : cx(
                'border-line-strong hover:border-primary-500',
                'data-[state=checked]:border-primary-600 data-[state=checked]:bg-primary-600 data-[state=checked]:hover:border-primary-700 data-[state=checked]:hover:bg-primary-700',
                'data-[state=indeterminate]:border-primary-600 data-[state=indeterminate]:bg-primary-600 data-[state=indeterminate]:hover:border-primary-700 data-[state=indeterminate]:hover:bg-primary-700',
              ),
        )}
        {...rest}
      >
        <RadixCheckbox.Indicator className="text-white">
          <Icon name="check" size={14} className="group-data-[state=indeterminate]:hidden" />
          <Icon name="minus" size={14} className="hidden group-data-[state=indeterminate]:block" />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      {label && (
        <label
          htmlFor={boxId}
          className={cx('text-body', disabled ? 'text-fg-muted' : 'text-fg cursor-pointer')}
        >
          {label}
        </label>
      )}
    </div>
  );
});
