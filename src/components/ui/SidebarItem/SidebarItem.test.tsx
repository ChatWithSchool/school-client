import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { SidebarItem } from './SidebarItem';

const renderItem = (ui: ReactNode) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('SidebarItem', () => {
  it('is a link named by its label; active sets aria-current', () => {
    renderItem(<SidebarItem to="/foo" icon="home" label="foo" active />);
    const link = screen.getByRole('link', { name: 'foo' });
    expect(link).toHaveAttribute('href', '/foo');
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveClass('bg-primary-50');
  });

  it('shows a count badge', () => {
    renderItem(<SidebarItem to="/foo" icon="home" label="foo" badge={3} />);
    expect(screen.getByRole('link')).toHaveTextContent('3 חדשים');
    expect(screen.getByRole('link')).not.toHaveAttribute('aria-current');
  });

  it('collapsed: the icon only, still named, the badge as a dot', () => {
    const { container } = renderItem(
      <SidebarItem to="/foo" icon="home" label="foo" collapsed badge={2} />,
    );
    expect(screen.getByRole('link', { name: /foo/ })).toHaveClass('w-10');
    expect(container.querySelector('.bg-accent-400')).not.toBeNull();
  });
});
