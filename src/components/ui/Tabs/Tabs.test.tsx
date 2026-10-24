import { DirectionProvider } from '@radix-ui/react-direction';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { Tabs, type TabItem } from './Tabs';

const ITEMS: TabItem[] = [
  { value: 'foo', label: 'Foo', content: 'foo panel' },
  { value: 'bar', label: 'Bar', content: 'bar panel' },
  { value: 'baz', label: 'Baz', content: 'baz panel', disabled: true },
];

function Search() {
  return <p data-testid="search">{useLocation().search}</p>;
}

function inRoute(url: string) {
  return render(
    <DirectionProvider dir="rtl">
      <MemoryRouter initialEntries={[url]}>
        <Tabs label="qux" items={ITEMS} />
        <Search />
      </MemoryRouter>
    </DirectionProvider>,
  );
}

describe('Tabs', () => {
  it('is a named tablist; the first tab is active by default', () => {
    render(<Tabs label="qux" items={ITEMS} />);
    expect(screen.getByRole('tablist', { name: 'qux' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Foo' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('foo panel');
    expect(screen.getByRole('tab', { name: 'Baz' })).toBeDisabled();
  });

  it('in a route, reads and writes ?tab=', async () => {
    inRoute('/x?tab=bar');
    expect(screen.getByRole('tab', { name: 'Bar' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(screen.getByRole('tab', { name: 'Foo' }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('foo panel');
    expect(screen.getByTestId('search')).toHaveTextContent('?tab=foo');
  });

  it('ignores an unknown or disabled ?tab= value', () => {
    inRoute('/x?tab=baz');
    expect(screen.getByRole('tab', { name: 'Foo' })).toHaveAttribute('aria-selected', 'true');
  });

  it('moves with the arrow keys, mirrored in RTL', async () => {
    inRoute('/x');
    await userEvent.tab();
    expect(screen.getByRole('tab', { name: 'Foo' })).toHaveFocus();
    // in RTL the left arrow goes to the next tab
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'Bar' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Bar' })).toHaveAttribute('aria-selected', 'true');
  });

  it('keeps the value out of the URL with syncUrl={false}', async () => {
    render(
      <MemoryRouter initialEntries={['/x']}>
        <Tabs label="qux" items={ITEMS} syncUrl={false} />
        <Search />
      </MemoryRouter>,
    );
    await userEvent.click(screen.getByRole('tab', { name: 'Bar' }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('bar panel');
    expect(screen.getByTestId('search')).toBeEmptyDOMElement();
  });

  it('two tab sets on one screen keep their own param', async () => {
    render(
      <MemoryRouter initialEntries={['/x?view=bar']}>
        <Tabs label="qux" items={ITEMS} />
        <Tabs label="quux" items={ITEMS} param="view" />
        <Search />
      </MemoryRouter>,
    );
    const [first, second] = screen.getAllByRole('tablist');
    expect(within(second).getByRole('tab', { name: 'Bar' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await userEvent.click(within(first).getByRole('tab', { name: 'Bar' }));
    expect(screen.getByTestId('search')).toHaveTextContent('?view=bar&tab=bar');
  });

  it('a tab without content has no aria-controls', () => {
    render(
      <Tabs
        label="qux"
        items={[
          { value: 'foo', label: 'Foo', content: 'foo panel' },
          { value: 'bar', label: 'Bar' },
        ]}
      />,
    );
    expect(screen.getByRole('tab', { name: 'Foo' })).toHaveAttribute('aria-controls');
    expect(screen.getByRole('tab', { name: 'Bar' })).not.toHaveAttribute('aria-controls');
  });
});
