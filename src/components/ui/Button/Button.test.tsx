import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { Button } from './Button';

describe('Button', () => {
  it('is a type="button" with the variant and size classes', () => {
    render(
      <Button variant="danger" size="L">
        foo
      </Button>,
    );
    const btn = screen.getByRole('button', { name: 'foo' });
    expect(btn).toHaveAttribute('type', 'button');
    expect(btn).toHaveClass('bg-danger-600', 'h-12');
  });

  it('calls onClick and forwards the ref', async () => {
    const onClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} onClick={onClick}>
        foo
      </Button>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('while loading: disabled, aria-busy, and no click', async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        foo
      </Button>,
    );
    const btn = screen.getByRole('button', { name: 'foo' });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('disabled shows the disabled look', () => {
    render(<Button disabled>foo</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-ink-200');
  });

  it('places a leading and a trailing icon around the text', () => {
    const { container, rerender } = render(
      <Button icon="leading" iconName="plus">
        foo
      </Button>,
    );
    expect(container.querySelector('button')?.firstChild?.nodeName).toBe('svg');
    rerender(
      <Button icon="trailing" iconName="plus">
        foo
      </Button>,
    );
    expect(container.querySelector('button')?.lastChild?.nodeName).toBe('svg');
  });

  it('an icon-only button is named by aria-label', () => {
    render(<Button icon="icon-only" iconName="pencil" aria-label="bar" />);
    expect(screen.getByRole('button', { name: 'bar' })).toHaveClass('w-10');
  });
});
