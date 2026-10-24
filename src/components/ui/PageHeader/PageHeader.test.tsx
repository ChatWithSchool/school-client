import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Button } from '../Button/Button';
import { PageHeader } from './PageHeader';

describe('PageHeader', () => {
  it('has the one h1 of the page and a subtitle', () => {
    render(<PageHeader title="foo" subtitle="bar" />);
    expect(screen.getByRole('heading', { level: 1, name: 'foo' })).toBeInTheDocument();
    expect(screen.getByText('bar')).toBeInTheDocument();
    expect(screen.queryByRole('navigation')).toBeNull();
  });

  it('shows the breadcrumbs and the actions in order', () => {
    render(
      <MemoryRouter>
        <PageHeader
          title="foo"
          breadcrumbs={[{ label: 'bar', to: '/bar' }, { label: 'foo' }]}
          actions={
            <>
              <Button>baz</Button>
              <Button variant="secondary">qux</Button>
            </>
          }
        />
      </MemoryRouter>,
    );
    expect(screen.getByRole('navigation', { name: 'פירורי לחם' })).toBeInTheDocument();
    expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual(['baz', 'qux']);
  });
});
