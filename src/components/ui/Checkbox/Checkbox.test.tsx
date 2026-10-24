import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('is a checkbox named by its label and toggles with a click and with Space', async () => {
    const onChange = vi.fn();
    render(<Checkbox label="foo" onCheckedChange={onChange} />);
    const box = screen.getByRole('checkbox', { name: 'foo' });
    expect(box).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(box);
    expect(onChange).toHaveBeenLastCalledWith(true);
    expect(box).toHaveAttribute('aria-checked', 'true');
    box.focus();
    await userEvent.keyboard(' ');
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it('shows the mixed state as aria-checked="mixed"', () => {
    render(<Checkbox aria-label="foo" checked="mixed" />);
    expect(screen.getByRole('checkbox', { name: 'foo' })).toHaveAttribute('aria-checked', 'mixed');
  });

  it('does not toggle when disabled', async () => {
    const onChange = vi.fn();
    render(<Checkbox label="foo" disabled onCheckedChange={onChange} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });
});
