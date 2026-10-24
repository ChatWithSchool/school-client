import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cx } from '../../../styles/recipes';
import { Icon, type IconName } from '../../Icon';
import { focusRing, focusRingDanger } from '../internal/styles';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'S' | 'M' | 'L';

/** Figma `Icon`: where the icon sits. `iconName` is the icon itself (the instance swap in Figma). */
type ButtonIcon =
  | { icon?: 'none'; iconName?: never }
  | { icon: 'leading' | 'trailing'; iconName: IconName }
  | { icon: 'icon-only'; iconName: IconName; 'aria-label': string };

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> &
  ButtonIcon & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    /** Shows a spinner and blocks clicks (`disabled` and `aria-busy`) until the action ends. */
    loading?: boolean;
    'aria-label'?: string;
  };

const VARIANT: Record<ButtonVariant, string> = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
  secondary:
    'border border-line bg-surface text-fg hover:border-line-strong hover:bg-subtle active:bg-ink-200',
  ghost: 'bg-transparent text-primary-700 hover:bg-primary-50 active:bg-primary-100',
  danger: 'bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-700',
};

const SIZE: Record<ButtonSize, { box: string; square: string; icon: number }> = {
  S: { box: 'h-8 gap-1.5 px-3 text-label font-semibold', square: 'h-8 w-8', icon: 16 },
  M: { box: 'h-10 gap-2 px-4 text-body-strong', square: 'h-10 w-10', icon: 20 },
  L: { box: 'h-12 gap-2 px-5 text-body-lg font-semibold', square: 'h-12 w-12', icon: 20 },
};

const DISABLED = 'cursor-not-allowed border-transparent bg-ink-200 text-ink-500';

/**
 * The button of the design guide. One primary button per screen; `danger` for delete actions.
 * `loading` keeps the color of the variant (it is not a disabled look) and shows a spinner.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'M',
    icon = 'none',
    iconName,
    loading = false,
    disabled,
    type = 'button',
    className,
    children,
    ...rest
  },
  ref,
) {
  const s = SIZE[size];
  const iconOnly = icon === 'icon-only';
  const glyph = loading ? (
    <Icon name="loader-circle" size={s.icon} className="animate-spin" />
  ) : iconName ? (
    <Icon name={iconName} size={s.icon} />
  ) : null;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(
        'inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-md',
        variant === 'danger' ? focusRingDanger : focusRing,
        iconOnly ? s.square : s.box,
        disabled && !loading ? DISABLED : VARIANT[variant],
        loading && 'cursor-wait',
        className,
      )}
      {...rest}
    >
      {(icon === 'leading' || iconOnly || (loading && icon === 'none')) && glyph}
      {!iconOnly && children}
      {icon === 'trailing' && glyph}
    </button>
  );
});
