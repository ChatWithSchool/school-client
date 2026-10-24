import {
  forwardRef,
  type ForwardedRef,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type RefAttributes,
  type TableHTMLAttributes,
} from 'react';
import { cx } from '../../../styles/recipes';
import { Checkbox } from '../Checkbox/Checkbox';
import { EmptyState } from '../EmptyState/EmptyState';
import { Skeleton } from '../Skeleton/Skeleton';
import { ROW_HEIGHT, type TableDensity } from '../internal/table';
import { TableRow } from './TableRow';

export type TableColumn<T> = {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  /** Numbers, ids and phones: tabular digits, left to right (the .num class). */
  numeric?: boolean;
  /** Extra classes for the th and the td, for example a width (w-40). */
  className?: string;
};

export type TableProps<T> = Omit<TableHTMLAttributes<HTMLTableElement>, 'children'> & {
  columns: TableColumn<T>[];
  /** The rows. Undefined while loading. */
  rows: T[] | undefined;
  getRowId: (row: T) => string;
  /** Names the table for screen readers (a visually hidden caption). */
  caption: string;
  /** Figma `Density`: comfortable rows are 48 high, compact rows 40. */
  density?: TableDensity;
  /** Figma `Selectable: on`: a check box at the start of each row and in the header. */
  selectable?: boolean;
  selectedIds?: string[];
  onSelectedChange?: (ids: string[]) => void;
  /** The accessible name of a row check box. Defaults to "בחירת שורה". */
  rowLabel?: (row: T) => string;
  /** Figma `State: loading`: skeleton rows. Also shown while `rows` is undefined. */
  loading?: boolean;
  /** Figma `State: empty`: what an empty table shows. Defaults to the no-results EmptyState. */
  empty?: ReactNode;
  /**
   * Makes each row clickable: a click, or Enter or Space while the row has focus. Clicks on a
   * button, link, field or menu inside a cell do not open the row. The row has no name of its own,
   * so when the row opens a page, prefer a Link in the primary cell (screen readers announce it)
   * and keep `onRowClick` as the larger mouse target.
   */
  onRowClick?: (row: T) => void;
  /** Classes of the scroll box around the table (a max height makes the sticky header work). */
  wrapperClassName?: string;
};

const LOADING_ROWS = 3;

/** Clicks on these, inside a cell, belong to the control and do not open the row. */
const INTERACTIVE = 'button,a,input,select,textarea,[role=menuitem],[role=option],[role=checkbox]';

/** False for a click that comes from a control in a cell, or through a portal (a Radix menu). */
function isRowClick(e: MouseEvent<HTMLTableRowElement>) {
  const target = e.target as Element;
  return e.currentTarget.contains(target) && !target.closest(INTERACTIVE);
}

function TableInner<T>(
  {
    columns,
    rows,
    getRowId,
    caption,
    density = 'comfortable',
    selectable = false,
    selectedIds = [],
    onSelectedChange,
    rowLabel,
    loading = false,
    empty,
    onRowClick,
    wrapperClassName,
    className,
    ...rest
  }: TableProps<T>,
  ref: ForwardedRef<HTMLTableElement>,
) {
  const busy = loading || rows === undefined;
  const list = rows ?? [];
  const span = columns.length + (selectable ? 1 : 0);
  const selected = new Set(selectedIds);
  // the rows of this page; ids chosen on other pages stay in selectedIds
  const pageIds = list.map(getRowId);
  const picked = pageIds.filter((id) => selected.has(id)).length;
  const all = picked > 0 && picked === pageIds.length ? true : picked > 0 ? 'mixed' : false;

  const toggleAll = (on: boolean) =>
    onSelectedChange?.(
      on
        ? [...new Set([...selectedIds, ...pageIds])]
        : selectedIds.filter((id) => !pageIds.includes(id)),
    );

  const toggle = (id: string, on: boolean) =>
    onSelectedChange?.(on ? [...selectedIds, id] : selectedIds.filter((x) => x !== id));

  return (
    <div className={cx('overflow-auto rounded-lg border border-line bg-surface', wrapperClassName)}>
      <table
        ref={ref}
        aria-busy={busy || undefined}
        className={cx('w-full border-collapse text-body', className)}
        {...rest}
      >
        <caption className="sr-only">{caption}</caption>
        {/* Figma `Sticky header: on` */}
        <thead className="sticky top-0 z-10 bg-subtle">
          <tr className="h-10">
            {selectable && (
              <th scope="col" className="w-10 px-3">
                <Checkbox
                  aria-label="בחירת כל השורות"
                  checked={all}
                  disabled={busy || list.length === 0}
                  onCheckedChange={(v) => toggleAll(v === true)}
                />
              </th>
            )}
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={cx('px-3 text-start text-label text-fg-secondary', c.className)}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {busy &&
            Array.from({ length: LOADING_ROWS }, (_, i) => (
              <tr key={i} className={cx(ROW_HEIGHT[density], 'border-b border-line')}>
                <td colSpan={span} className="px-3">
                  {i === 0 && <span className="sr-only">טוען</span>}
                  <Skeleton shape="line" />
                </td>
              </tr>
            ))}
          {!busy && list.length === 0 && (
            <tr>
              <td colSpan={span} className="p-6">
                {empty ?? <EmptyState variant="no-results" />}
              </td>
            </tr>
          )}
          {!busy &&
            list.map((row) => {
              const id = getRowId(row);
              const on = selected.has(id);
              return (
                <TableRow
                  key={id}
                  density={density}
                  selected={on}
                  tabIndex={onRowClick ? 0 : undefined}
                  onClick={
                    onRowClick
                      ? (e) => {
                          if (isRowClick(e)) onRowClick(row);
                        }
                      : undefined
                  }
                  onKeyDown={
                    onRowClick
                      ? (e) => {
                          // only the focused row itself; keys in a cell control stay with it
                          if (e.target !== e.currentTarget) return;
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault(); // Space would scroll the page
                            onRowClick(row);
                          }
                        }
                      : undefined
                  }
                  className={onRowClick ? 'cursor-pointer' : undefined}
                >
                  {selectable && (
                    <td className="w-10 px-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        aria-label={rowLabel?.(row) ?? 'בחירת שורה'}
                        checked={on}
                        onCheckedChange={(v) => toggle(id, v === true)}
                      />
                    </td>
                  )}
                  {columns.map((c) => (
                    <td key={c.key} className={cx('px-3 text-start text-fg', c.className)}>
                      {/* a span, so the cell keeps the RTL alignment of its column */}
                      {c.numeric ? <span className="num">{c.cell(row)}</span> : c.cell(row)}
                    </td>
                  ))}
                </TableRow>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

/**
 * A data table: a sticky header, two densities, row selection and the loading and empty states
 * built in. The header row is 40 high on a subtle background.
 */
export const Table = forwardRef(TableInner) as <T>(
  props: TableProps<T> & RefAttributes<HTMLTableElement>,
) => ReactElement | null;
