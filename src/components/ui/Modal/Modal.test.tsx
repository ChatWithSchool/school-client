import { act, render, screen, waitFor } from '@testing-library/react';
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

  it('confirm calls onConfirm and closes the dialog', async () => {
    const { onConfirm } = renderModal();
    const trigger = screen.getByRole('button', { name: 'open' });
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole('button', { name: 'אישור' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it('confirm stays open when onConfirm returns false', async () => {
    renderModal({ onConfirm: () => false });
    await userEvent.click(screen.getByRole('button', { name: 'open' }));
    await userEvent.click(screen.getByRole('button', { name: 'אישור' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('a Promise keeps the dialog open and busy until it resolves', async () => {
    let resolve = (_v?: boolean) => {};
    renderModal({ onConfirm: () => new Promise<boolean | void>((r) => (resolve = r)) });
    await userEvent.click(screen.getByRole('button', { name: 'open' }));
    const confirm = screen.getByRole('button', { name: 'אישור' });
    await userEvent.click(confirm);
    expect(confirm).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await act(async () => resolve());
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('a Promise that rejects or resolves to false keeps the dialog open', async () => {
    const onConfirm = vi.fn().mockRejectedValueOnce(new Error('foo')).mockResolvedValueOnce(false);
    renderModal({ onConfirm });
    await userEvent.click(screen.getByRole('button', { name: 'open' }));
    const confirm = screen.getByRole('button', { name: 'אישור' });
    await userEvent.click(confirm);
    await waitFor(() => expect(confirm).not.toHaveAttribute('aria-busy'));
    await userEvent.click(confirm);
    await waitFor(() => expect(confirm).not.toHaveAttribute('aria-busy'));
    expect(onConfirm).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('controlled: confirm asks the screen to close through onOpenChange', async () => {
    const onOpenChange = vi.fn();
    renderModal({ open: true, onOpenChange, trigger: undefined });
    await userEvent.click(screen.getByRole('button', { name: 'אישור' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('double footer: cancel closes and returns focus', async () => {
    renderModal();
    const trigger = screen.getByRole('button', { name: 'open' });
    await userEvent.click(trigger);
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

  it('confirmLoading blocks the confirm button and keeps it focusable', async () => {
    const { onConfirm } = renderModal({ open: true, confirmLoading: true });
    const confirm = screen.getByRole('button', { name: 'אישור' });
    expect(confirm).toHaveAttribute('aria-busy', 'true');
    expect(confirm).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(confirm);
    expect(onConfirm).not.toHaveBeenCalled();
    expect(confirm).toHaveFocus();
  });
});
