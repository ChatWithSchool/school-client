import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cx } from '../../../styles/recipes';
import { Icon, type IconName } from '../../Icon';
import { focusRing } from '../internal/styles';

export type IconButtonVariant = 'ghost' | 'secondary';
export type IconButtonSize = 'S' | 'M';

export type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label' | 'children'
> & {
  icon: IconName;
  /** Required: a button with only an icon must say what it does (it becomes the aria-label). */
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
};

const VARIANT: Record<IconButtonVariant, string> = {
  ghost:
    'text-fg-secondary hover:bg-primary-50 hover:text-primary-700 active:bg-primary-100 active:text-primary-700',
  secondary:
    'border border-line bg-surface text-fg hover:border-line-strong hover:bg-subtle active:bg-ink-200',
};

const SIZE: Record<IconButtonSize, { box: string; icon: number }> = {
  S: { box: 'h-8 w-8', icon: 16 },
  M: { box: 'h-10 w-10', icon: 20 },
};

/** A square button with an icon only, for table rows and headers. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, label, variant = 'ghost', size = 'M', type = 'button', disabled, className, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      disabled={disabled}
      className={cx(
        'inline-flex shrink-0 items-center justify-center rounded-md',
        focusRing,
        SIZE[size].box,
        disabled ? 'cursor-not-allowed border-transparent text-ink-400' : VARIANT[variant],
        disabled && variant === 'secondary' && 'border border-line bg-subtle',
        className,
      )}
      {...rest}
    >
      <Icon name={icon} size={SIZE[size].icon} />
    </button>
  );
});
