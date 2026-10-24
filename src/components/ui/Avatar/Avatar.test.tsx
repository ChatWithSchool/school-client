import { fireEvent, render, screen } from '@testing-library/react';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('shows the initials and is named by the full name', () => {
    render(<Avatar name="Foo Bar Baz" size="L" />);
    const avatar = screen.getByRole('img', { name: 'Foo Bar Baz' });
    expect(avatar).toHaveTextContent('FB');
    expect(avatar).toHaveClass('h-12', 'w-12');
  });

  it('shows the picture, and falls back to the initials when it fails', () => {
    const { container } = render(<Avatar name="Foo" src="foo.png" />);
    const img = container.querySelector('img')!;
    expect(img).toHaveAttribute('alt', '');
    fireEvent.error(img);
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByRole('img', { name: 'Foo' })).toHaveTextContent('F');
  });
});
