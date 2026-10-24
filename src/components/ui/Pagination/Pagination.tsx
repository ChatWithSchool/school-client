import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../../styles/recipes';
import { IconButton } from '../IconButton/IconButton';
import { pageItems } from '../internal/pagination';
import { focusRing } from '../internal/styles';

export type PaginationVariant = 'full' | 'compact';

export type PaginationProps = Omit<HTMLAttributes<HTMLElement>, 'onChange'> & {
  /** The current page, from 1. */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** full: the page numbers; compact: "עמוד 1 מתוך 10" (narrow screens, cards). */
  variant?: PaginationVariant;
};

/**
 * The pages of a table. "הקודם" is at the start (on the right in RTL) and "הבא" at the end; the
 * chevrons are mirrored with the direction.
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    page,
    pageCount,
    onPageChange,
    variant = 'full',
    className,
    'aria-label': ariaLabel = 'עימוד',
    ...rest
  },
  ref,
) {
  const prev = (
    <IconButton
      icon="chevron-left"
      label="העמוד הקודם"
      size="S"
      disabled={page <= 1}
      onClick={() => onPageChange(page - 1)}
    />
  );
  const next = (
    <IconButton
      icon="chevron-right"
      label="העמוד הבא"
      size="S"
      disabled={page >= pageCount}
      onClick={() => onPageChange(page + 1)}
    />
  );

  return (
    <nav ref={ref} aria-label={ariaLabel} className={className} {...rest}>
      {variant === 'compact' ? (
        <div className="flex items-center gap-2">
          {prev}
          <span className="text-body text-fg-secondary">
            עמוד <span className="num">{page}</span> מתוך <span className="num">{pageCount}</span>
          </span>
          {next}
        </div>
      ) : (
        <ul className="flex items-center gap-1">
          <li>{prev}</li>
          {pageItems(page, pageCount).map((p, i) =>
            p === 'gap' ? (
              <li
                key={`gap-${i}`}
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center text-body text-fg-muted"
              >
                …
              </li>
            ) : (
              <li key={p}>
                {/* 32×32 is above the 24×24 minimum of WCAG 2.5.8 */}
                <button
                  type="button"
                  aria-label={`עמוד ${p}`}
                  aria-current={p === page ? 'page' : undefined}
                  onClick={() => p !== page && onPageChange(p)}
                  className={cx(
                    'num flex h-8 w-8 items-center justify-center rounded-md',
                    focusRing,
                    p === page
                      ? 'bg-primary-600 text-body-strong text-white'
                      : 'text-body text-fg hover:bg-subtle active:bg-ink-200',
                  )}
                >
                  {p}
                </button>
              </li>
            ),
          )}
          <li>{next}</li>
        </ul>
      )}
    </nav>
  );
});
