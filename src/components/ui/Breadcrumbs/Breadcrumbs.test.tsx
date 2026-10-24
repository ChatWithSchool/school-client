import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Breadcrumbs } from './Breadcrumbs';

const ITEMS = [{ label: 'foo', to: '/foo' }, { label: 'bar', to: '/foo/bar' }, { label: 'baz' }];

describe('Breadcrumbs', () => {
  it('is a named nav with links and the current page last', () => {
    render(
      <MemoryRouter>
        <Breadcrumbs items={ITEMS} />
      </MemoryRouter>,
    );
    const nav = screen.getByRole('navigation', { name: 'פירורי לחם' });
    expect(nav.querySelectorAll('li')).toHaveLength(3);
    expect(screen.getByRole('link', { name: 'foo' })).toHaveAttribute('href', '/foo');
    expect(screen.getByText('baz')).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByRole('link', { name: 'baz' })).toBeNull();
  });

  it('puts a hidden separator between the items, not after the last', () => {
    const { container } = render(
      <MemoryRouter>
        <Breadcrumbs items={ITEMS.slice(1)} />
      </MemoryRouter>,
    );
    const icons = container.querySelectorAll('svg');
    expect(icons).toHaveLength(1);
    expect(icons[0]).toHaveAttribute('aria-hidden', 'true');
  });
});
