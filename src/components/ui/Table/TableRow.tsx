import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../../styles/recipes';
import { ROW_HEIGHT, type TableDensity } from '../internal/table';

export type { TableDensity } from '../internal/table';

export type TableRowProps = HTMLAttributes<HTMLTableRowElement> & {
  /** Figma `Selected: on`: the row is chosen (its check box is on). */
  selected?: boolean;
  /** comfortable = 48, compact = 40. Table passes its own density. */
  density?: TableDensity;
};

/**
 * A body row of a Table (the building block). Hover and selected are primary-50; a row with
 * `tabIndex` (a clickable row) shows the focus ring inside its edges.
 */
export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { selected = false, density = 'comfortable', className, ...rest },
  ref,
) {
  return (
    <tr
      ref={ref}
      // the row check box tells screen readers; aria-selected is only valid in a grid
      data-selected={selected || undefined}
      className={cx(
        ROW_HEIGHT[density],
        'border-b border-line last:border-b-0 hover:bg-primary-50',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-primary-500/35',
        selected ? 'bg-primary-50' : 'bg-surface',
        className,
      )}
      {...rest}
    />
  );
});
