import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button/Button';
import { DialogClose, Drawer } from './Drawer';

describe('Drawer', () => {
  it('opens at the end side, 420 wide, with a header, a body and a footer', async () => {
    render(
      <Drawer
        trigger={<Button>open</Button>}
        title="foo"
        footer={
          <>
            <Button>bar</Button>
            <DialogClose asChild>
              <Button variant="secondary">baz</Button>
            </DialogClose>
          </>
        }
      >
        <p>qux</p>
      </Drawer>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'open' }));
    const drawer = screen.getByRole('dialog', { name: 'foo' });
    expect(drawer).toHaveClass('end-0', 'w-drawer');
    expect(drawer).toHaveTextContent('qux');
    await userEvent.click(screen.getByRole('button', { name: 'baz' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('is controlled and closes with Escape', async () => {
    const onOpenChange = vi.fn();
    render(<Drawer open onOpenChange={onOpenChange} title="foo" />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
