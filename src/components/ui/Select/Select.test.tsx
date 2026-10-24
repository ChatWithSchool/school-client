import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Select, type SelectOption } from './Select';

const OPTIONS: SelectOption[] = [
  { value: 'foo', label: 'Foo' },
  { value: 'bar', label: 'Bar' },
  { value: 'baz', label: 'Baz', disabled: true },
];

function Multi() {
  const [value, setValue] = useState<string[]>([]);
  return <Select multi label="qux" options={OPTIONS} value={value} onValueChange={setValue} />;
}

describe('Select', () => {
  it('single: a combobox named by its label, with the placeholder', () => {
    render(<Select label="qux" options={OPTIONS} />);
    const box = screen.getByRole('combobox', { name: 'qux' });
    expect(box).toHaveTextContent('בחרו אפשרות');
    expect(box).toHaveClass('h-10');
  });

  it('single: picks an option', async () => {
    const onValueChange = vi.fn();
    render(<Select label="qux" options={OPTIONS} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('option', { name: 'Baz' })).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(screen.getByRole('option', { name: 'Bar' }));
    expect(onValueChange).toHaveBeenCalledWith('bar');
    expect(screen.getByRole('combobox')).toHaveTextContent('Bar');
  });

  it('error: aria-invalid and the message as the description', () => {
    render(<Select label="qux" options={OPTIONS} error="lorem" hint="ipsum" />);
    const box = screen.getByRole('combobox');
    expect(box).toHaveAttribute('aria-invalid', 'true');
    expect(box).toHaveAccessibleDescription('ipsum lorem');
  });

  it('disabled does not open', () => {
    render(<Select label="qux" options={OPTIONS} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('multi: check boxes in a popover, the chosen values as tags', async () => {
    render(<Multi />);
    const trigger = screen.getByRole('button', { name: /qux/ });
    await userEvent.click(trigger);
    const group = screen.getByRole('group', { name: 'qux' });
    expect(group).toBeInTheDocument();
    await userEvent.click(screen.getByRole('checkbox', { name: 'Foo' }));
    await userEvent.click(screen.getByRole('checkbox', { name: 'Bar' }));
    expect(screen.getByRole('checkbox', { name: 'Baz' })).toBeDisabled();
    expect(trigger).toHaveTextContent('FooBar');
    await userEvent.click(screen.getByRole('checkbox', { name: 'Foo' }));
    expect(trigger).toHaveTextContent('Bar');
    expect(trigger).not.toHaveTextContent('Foo');
  });
});
