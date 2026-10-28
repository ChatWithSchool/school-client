import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Screen from './index';

describe('G01 grades entry screen', () => {
  it('renders the grade entry header and updates the class average immediately', async () => {
    render(<Screen />);

    expect(screen.getByRole('heading', { name: 'הזנת ציונים ומשוב' })).toBeInTheDocument();
    expect(screen.getByText('ממוצע כיתתי')).toBeInTheDocument();

    const averageNode = screen.getByTestId('average-metric');
    expect(averageNode).toHaveTextContent('81.2');

    const gradeInput = screen.getByRole('textbox', { name: 'ציון עבור אורי כהן' });
    await userEvent.clear(gradeInput);
    await userEvent.type(gradeInput, '95');

    expect(averageNode).toHaveTextContent('83.4');
    expect(screen.getByRole('textbox', { name: 'הערה לתלמיד אורי כהן' })).toBeInTheDocument();
  });
});
