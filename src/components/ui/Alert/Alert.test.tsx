import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Alert } from './Alert';

describe('Alert', () => {
  it('uses role="alert" only for danger', () => {
    const { rerender } = render(<Alert tone="danger">foo</Alert>);
    expect(screen.getByRole('alert')).toHaveTextContent('foo');
    rerender(<Alert tone="success">foo</Alert>);
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByRole('status')).toHaveClass('bg-success-50');
  });

  it('names its icon with the word of the tone', () => {
    render(<Alert tone="warning">foo</Alert>);
    expect(screen.getByRole('img', { name: 'אזהרה' })).toBeInTheDocument();
  });

  it('shows a close button only when dismissible, and calls onDismiss', async () => {
    const onDismiss = vi.fn();
    const { rerender } = render(<Alert>foo</Alert>);
    expect(screen.queryByRole('button')).toBeNull();
    rerender(
      <Alert dismissible onDismiss={onDismiss} title="bar">
        foo
      </Alert>,
    );
    expect(screen.getByText('bar')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'סגירה' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
