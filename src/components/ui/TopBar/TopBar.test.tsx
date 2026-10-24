import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TopBar } from './TopBar';

describe('TopBar', () => {
  it('is the banner with the title, the search and the actions', () => {
    render(
      <TopBar
        title="foo"
        search={<input aria-label="bar" />}
        actions={<button type="button">baz</button>}
      />,
    );
    const bar = screen.getByRole('banner');
    expect(bar).toHaveClass('h-16');
    expect(bar).toHaveTextContent('foo');
    expect(screen.getByRole('textbox', { name: 'bar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'baz' })).toBeInTheDocument();
  });

  it('mobile: 56 high, a menu button, no search', async () => {
    const onMenuClick = vi.fn();
    render(
      <TopBar
        variant="mobile"
        title="foo"
        search={<input aria-label="bar" />}
        onMenuClick={onMenuClick}
      />,
    );
    expect(screen.getByRole('banner')).toHaveClass('h-14');
    expect(screen.queryByRole('textbox')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'תפריט' }));
    expect(onMenuClick).toHaveBeenCalledTimes(1);
  });
});
