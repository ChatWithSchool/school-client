import { render, screen } from '@testing-library/react';
import { createRef, type ReactNode } from 'react';
import { TableRow } from './TableRow';

const inTable = (row: ReactNode) => (
  <table>
    <tbody>{row}</tbody>
  </table>
);

describe('TableRow', () => {
  it('is a row with the density height and forwards the ref', () => {
    const ref = createRef<HTMLTableRowElement>();
    render(
      inTable(
        <TableRow ref={ref} density="compact">
          <td>foo</td>
        </TableRow>,
      ),
    );
    expect(screen.getByRole('row')).toBe(ref.current);
    expect(ref.current).toHaveClass('h-10', 'hover:bg-primary-50');
  });

  it('a selected row has the selected background', () => {
    render(
      inTable(
        <TableRow selected>
          <td>foo</td>
        </TableRow>,
      ),
    );
    expect(screen.getByRole('row')).toHaveClass('bg-primary-50', 'h-12');
    expect(screen.getByRole('row')).toHaveAttribute('data-selected', 'true');
  });
});
