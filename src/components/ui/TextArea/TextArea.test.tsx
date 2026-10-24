import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { TextArea } from './TextArea';

describe('TextArea', () => {
  it('links the label, sets the rows and forwards the ref', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<TextArea ref={ref} label="foo" rows={5} />);
    const box = screen.getByLabelText('foo');
    expect(box).toBe(ref.current);
    expect(box).toHaveAttribute('rows', '5');
  });

  it('defaults to 3 rows', () => {
    render(<TextArea label="foo" />);
    expect(screen.getByLabelText('foo')).toHaveAttribute('rows', '3');
  });

  it('marks an error as invalid and describes it', () => {
    render(<TextArea label="foo" error="bar" />);
    const box = screen.getByLabelText('foo');
    expect(box).toHaveAttribute('aria-invalid', 'true');
    expect(box).toHaveAccessibleDescription('bar');
  });

  it('passes disabled through', () => {
    render(<TextArea label="foo" disabled />);
    expect(screen.getByLabelText('foo')).toBeDisabled();
  });
});
