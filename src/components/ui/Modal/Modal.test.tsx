import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button/Button';
import { Modal } from './Modal';

function renderModal(props: Partial<Parameters<typeof Modal>[0]> = {}) {
  const onConfirm = vi.fn();
  render(
    <Modal
      trigger={<Button>open</Button>}
      title="foo"
      description="bar"
      onConfirm={onConfirm}
      {...props}
    >
      <p>baz</p>
    </Modal>,
  );
  return { onConfirm };
}

describe('Modal', () => {
  it('opens from its trigger as a named, described dialog', async () => {
    renderModal();
    expect(screen.queryByRole('dialog')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'open' }));
    const dialog = screen.getByRole('dialog', { name: 'foo' });
    expect(dialog).toHaveAccessibleDescription('bar');
    expect(dialog).toHaveClass('max-w-modal-s');
    expect(dialog).toHaveTextContent('baz');
  });

  it('double footer: confirm and cancel; cancel closes and returns focus', async () => {
    const { onConfirm } = renderModal();
    const trigger = screen.getByRole('button', { name: 'open' });
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole('button', { name: 'אישור' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByRole('button', { name: 'ביטול' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it('single footer has no cancel button; Escape and the close button close it', async () => {
    renderModal({ footer: 'single', size: 'M', confirmVariant: 'danger', confirmLabel: 'qux' });
    await userEvent.click(screen.getByRole('button', { name: 'open' }));
    expect(screen.getByRole('dialog')).toHaveClass('max-w-modal-m');
    expect(screen.queryByRole('button', { name: 'ביטול' })).toBeNull();
    expect(screen.getByRole('button', { name: 'qux' })).toHaveClass('bg-danger-600');
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'open' }));
    await userEvent.click(screen.getByRole('button', { name: 'סגירה' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('confirmLoading blocks the confirm button', async () => {
    renderModal({ open: true, confirmLoading: true });
    expect(screen.getByRole('button', { name: 'אישור' })).toHaveAttribute('aria-busy', 'true');
  });
});
