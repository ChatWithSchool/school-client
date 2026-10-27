import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import Screen from '.';

const MANAGER = 'mock.yuval.mizrahi@school.example';
const SECRETARY = 'mock.or.barak@school.example';

describe('I03 institution settings screen', () => {
  it('shows the institution details to management', async () => {
    renderWithProviders(<Screen />, { token: MANAGER });
    expect(await screen.findByRole('heading', { name: 'פרטי המוסד והגדרות' })).toBeInTheDocument();
    expect(await screen.findByDisplayValue('בית ספר לדוגמה')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'שנת לימודים' })).toBeDisabled();
  });

  it('asks for a name before saving', async () => {
    renderWithProviders(<Screen />, { token: MANAGER });
    const name = await screen.findByRole('textbox', { name: /שם/ });
    await userEvent.clear(name);
    await userEvent.click(screen.getByRole('button', { name: 'שמור' }));
    expect(await screen.findByText('חובה למלא שם')).toBeInTheDocument();
  });

  it('shows "no permission" to the secretary', async () => {
    renderWithProviders(<Screen />, { token: SECRETARY });
    expect(await screen.findByText('אין לך הרשאה לצפות בעמוד זה')).toBeInTheDocument();
  });
});
