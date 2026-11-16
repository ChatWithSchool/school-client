import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import Screen from '.';

describe('S10 פעולות קבוצתיות', () => {
  it('מציג את כותרת המסך ומספר התלמידים הנבחרים', () => {
    renderWithProviders(<Screen />);
    expect(screen.getByText('פעולות קבוצתיות')).toBeInTheDocument();
    expect(screen.getByText('נבחרו 3 תלמידים')).toBeInTheDocument();
  });

  it('פותח מודל שיוך לכיתה בלחיצה על הכפתור', async () => {
    renderWithProviders(<Screen />);
    await userEvent.click(screen.getByRole('button', { name: 'שיוך לכיתה / קבוצה' }));
    expect(await screen.findByText('בחר כיתה או קבוצה אליה יש לשייך את התלמידים הנבחרים')).toBeInTheDocument();
  });

  it('מציג סיכום תוצאות אחרי ביצוע פעולה', async () => {
    renderWithProviders(<Screen />);
    await userEvent.click(screen.getByRole('button', { name: 'שיוך לכיתה / קבוצה' }));
    await userEvent.click(await screen.findByRole('button', { name: 'אישור ושיוך' }));
    expect(await screen.findByText(/הפעולה הושלמה בהצלחה/)).toBeInTheDocument();
  });
});
