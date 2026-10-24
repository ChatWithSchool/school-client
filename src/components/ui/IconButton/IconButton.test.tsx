import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('is named by its label and hides the icon', () => {
    const { container } = render(<IconButton icon="pencil" label="foo" />);
    expect(screen.getByRole('button', { name: 'foo' })).toHaveAttribute('type', 'button');
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('has the size and variant classes', () => {
    render(<IconButton icon="x" label="foo" size="S" variant="secondary" />);
    expect(screen.getByRole('button')).toHaveClass('h-8', 'w-8', 'border-line');
  });

  it('does not click when disabled', async () => {
    const onClick = vi.fn();
    render(<IconButton icon="x" label="foo" disabled onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('requires a label at the type level', () => {
    // @ts-expect-error label is required
    render(<IconButton icon="x" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
