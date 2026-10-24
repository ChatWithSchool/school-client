import { render, screen } from '@testing-library/react';
import { Stepper } from './Stepper';

describe('Stepper', () => {
  it('marks done, current and upcoming steps', () => {
    render(<Stepper steps={['foo', 'bar', 'baz']} current={2} />);
    const list = screen.getByRole('list', { name: 'שלבים' });
    expect(list).toBeInTheDocument();
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('foo, הושלם');
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[1]).toHaveTextContent('2bar, שלב נוכחי');
    expect(items[2]).toHaveTextContent('3baz, בהמשך');
    expect(items[0].querySelector('svg')).not.toBeNull();
  });
});
