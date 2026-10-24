import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DropdownMenu } from './DropdownMenu';

describe('DropdownMenu', () => {
  it('opens from a named trigger and runs an item', async () => {
    const foo = vi.fn();
    const bar = vi.fn();
    render(
      <DropdownMenu
        label="actions"
        items={[
          { label: 'foo', icon: 'pencil', onSelect: foo },
          { label: 'bar', onSelect: bar, disabled: true },
          { label: 'baz', tone: 'danger', icon: 'trash-2', onSelect: () => {} },
        ]}
      />,
    );
    const trigger = screen.getByRole('button', { name: 'actions' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    await userEvent.click(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'bar' })).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('menuitem', { name: 'baz' })).toHaveClass('text-danger-700');
    await userEvent.click(screen.getByRole('menuitem', { name: 'foo' }));
    expect(foo).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('works with the keyboard and Escape returns focus', async () => {
    const foo = vi.fn();
    render(<DropdownMenu label="actions" items={[{ label: 'foo', onSelect: foo }]} />);
    const trigger = screen.getByRole('button', { name: 'actions' });
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).toBeNull();
    expect(trigger).toHaveFocus();
  });
});
