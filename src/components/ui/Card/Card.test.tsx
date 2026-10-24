import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Card } from './Card';

describe('Card', () => {
  it('is a plain div with the padding of its size', () => {
    render(
      <Card padding="M" data-testid="card">
        foo
      </Card>,
    );
    const card = screen.getByTestId('card');
    expect(card.tagName).toBe('DIV');
    expect(card).toHaveClass('p-4', 'rounded-lg');
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('an interactive card is a button that works with the keyboard', async () => {
    const onClick = vi.fn();
    render(
      <Card interactive onClick={onClick}>
        foo
      </Card>,
    );
    const card = screen.getByRole('button', { name: 'foo' });
    expect(card).toHaveClass('p-6');
    card.focus();
    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
