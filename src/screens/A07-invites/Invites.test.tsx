import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import InvitesScreen from '.';

const MANAGER = 'mock.yuval.mizrahi@school.example';

describe('A07 invites', () => {
  it('מציג את לשונית הממתינות כברירת מחדל', async () => {
    renderWithProviders(<InvitesScreen />, { token: MANAGER });
    expect(await screen.findByText('הזמנות ממתינות')).toBeInTheDocument();
  });

  it('עובר ללשונית הזמנה חדשה בלחיצה', async () => {
    renderWithProviders(<InvitesScreen />, { token: MANAGER });
    await userEvent.click(await screen.findByRole('tab', { name: 'הזמנה חדשה' }));
    expect(await screen.findByLabelText('אימייל *')).toBeInTheDocument();
  });

  it('מציג שורות ממתינות עם תגיות תפקיד', async () => {
    renderWithProviders(<InvitesScreen />, { token: MANAGER });
    expect(await screen.findByText('flor.perez@school.example')).toBeInTheDocument();
    expect(await screen.findByText('מחנך/ת')).toBeInTheDocument();
  });

  it('מציג "פגה" באדום להזמנה שפג תוקפה', async () => {
    renderWithProviders(<InvitesScreen />, { token: MANAGER });
    const expired = await screen.findAllByText('פגה');
    expect(expired.length).toBeGreaterThan(0);
  });
});
