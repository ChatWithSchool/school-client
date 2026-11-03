import { render, screen } from '@testing-library/react';
import Screen from './index';

describe('I07 events calendar screen', () => {
  it('renders the calendar title and event controls', () => {
    render(<Screen />);

    expect(screen.getByRole('heading', { name: 'יומן בית ספרי' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'הוספת אירוע' })).toBeInTheDocument();
    expect(screen.getByText('מקרא סוגי אירועים')).toBeInTheDocument();
  });
});
