import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import StudentListPage from './index';

describe('S01 רשימת תלמידים', () => {
  it('מציג את רשימת התלמידים', async () => {
    renderWithProviders(<StudentListPage />);
    expect(await screen.findByText('נועם ביטון')).toBeInTheDocument();
    expect(screen.getByText('יובל קליין')).toBeInTheDocument();
  });

  it('מסנן תלמידים לפי חיפוש', async () => {
    renderWithProviders(<StudentListPage />);
    await screen.findByText('נועם ביטון');
    await userEvent.type(screen.getByRole('searchbox', { name: 'חיפוש תלמיד' }), 'עדי');
    expect(screen.getByText('עדי פרץ')).toBeInTheDocument();
    expect(screen.queryByText('נועם ביטון')).not.toBeInTheDocument();
  });

  it('מציג מצב ריק כשאין תוצאות', async () => {
    renderWithProviders(<StudentListPage />);
    const input = await screen.findByRole('searchbox', { name: 'חיפוש תלמיד' });
    await userEvent.type(input, 'xyzxyz');
    expect(await screen.findByText('לא נמצאו תלמידים מתאימים')).toBeInTheDocument();
  });
});
