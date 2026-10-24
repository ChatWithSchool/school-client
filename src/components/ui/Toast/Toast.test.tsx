import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button/Button';
import { ToastProvider } from './Toast';
import { useToast, type ToastOptions } from './useToast';

function Demo(options: ToastOptions) {
  const toast = useToast();
  return <Button onClick={() => toast(options)}>show</Button>;
}

describe('Toast', () => {
  it('shows a message with the sign and the word of the tone', async () => {
    render(
      <ToastProvider>
        <Demo tone="success" message="foo" />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'show' }));
    expect(await screen.findByText('foo')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'הצלחה' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /ביטול/ })).toBeNull();
  });

  it('undo calls back and closes the toast', async () => {
    const onUndo = vi.fn();
    render(
      <ToastProvider>
        <Demo tone="info" message="foo" onUndo={onUndo} />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'show' }));
    await userEvent.click(await screen.findByRole('button', { name: 'ביטול' }));
    expect(onUndo).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('foo')).toBeNull();
  });

  it('useToast outside the provider throws', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Demo message="foo" />)).toThrow(/ToastProvider/);
  });
});
