import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { renderWithProviders } from '../../../test/utils';
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

  it('error: invalid, described by the message, with a sign and a tooltip on focus', async () => {
    // the error tooltip needs the TooltipProvider
    const { container } = renderWithProviders(
      <GradeCell label="foo" defaultValue="120" error="bar" />,
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('bar');
    expect(container.querySelector('.text-danger-700 svg')).not.toBeNull();
    expect(screen.queryByRole('tooltip')).toBeNull();
    await userEvent.click(input);
    expect(await screen.findByRole('tooltip')).toHaveTextContent('bar');
    expect(input).toHaveFocus();
  });

  it('announces saving and then saved in a polite live region', () => {
    const { rerender } = render(<GradeCell label="foo" defaultValue="87" />);
    const region = document.querySelector('[aria-live="polite"]');
    expect(region).toBeEmptyDOMElement();
    rerender(<GradeCell label="foo" defaultValue="87" state="saving" />);
    expect(region).toHaveTextContent('שומר');
    rerender(<GradeCell label="foo" defaultValue="87" state="saved" />);
    // the same node: the region stays mounted and only its text changes
    expect(document.querySelector('[aria-live="polite"]')).toBe(region);
    expect(region).toHaveTextContent('נשמר');
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
