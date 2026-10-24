import { DirectionProvider } from '@radix-ui/react-direction';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { AttendanceToggle, type AttendanceValue } from './AttendanceToggle';

function Live({ initial = 'none' as AttendanceValue }) {
  const [value, setValue] = useState<AttendanceValue>(initial);
  return (
    <DirectionProvider dir="rtl">
      <AttendanceToggle label="foo" value={value} onValueChange={setValue} />
    </DirectionProvider>
  );
}

describe('AttendanceToggle', () => {
  it('is a radio group named by the student, present first, none chosen', () => {
    render(<Live />);
    const group = screen.getByRole('radiogroup', { name: 'foo' });
    const radios = screen.getAllByRole('radio');
    expect(group).toBeInTheDocument();
    expect(radios.map((r) => r.textContent)).toEqual(['נוכח', 'נעדר', 'איחור']);
    expect(radios.every((r) => r.getAttribute('aria-checked') === 'false')).toBe(true);
  });

  it('chooses with a click; the chosen one has its status color', async () => {
    render(<Live />);
    await userEvent.click(screen.getByRole('radio', { name: 'נעדר' }));
    expect(screen.getByRole('radio', { name: 'נעדר' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'נעדר' })).toHaveClass('bg-danger-50');
  });

  it('moves with the arrow keys (mirrored in RTL) and Space chooses', async () => {
    render(<Live initial="present" />);
    screen.getByRole('radio', { name: 'נוכח' }).focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('radio', { name: 'נעדר' })).toHaveFocus();
    await userEvent.keyboard(' ');
    expect(screen.getByRole('radio', { name: 'נעדר' })).toHaveAttribute('aria-checked', 'true');
  });

  it('size L is the 48 touch target', () => {
    render(<AttendanceToggle label="foo" value="none" onValueChange={() => {}} size="L" />);
    expect(screen.getByRole('radio', { name: 'נוכח' })).toHaveClass('h-12');
  });

  it('saving is busy; error is invalid with a named sign', () => {
    const { rerender } = render(
      <AttendanceToggle label="foo" value="late" onValueChange={() => {}} state="saving" />,
    );
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('img', { name: 'שומר' })).toBeInTheDocument();
    rerender(<AttendanceToggle label="foo" value="late" onValueChange={() => {}} state="error" />);
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('img', { name: 'השמירה נכשלה' })).toBeInTheDocument();
  });
});
