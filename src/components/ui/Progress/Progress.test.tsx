import { render, screen } from '@testing-library/react';
import { Progress } from './Progress';

describe('Progress', () => {
  it('is a named progressbar with its value', () => {
    render(<Progress label="foo" value={42.4} />);
    const bar = screen.getByRole('progressbar', { name: 'foo' });
    expect(bar).toHaveAttribute('aria-valuenow', '42');
    expect(bar.firstElementChild).toHaveStyle({ width: '42%' });
    expect(bar.firstElementChild).toHaveClass('bg-primary-600');
  });

  it('clamps the value and has the success tone', () => {
    render(<Progress label="foo" value={140} tone="success" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '100');
    expect(bar.firstElementChild).toHaveClass('bg-success-500');
  });
});
