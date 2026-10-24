import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { TextField } from './TextField';

describe('TextField', () => {
  it('links the label to the input and forwards the ref', () => {
    const ref = createRef<HTMLInputElement>();
    render(<TextField ref={ref} label="foo" />);
    expect(screen.getByLabelText('foo')).toBe(ref.current);
  });

  it('describes the input by the hint and marks an error as invalid', () => {
    render(<TextField label="foo" hint="bar" error="baz" />);
    const input = screen.getByLabelText('foo');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('bar baz');
  });

  it('is not invalid without an error', () => {
    render(<TextField label="foo" />);
    expect(screen.getByLabelText('foo')).not.toHaveAttribute('aria-invalid');
  });

  it('keeps an aria-describedby from the screen', () => {
    render(
      <>
        <p id="extra">qux</p>
        <TextField label="foo" hint="bar" aria-describedby="extra" />
      </>,
    );
    expect(screen.getByLabelText('foo')).toHaveAccessibleDescription('qux bar');
  });

  it('passes native props and accepts typing', async () => {
    const onChange = vi.fn();
    render(<TextField label="foo" name="bar" required onChange={onChange} />);
    const input = screen.getByLabelText(/foo/);
    expect(input).toHaveAttribute('name', 'bar');
    expect(input).toBeRequired();
    await userEvent.type(input, 'ab');
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('shows a prefix text and supports disabled and read-only', () => {
    const { rerender } = render(<TextField label="foo" prefix={{ text: 'bar' }} disabled />);
    expect(screen.getByText('bar')).toBeInTheDocument();
    expect(screen.getByLabelText('foo')).toBeDisabled();
    rerender(<TextField label="foo" readOnly />);
    expect(screen.getByLabelText('foo')).toHaveAttribute('readonly');
  });
});
