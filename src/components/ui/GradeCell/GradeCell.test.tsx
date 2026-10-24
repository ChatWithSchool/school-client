import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { GradeCell } from './GradeCell';

describe('GradeCell', () => {
  it('is a named number input with tabular digits; empty shows a dash', () => {
    const ref = createRef<HTMLInputElement>();
    render(<GradeCell ref={ref} label="foo" />);
    const input = screen.getByRole('textbox', { name: 'foo' });
    expect(input).toBe(ref.current);
    expect(input).toHaveClass('num');
    expect(input).toHaveAttribute('placeholder', '—');
    expect(input).toHaveAttribute('inputmode', 'decimal');
  });

  it('accepts typing', async () => {
    const onChange = vi.fn();
    render(<GradeCell label="foo" onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox'), '87');
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('error: invalid, described by the message', () => {
    render(<GradeCell label="foo" defaultValue="120" error="bar" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('bar');
  });

  it.each([
    ['saving', 'שומר'],
    ['saved', 'נשמר'],
  ] as const)('%s: a sign and a word', (state, word) => {
    const { container } = render(<GradeCell label="foo" defaultValue="87" state={state} />);
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription(word);
    expect(container.querySelector('svg')).not.toBeNull();
  });
});
