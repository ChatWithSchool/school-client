import { cx } from '../styles/recipes';
import { ICONS, MIRRORED, type IconName } from './icons';

export type { IconName } from './icons';

/**
 * A Lucide icon: 20px, stroke 1.75, the color of the text next to it. Decorative by default
 * (aria-hidden). Pass `label` when the icon carries meaning on its own.
 */
export function Icon({
  name,
  size = 20,
  label,
  className,
}: {
  name: IconName;
  size?: number;
  /** Accessible name. Without it the icon is hidden from screen readers. */
  label?: string;
  className?: string;
}) {
  const Svg = ICONS[name];
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true as const };
  return (
    <Svg
      size={size}
      strokeWidth={1.75}
      className={cx('shrink-0', MIRRORED.has(name) && 'rtl:-scale-x-100', className)}
      {...a11y}
    />
  );
}
