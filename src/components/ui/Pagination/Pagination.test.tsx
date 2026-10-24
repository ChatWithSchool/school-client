import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { pageItems } from '../internal/pagination';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('lists the pages around the current one with gaps', () => {
    expect(pageItems(1, 10)).toEqual([1, 2, 'gap', 10]);
    expect(pageItems(5, 10)).toEqual([1, 'gap', 4, 5, 6, 'gap', 10]);
    expect(pageItems(2, 3)).toEqual([1, 2, 3]);
  });

  it('marks the current page and moves to another', async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={2} pageCount={10} onPageChange={onPageChange} />);
    expect(screen.getByRole('navigation', { name: 'עימוד' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'עמוד 2' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(screen.getByRole('button', { name: 'עמוד 3' }));
    expect(onPageChange).toHaveBeenLastCalledWith(3);
    await userEvent.click(screen.getByRole('button', { name: 'העמוד הקודם' }));
    expect(onPageChange).toHaveBeenLastCalledWith(1);
  });

  it('disables "previous" on the first page and "next" on the last', () => {
    const { rerender } = render(<Pagination page={1} pageCount={3} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'העמוד הקודם' })).toBeDisabled();
    rerender(<Pagination page={3} pageCount={3} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'העמוד הבא' })).toBeDisabled();
  });

  it('compact shows the page out of the count', async () => {
    const onPageChange = vi.fn();
    render(<Pagination variant="compact" page={1} pageCount={10} onPageChange={onPageChange} />);
    expect(screen.getByRole('navigation')).toHaveTextContent('עמוד 1 מתוך 10');
    await userEvent.click(screen.getByRole('button', { name: 'העמוד הבא' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
