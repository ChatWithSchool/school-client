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

  it('the arrow keys move the focus only (mirrored in RTL); Space and Enter choose', async () => {
    const onValueChange = vi.fn();
    render(
      <DirectionProvider dir="rtl">
        <AttendanceToggle label="foo" value="present" onValueChange={onValueChange} />
      </DirectionProvider>,
    );
    // Tab enters the group on the chosen status
    await userEvent.tab();
    expect(screen.getByRole('radio', { name: 'נוכח' })).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('radio', { name: 'נעדר' })).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('radio', { name: 'איחור' })).toHaveFocus();
    // no intermediate value was sent on the way
    expect(onValueChange).not.toHaveBeenCalled();
    await userEvent.keyboard(' ');
    expect(onValueChange).toHaveBeenLastCalledWith('late');
    await userEvent.keyboard('{ArrowRight}');
    await userEvent.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith('absent');
    expect(onValueChange).toHaveBeenCalledTimes(2);
  });

  it('stays usable while saving', async () => {
    const onValueChange = vi.fn();
    render(
      <AttendanceToggle label="foo" value="late" onValueChange={onValueChange} state="saving" />,
    );
    await userEvent.click(screen.getByRole('radio', { name: 'נוכח' }));
    expect(onValueChange).toHaveBeenCalledWith('present');
  });

  it('size L is the 48 touch target', () => {
    render(<AttendanceToggle label="foo" value="none" onValueChange={() => {}} size="L" />);
    expect(screen.getByRole('radio', { name: 'נוכח' })).toHaveClass('h-12');
  });

  it('saving is busy; error is invalid with a visible message that describes the group', () => {
    const { rerender } = render(
      <AttendanceToggle label="foo" value="late" onValueChange={() => {}} state="saving" />,
    );
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('img', { name: 'שומר' })).toBeInTheDocument();
    rerender(<AttendanceToggle label="foo" value="late" onValueChange={() => {}} state="error" />);
    const group = screen.getByRole('radiogroup');
    expect(group).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('השמירה נכשלה');
    expect(group).toHaveAccessibleDescription('השמירה נכשלה');
  });
});
