import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders the text with the tone and size classes', () => {
    render(
      <Badge tone="accent" size="S">
        foo
      </Badge>,
    );
    expect(screen.getByText('foo')).toHaveClass('bg-accent-100', 'text-accent-700', 'text-caption');
  });

  it('gives a status tone an icon, so color is not alone', () => {
    const { container } = render(<Badge tone="danger">foo</Badge>);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('has no icon for neutral, unless one is passed', () => {
    const { container, rerender } = render(<Badge>foo</Badge>);
    expect(container.querySelector('svg')).toBeNull();
    rerender(<Badge icon="clock">foo</Badge>);
    expect(container.querySelector('svg')).not.toBeNull();
  });
});
