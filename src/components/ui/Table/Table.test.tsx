import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { DropdownMenu } from '../DropdownMenu/DropdownMenu';
import { Table, type TableColumn } from './Table';

type Row = { id: string; name: string; count: number };
const ROWS: Row[] = [
  { id: '1', name: 'foo', count: 10 },
  { id: '2', name: 'bar', count: 20 },
];
const COLUMNS: TableColumn<Row>[] = [
  { key: 'name', header: 'Lorem', cell: (r) => r.name },
  { key: 'count', header: 'Ipsum', cell: (r) => r.count, numeric: true },
];

function Selectable({ rows = ROWS, initial = [] }: { rows?: Row[]; initial?: string[] }) {
  const [ids, setIds] = useState<string[]>(initial);
  return (
    <Table
      caption="baz"
      columns={COLUMNS}
      rows={rows}
      getRowId={(r) => r.id}
      selectable
      selectedIds={ids}
      onSelectedChange={setIds}
      rowLabel={(r) => `בחירת ${r.name}`}
      data-selected-ids={ids.join(',')}
    />
  );
}

describe('Table', () => {
  it('renders a named table with column headers and rows', () => {
    render(<Table caption="baz" columns={COLUMNS} rows={ROWS} getRowId={(r) => r.id} />);
    const table = screen.getByRole('table', { name: 'baz' });
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((h) => h.textContent),
    ).toEqual(['Lorem', 'Ipsum']);
    expect(within(table).getAllByRole('row')).toHaveLength(3);
    expect(screen.getByText('20')).toHaveClass('num');
  });

  it('has the compact density', () => {
    render(
      <Table
        caption="baz"
        density="compact"
        columns={COLUMNS}
        rows={ROWS}
        getRowId={(r) => r.id}
      />,
    );
    expect(screen.getAllByRole('row')[1]).toHaveClass('h-10');
  });

  it('loading: busy, with skeleton rows', () => {
    render(<Table caption="baz" columns={COLUMNS} rows={undefined} getRowId={(r) => r.id} />);
    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('טוען')).toBeInTheDocument();
  });

  it('empty: the no-results EmptyState, or the one given', () => {
    const { rerender } = render(
      <Table caption="baz" columns={COLUMNS} rows={[]} getRowId={(r) => r.id} />,
    );
    expect(screen.getByText('לא נמצאו תוצאות')).toBeInTheDocument();
    rerender(
      <Table caption="baz" columns={COLUMNS} rows={[]} getRowId={(r) => r.id} empty="qux" />,
    );
    expect(screen.getByText('qux')).toBeInTheDocument();
  });

  it('selects rows one by one and all at once', async () => {
    render(<Selectable />);
    const all = screen.getByRole('checkbox', { name: 'בחירת כל השורות' });
    await userEvent.click(screen.getByRole('checkbox', { name: 'בחירת foo' }));
    expect(all).toHaveAttribute('aria-checked', 'mixed');
    expect(screen.getAllByRole('row')[1]).toHaveClass('bg-primary-50');
    await userEvent.click(all);
    expect(screen.getByRole('checkbox', { name: 'בחירת bar' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await userEvent.click(all);
    expect(all).toHaveAttribute('aria-checked', 'false');
  });

  it('a clickable row opens with a click and with Enter', async () => {
    const onRowClick = vi.fn();
    render(
      <Table
        caption="baz"
        columns={COLUMNS}
        rows={ROWS}
        getRowId={(r) => r.id}
        onRowClick={onRowClick}
      />,
    );
    const row = screen.getAllByRole('row')[2];
    await userEvent.click(row);
    expect(onRowClick).toHaveBeenLastCalledWith(ROWS[1]);
    row.focus();
    await userEvent.keyboard('{Enter}');
    expect(onRowClick).toHaveBeenCalledTimes(2);
  });

  it('select all and clear all keep the rows chosen on other pages', async () => {
    // '9' was chosen on another page; '1' is on this page
    render(<Selectable initial={['9', '1']} />);
    const table = screen.getByRole('table');
    const all = screen.getByRole('checkbox', { name: 'בחירת כל השורות' });
    // the header state counts the rows of this page only
    expect(all).toHaveAttribute('aria-checked', 'mixed');
    await userEvent.click(all);
    expect(table).toHaveAttribute('data-selected-ids', '9,1,2');
    expect(all).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(all);
    expect(table).toHaveAttribute('data-selected-ids', '9');
    expect(all).toHaveAttribute('aria-checked', 'false');
  });

  it('a clickable row also opens with Space', async () => {
    const onRowClick = vi.fn();
    render(
      <Table
        caption="baz"
        columns={COLUMNS}
        rows={ROWS}
        getRowId={(r) => r.id}
        onRowClick={onRowClick}
      />,
    );
    screen.getAllByRole('row')[1].focus();
    await userEvent.keyboard(' ');
    expect(onRowClick).toHaveBeenCalledWith(ROWS[0]);
  });

  it('a click on a control in a cell, or in its menu, does not open the row', async () => {
    const onRowClick = vi.fn();
    const onSelect = vi.fn();
    const columns: TableColumn<Row>[] = [
      ...COLUMNS,
      {
        key: 'actions',
        header: 'Dolor',
        cell: (r) => <DropdownMenu label={`qux ${r.name}`} items={[{ label: 'quux', onSelect }]} />,
      },
    ];
    render(
      <Table
        caption="baz"
        columns={columns}
        rows={ROWS}
        getRowId={(r) => r.id}
        onRowClick={onRowClick}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'qux foo' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'quux' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onRowClick).not.toHaveBeenCalled();
  });
});
