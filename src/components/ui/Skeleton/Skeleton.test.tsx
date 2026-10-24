import { render } from '@testing-library/react';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('is an animated line by default, hidden from screen readers', () => {
    const { container } = render(<Skeleton />);
    const el = container.firstElementChild!;
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el).toHaveClass('animate-pulse', 'h-3');
  });

  it.each([
    ['block', 'h-24'],
    ['table-row', 'h-12'],
    ['card', 'rounded-lg'],
  ] as const)('renders the %s shape', (shape, cls) => {
    const { container } = render(<Skeleton shape={shape} />);
    expect(container.firstElementChild).toHaveClass(cls);
  });
});
