import { forwardRef, type HTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import { cx } from '../../../styles/recipes';
import { Icon } from '../../Icon';
import { focusRing } from '../internal/styles';

/** One step of the path. The last item is the current page and has no `to`. */
export type BreadcrumbItem = { label: string; to?: string };

export type BreadcrumbsProps = HTMLAttributes<HTMLElement> & {
  /** Figma `Depth: 2-4`: from the module down to the current page. */
  items: BreadcrumbItem[];
};

/**
 * The path above a screen title. The separator is a chevron that points to the reading direction
 * (to the left in RTL); the last item is the current page (`aria-current="page"`).
 */
export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
  { items, className, 'aria-label': ariaLabel = 'פירורי לחם', ...rest },
  ref,
) {
  return (
    <nav ref={ref} aria-label={ariaLabel} className={className} {...rest}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => {
          const current = i === items.length - 1;
          return (
            <li key={`${i}-${item.label}`} className="flex items-center gap-1">
              {current || !item.to ? (
                <span
                  aria-current={current ? 'page' : undefined}
                  className={cx(
                    current ? 'text-body-strong text-fg' : 'text-body text-fg-secondary',
                  )}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className={cx(
                    'rounded-sm text-body text-primary-600 hover:text-primary-700 hover:underline',
                    focusRing,
                  )}
                >
                  {item.label}
                </Link>
              )}
              {/* chevron-right is mirrored in RTL, so it points to the next (left) item */}
              {!current && <Icon name="chevron-right" size={16} className="text-fg-muted" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});
