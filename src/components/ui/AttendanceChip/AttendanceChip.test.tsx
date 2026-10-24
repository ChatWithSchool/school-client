import { render, screen } from '@testing-library/react';
import { AttendanceChip } from './AttendanceChip';

describe('AttendanceChip', () => {
  it.each([
    ['present', 'נוכח', 'bg-success-50'],
    ['absent', 'נעדר', 'bg-danger-50'],
    ['late', 'איחור', 'bg-warning-50'],
    ['excused', 'מאושר', 'bg-info-50'],
    ['unreported', 'לא דווח', 'bg-subtle'],
  ] as const)('%s: word, color and icon', (status, word, tone) => {
    const { container } = render(<AttendanceChip status={status} />);
    expect(screen.getByText(word)).toHaveClass(tone);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('takes a custom word and the S size', () => {
    render(<AttendanceChip status="late" size="S" label="foo" />);
    expect(screen.getByText('foo')).toHaveClass('text-label');
  });
});
