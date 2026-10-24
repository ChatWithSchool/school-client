import { DirectionProvider } from '@radix-ui/react-direction';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroup } from './RadioGroup';

const OPTIONS = [
  { value: 'foo', label: 'Foo' },
  { value: 'bar', label: 'Bar' },
  { value: 'baz', label: 'Baz', disabled: true },
];

describe('RadioGroup', () => {
  it('is a radiogroup named by its label, with one radio per option', () => {
    render(<RadioGroup label="qux" options={OPTIONS} defaultValue="foo" />);
    expect(screen.getByRole('radiogroup', { name: 'qux' })).toHaveAttribute(
      'aria-orientation',
      'vertical',
    );
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByRole('radio', { name: 'Foo' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Baz' })).toBeDisabled();
  });

  it('selects with a click and moves with the arrow keys', async () => {
    const onChange = vi.fn();
    render(
      <DirectionProvider dir="rtl">
        <RadioGroup
          label="qux"
          options={OPTIONS}
          orientation="horizontal"
          onValueChange={onChange}
        />
      </DirectionProvider>,
    );
    await userEvent.click(screen.getByRole('radio', { name: 'Foo' }));
    expect(onChange).toHaveBeenLastCalledWith('foo');
    // RTL: the left arrow moves to the next option
    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => expect(screen.getByRole('radio', { name: 'Bar' })).toHaveFocus());
  });
});
