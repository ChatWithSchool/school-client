import { render, screen } from '@testing-library/react';
import { Button } from '../Button/Button';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('shows the default sentences of the variant', () => {
    render(<EmptyState variant="no-results" />);
    expect(screen.getByText('לא נמצאו תוצאות')).toBeInTheDocument();
    expect(screen.getByText('נסו לשנות את הסינון.')).toBeInTheDocument();
  });

  it('takes a title, a text and an action; an empty text is hidden', () => {
    const { container } = render(<EmptyState title="foo" text="" action={<Button>bar</Button>} />);
    expect(screen.getByText('foo')).toBeInTheDocument();
    expect(container.querySelectorAll('p')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'bar' })).toBeInTheDocument();
  });

  it('announces only the error variant', () => {
    const { rerender } = render(<EmptyState variant="first-use" />);
    expect(screen.queryByRole('alert')).toBeNull();
    rerender(<EmptyState variant="error" />);
    expect(screen.getByRole('alert')).toHaveTextContent('לא הצלחנו לטעון');
  });
});
