import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from './Switch';

describe('Switch', () => {
  it('is a switch named by its label and toggles with a click and with Space', async () => {
    const onChange = vi.fn();
    render(<Switch label="foo" onCheckedChange={onChange} />);
    const sw = screen.getByRole('switch', { name: 'foo' });
    expect(sw).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(sw);
    expect(onChange).toHaveBeenLastCalledWith(true);
    expect(sw).toHaveAttribute('aria-checked', 'true');
    sw.focus();
    await userEvent.keyboard(' ');
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it('does not toggle when disabled', async () => {
    const onChange = vi.fn();
    render(<Switch aria-label="foo" disabled onCheckedChange={onChange} />);
    await userEvent.click(screen.getByRole('switch', { name: 'foo' }));
    expect(onChange).not.toHaveBeenCalled();
  });
});
