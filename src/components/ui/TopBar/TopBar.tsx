import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../../styles/recipes';
import { IconButton } from '../IconButton/IconButton';

export type TopBarVariant = 'desktop' | 'mobile';

export type TopBarProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  variant?: TopBarVariant;
  /** At the start (on the right in RTL): the brand, or the module and the screen name. */
  title?: ReactNode;
  /** The global search (desktop only): a SearchField with scope="global", or a link to S09. */
  search?: ReactNode;
  /** At the end (on the left in RTL): notifications and the account. */
  actions?: ReactNode;
  /** Mobile: opens the side menu. The menu button is shown only when this is given. */
  onMenuClick?: () => void;
};

/** The bar at the top of the app frame (screen X01): 64 high on desktop, 56 on mobile. */
export const TopBar = forwardRef<HTMLElement, TopBarProps>(function TopBar(
  { variant = 'desktop', title, search, actions, onMenuClick, className, ...rest },
  ref,
) {
  const mobile = variant === 'mobile';
  return (
    <header
      ref={ref}
      className={cx(
        'flex items-center border-b border-line bg-surface',
        mobile ? 'h-14 gap-2 px-4' : 'h-16 gap-4 px-6',
        className,
      )}
      {...rest}
    >
      {mobile && onMenuClick && <IconButton icon="menu" label="תפריט" onClick={onMenuClick} />}
      <div className="min-w-0 flex-1">{title}</div>
      {!mobile && search}
      {actions && (
        <div className={cx('flex items-center', mobile ? 'gap-1' : 'gap-2')}>{actions}</div>
      )}
    </header>
  );
});
