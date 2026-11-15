import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import Screen from '.';

describe('S04 כיתות וקבוצות לימוד', () => {
  it('מציג את רשימת הקבוצות בטעינה ראשונית', async () => {
    renderWithProviders(<Screen />);
    expect(await screen.findByText("הקבצה א' מתמטיקה")).toBeInTheDocument();
    expect(screen.getByText('חוג גמרא עיון')).toBeInTheDocument();
  });

  it('מציג את רשימת הכיתות בלחיצה על לשונית כיתות', async () => {
    renderWithProviders(<Screen />);
    await userEvent.click(await screen.findByRole('tab', { name: 'כיתות' }));
    expect(await screen.findByText('ז1')).toBeInTheDocument();
    expect(screen.getByText('נועם גולדשטיין')).toBeInTheDocument();
  });

  it('מוסיף קבוצה חדשה דרך המודל', async () => {
    renderWithProviders(<Screen />);
    await userEvent.click(await screen.findByRole('button', { name: 'הוספת קבוצה' }));
    await userEvent.type(screen.getByLabelText('שם הכיתה / קבוצה'), 'קבוצת חשבון');
    await userEvent.click(screen.getByRole('button', { name: 'שמור וצור' }));
    expect(await screen.findByText('קבוצת חשבון')).toBeInTheDocument();
  });

  it('פותח מודל שיוך תלמידים ומציג את חברי הקבוצה', async () => {
    renderWithProviders(<Screen />);
    const btn = await screen.findAllByRole('button', { name: 'שיוך תלמידים' });
    await userEvent.click(btn[0]);
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });
});
