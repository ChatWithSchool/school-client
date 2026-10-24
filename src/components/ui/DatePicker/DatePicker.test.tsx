import { DirectionProvider } from '@radix-ui/react-direction';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { addMonths, monthGrid } from '../internal/date';
import { DatePicker, type DateRange } from './DatePicker';

const DAY = new Date(2026, 0, 14);

function Single({ initial = DAY }: { initial?: Date | null }) {
  const [value, setValue] = useState<Date | null>(initial);
  return (
    <DirectionProvider dir="rtl">
      <DatePicker label="foo" value={value} onChange={setValue} />
    </DirectionProvider>
  );
}

function Range() {
  const [value, setValue] = useState<DateRange>({ from: null, to: null });
  return <DatePicker mode="range" label="foo" value={value} onChange={setValue} />;
}

const day = (n: number) => screen.getByRole('button', { name: new RegExp(`^\\S+ \\S+, ${n} `) });

describe('date helpers', () => {
  it('builds the weeks of a month, Sunday first', () => {
    const weeks = monthGrid(new Date(2026, 0, 1)); // 1 Jan 2026 is a Thursday
    expect(weeks[0].slice(0, 4)).toEqual([null, null, null, null]);
    expect(weeks[0][4]?.getDate()).toBe(1);
    expect(weeks.flat().filter(Boolean)).toHaveLength(31);
  });

  it('adds months and clamps the day', () => {
    expect(addMonths(new Date(2026, 0, 31), 1)).toEqual(new Date(2026, 1, 28));
  });
});

describe('DatePicker', () => {
  it('closed: a combobox named by the label and the date', () => {
    render(<Single />);
    const trigger = screen.getByRole('combobox', { name: 'foo 14/01/2026' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows the placeholder without a value', () => {
    render(<Single initial={null} />);
    expect(screen.getByRole('combobox', { name: 'foo dd/mm/yyyy' })).toBeInTheDocument();
  });

  it('open: focuses the chosen day; the arrows move by day (mirrored in RTL) and Enter picks', async () => {
    render(<Single />);
    await userEvent.click(screen.getByRole('combobox', { name: /foo/ }));
    expect(screen.getByRole('dialog', { name: 'בחירת תאריך' })).toBeInTheDocument();
    expect(day(14)).toHaveFocus();
    expect(day(14).closest('td')).toHaveAttribute('aria-selected', 'true');
    expect(day(15).closest('td')).toHaveAttribute('aria-selected', 'false');
    await userEvent.keyboard('{ArrowLeft}');
    expect(day(15)).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(day(22)).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('combobox', { name: 'foo 22/01/2026' })).toBeInTheDocument();
  });

  it('moves between months with the buttons', async () => {
    render(<Single />);
    await userEvent.click(screen.getByRole('combobox', { name: /foo/ }));
    await userEvent.click(screen.getByRole('button', { name: 'החודש הבא' }));
    expect(screen.getByRole('grid')).toHaveAccessibleName(/פברואר/);
  });

  it('range: two clicks choose the first and the last day', async () => {
    render(<Range />);
    await userEvent.click(screen.getByRole('combobox', { name: /foo/ }));
    const grid = screen.getByRole('grid');
    const buttons = grid.querySelectorAll('button');
    await userEvent.click(buttons[9]);
    await userEvent.click(buttons[4]);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('combobox', { name: /foo/ })).toHaveTextContent(
      /05\/\d\d\/\d{4} – 10\//,
    );
  });

  it('error: aria-invalid and the message as the description', () => {
    render(<DatePicker label="foo" value={null} onChange={() => {}} error="bar" />);
    const trigger = screen.getByRole('combobox', { name: /foo/ });
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
    expect(trigger).toHaveAccessibleDescription('bar');
  });
  it('range closed after the first day shows that day only', async () => {
    render(<Range />);
    await userEvent.click(screen.getByRole('combobox', { name: /foo/ }));
    await userEvent.click(screen.getByRole('grid').querySelectorAll('button')[4]);
    await userEvent.keyboard('{Escape}');
    const trigger = screen.getByRole('combobox', { name: /foo/ });
    expect(trigger).toHaveTextContent(/^05\/\d\d\/\d{4}$/);
  });

  it('range: the days between are marked by the whole day, whatever the time', async () => {
    const from = new Date(2026, 0, 5, 18, 30);
    const to = new Date(2026, 0, 7, 8, 0);
    render(<DatePicker mode="range" label="foo" value={{ from, to }} onChange={() => {}} />);
    await userEvent.click(screen.getByRole('combobox', { name: /foo/ }));
    expect(day(6)).toHaveClass('bg-primary-50');
    expect(day(4)).not.toHaveClass('bg-primary-50');
    expect(day(8)).not.toHaveClass('bg-primary-50');
  });

  it('required sets aria-required; name sends yyyy-mm-dd in hidden inputs', () => {
    const { container, rerender } = render(
      <DatePicker label="foo" value={DAY} onChange={() => {}} required name="bar" />,
    );
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-required', 'true');
    expect(container.querySelector('input[name="bar"]')).toHaveValue('2026-01-14');
    rerender(
      <DatePicker
        mode="range"
        label="foo"
        value={{ from: DAY, to: null }}
        onChange={() => {}}
        name="bar"
      />,
    );
    expect(container.querySelector('input[name="bar-from"]')).toHaveValue('2026-01-14');
    expect(container.querySelector('input[name="bar-to"]')).toHaveValue('');
  });
});
