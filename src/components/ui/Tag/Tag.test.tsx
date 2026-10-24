import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tag } from './Tag';

describe('Tag', () => {
  it('without onRemove is a plain tag', () => {
    render(<Tag label="foo" />);
    expect(screen.getByText('foo')).toHaveClass('rounded-full', 'bg-subtle');
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('removable: a named x button that calls onRemove', async () => {
    const onRemove = vi.fn();
    render(<Tag label="foo" onRemove={onRemove} />);
    await userEvent.click(screen.getByRole('button', { name: 'הסרת foo' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
