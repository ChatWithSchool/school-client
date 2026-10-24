import { render, screen } from '@testing-library/react';
import { MetricCard } from './MetricCard';

describe('MetricCard', () => {
  it('shows the label, the value and "no change" by default', () => {
    render(<MetricCard label="foo" value="94%" />);
    expect(screen.getByText('foo')).toBeInTheDocument();
    expect(screen.getByText('94%')).toHaveClass('num', 'text-h1');
    expect(screen.getByText('ללא שינוי')).toBeInTheDocument();
  });

  it('a trend has an arrow and words in its color', () => {
    const { container } = render(<MetricCard label="foo" value="1" trend="down" trendText="bar" />);
    expect(screen.getByText('bar')).toHaveClass('text-danger-700');
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('warning tone and loading', () => {
    const { container } = render(<MetricCard label="foo" value="1" tone="warning" loading />);
    const card = container.firstElementChild!;
    expect(card).toHaveClass('bg-warning-50');
    expect(card).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByText('1')).toBeNull();
    expect(screen.getByText('טוען')).toBeInTheDocument();
  });

  it('trendTone overrides the color of the trend', () => {
    render(<MetricCard label="foo" value="1" trend="up" trendText="bar" trendTone="negative" />);
    expect(screen.getByText('bar')).toHaveClass('text-danger-700');
  });
});
