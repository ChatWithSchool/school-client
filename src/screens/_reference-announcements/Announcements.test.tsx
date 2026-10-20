import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import ReferenceAnnouncements from '.';

const MANAGER = 'mock.yuval.mizrahi@school.example';
const TEACHER = 'mock.mor.dahan@school.example';
const PARENT = 'mock.amit.biton@school.example';

describe('reference announcements screen', () => {
  it('lists the announcements and lets management add one', async () => {
    renderWithProviders(<ReferenceAnnouncements />, { token: MANAGER });
    expect(await screen.findByText('ברוכים הבאים לשנת הלימודים')).toBeInTheDocument();
    await userEvent.type(await screen.findByLabelText('כותרת'), 'ישיבת צוות');
    await userEvent.type(screen.getByLabelText('תוכן'), 'מחר בשעה 8');
    await userEvent.click(screen.getByRole('button', { name: 'פרסום' }));
    expect(await screen.findByText('ישיבת צוות')).toBeInTheDocument();
  });

  it('shows field errors from the server for an empty form', async () => {
    renderWithProviders(<ReferenceAnnouncements />, { token: MANAGER });
    await userEvent.click(await screen.findByRole('button', { name: 'פרסום' }));
    expect(await screen.findByText('חובה כותרת (לפחות 2 תווים)')).toBeInTheDocument();
    expect(screen.getByText('חובה תוכן')).toBeInTheDocument();
  });

  it('hides the form from a read-only teacher', async () => {
    renderWithProviders(<ReferenceAnnouncements />, { token: TEACHER });
    expect(await screen.findByText('עדכון מערכת שעות')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'פרסום' })).not.toBeInTheDocument();
  });

  it('marks an announcement as read', async () => {
    renderWithProviders(<ReferenceAnnouncements />, { token: TEACHER });
    const item = (await screen.findByText('עדכון מערכת שעות')).closest('li')!;
    await userEvent.click(within(item).getByRole('button', { name: 'סימון כנקרא' }));
    await within(item).findByText('עדכון מערכת שעות');
    expect(within(item).queryByRole('button', { name: 'סימון כנקרא' })).not.toBeInTheDocument();
  });

  it('shows "no permission" to a parent', async () => {
    renderWithProviders(<ReferenceAnnouncements />, { token: PARENT });
    expect(await screen.findByText('אין לך הרשאה לצפות בעמוד זה')).toBeInTheDocument();
  });
});
