import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LessonBlock } from './LessonBlock';

describe('LessonBlock', () => {
  it('is a button with the subject, the meta and the tone', async () => {
    const onClick = vi.fn();
    render(<LessonBlock subject="foo" meta="bar · 4" tone="c3" onClick={onClick} />);
    const block = screen.getByRole('button', { name: 'foo bar · 4' });
    expect(block).toHaveClass('bg-chart-c3/10', 'border-chart-c3');
    expect(block).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(block);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['substitute', 'ממלא מקום'],
    ['cancelled', 'בוטל'],
    ['conflict', 'התנגשות'],
  ] as const)('%s shows a sign and a word', (state, word) => {
    const { container } = render(<LessonBlock subject="foo" state={state} />);
    expect(screen.getByRole('button')).toHaveTextContent(word);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('cancelled strikes the subject; selected is pressed with a ring', () => {
    const { rerender } = render(<LessonBlock subject="foo" state="cancelled" />);
    expect(screen.getByText('foo')).toHaveClass('line-through');
    rerender(<LessonBlock subject="foo" selected />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button')).toHaveClass('ring-2');
  });
});
