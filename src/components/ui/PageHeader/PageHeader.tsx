import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../../styles/recipes';
import { Breadcrumbs, type BreadcrumbItem } from '../Breadcrumbs/Breadcrumbs';

export type PageHeaderProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Figma `Breadcrumbs: on, off`: shown when there are items. */
  breadcrumbs?: BreadcrumbItem[];
  /**
   * Figma `Actions: 0-3`: up to three buttons. Put the primary one first: in RTL it sits at the
   * right edge of the group, next to the title.
   */
  actions?: ReactNode;
};

/** The top of every screen: breadcrumbs, the one h1 of the page, a subtitle and the actions. */
export const PageHeader = forwardRef<HTMLElement, PageHeaderProps>(function PageHeader(
  { title, subtitle, breadcrumbs, actions, className, ...rest },
  ref,
) {
  return (
    <header ref={ref} className={cx('flex flex-col gap-2', className)} {...rest}>
      {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <h1 className="text-h1 text-fg">{title}</h1>
          {subtitle && <p className="text-body text-fg-secondary">{subtitle}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
});
