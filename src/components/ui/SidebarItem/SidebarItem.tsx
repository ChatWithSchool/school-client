import { forwardRef } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cx } from '../../../styles/recipes';
import { Icon, type IconName } from '../../Icon';
import { Badge } from '../Badge/Badge';
import { focusRing } from '../internal/styles';

export type SidebarItemProps = Omit<LinkProps, 'children'> & {
  icon: IconName;
  label: string;
  /** Figma `State: active`: the module of the current screen. Also sets `aria-current="page"`. */
  active?: boolean;
  /** Figma `State: collapsed`: the icon only (the label stays for screen readers). */
  collapsed?: boolean;
  /** Figma `Badge: on`: a count of new items. Collapsed, it becomes a dot. */
  badge?: number;
};

/** One link of the side menu (screen X01). */
export const SidebarItem = forwardRef<HTMLAnchorElement, SidebarItemProps>(function SidebarItem(
  { icon, label, active = false, collapsed = false, badge, className, ...rest },
  ref,
) {
  const hasBadge = badge !== undefined && badge > 0;
  return (
    <Link
      ref={ref}
      aria-current={active ? 'page' : undefined}
      className={cx(
        'relative flex h-10 items-center rounded-md',
        focusRing,
        collapsed ? 'w-10 justify-center' : 'gap-3 px-3',
        active
          ? 'bg-primary-50 text-body-strong text-primary-700'
          : 'text-body text-fg hover:bg-subtle',
        className,
      )}
      {...rest}
    >
      <Icon name={icon} className={active ? 'text-primary-600' : 'text-fg-secondary'} />
      {collapsed ? (
        <>
          <span className="sr-only">{label}</span>
          {hasBadge && (
            <>
              <span
                aria-hidden="true"
                className="absolute end-1.5 top-1.5 h-2 w-2 rounded-full bg-accent-400"
              />
              <span className="sr-only">{`, ${badge} חדשים`}</span>
            </>
          )}
        </>
      ) : (
        <>
          <span className="min-w-0 flex-1 truncate">{label}</span>
          {hasBadge && (
            <Badge tone="primary" size="S">
              <span className="num">{badge}</span>
              <span className="sr-only"> חדשים</span>
            </Badge>
          )}
        </>
      )}
    </Link>
  );
});
