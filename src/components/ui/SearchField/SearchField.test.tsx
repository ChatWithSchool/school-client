import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchField } from './SearchField';

const RESULTS = [
  { id: '1', label: 'foo' },
  { id: '2', label: 'bar' },
];

describe('SearchField', () => {
  it('without results is a plain named search input', async () => {
    const onChange = vi.fn();
    render(<SearchField label="baz" onChange={onChange} />);
    const input = screen.getByRole('searchbox', { name: 'baz' });
    expect(input).toHaveAttribute('placeholder', 'חיפוש');
    await userEvent.type(input, 'ab');
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('with results is a combobox: arrows move, Enter picks', async () => {
    const onResultSelect = vi.fn();
    render(<SearchField label="baz" results={RESULTS} onResultSelect={onResultSelect} />);
    const input = screen.getByRole('combobox', { name: 'baz' });
    expect(input).toHaveAttribute('aria-expanded', 'false');
    await userEvent.type(input, 'f');
    expect(input).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    const bar = screen.getByRole('option', { name: 'bar' });
    expect(bar).toHaveAttribute('aria-selected', 'true');
    expect(input).toHaveAttribute('aria-activedescendant', bar.id);
    await userEvent.keyboard('{Enter}');
    expect(onResultSelect).toHaveBeenCalledWith(RESULTS[1]);
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('Escape closes the list; a click picks', async () => {
    const onResultSelect = vi.fn();
    render(<SearchField label="baz" results={RESULTS} onResultSelect={onResultSelect} />);
    await userEvent.type(screen.getByRole('combobox'), 'f');
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).toBeNull();
    await userEvent.type(screen.getByRole('combobox'), 'o');
    await userEvent.click(screen.getByRole('option', { name: 'foo' }));
    expect(onResultSelect).toHaveBeenCalledWith(RESULTS[0]);
  });

  it('says when there are no results', async () => {
    render(<SearchField label="baz" results={[]} />);
    await userEvent.type(screen.getByRole('combobox'), 'qux');
    expect(screen.getByRole('status')).toHaveTextContent('לא נמצאו תוצאות');
  });

  it('global scope has the page background', () => {
    const { container } = render(<SearchField label="baz" scope="global" />);
    expect(container.querySelector('.bg-page')).not.toBeNull();
  });
});
