import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import Screen from '.';

const MANAGER = 'mock.yuval.mizrahi@school.example';
const SECRETARY = 'mock.or.barak@school.example';
const PARENT = 'mock.amit.biton@school.example';

describe('A08 parent link screen', () => {
  it('lists the linked parents for management and the secretary', async () => {
    renderWithProviders(<Screen />, { token: SECRETARY });
    expect(await screen.findByText('רונית לוי')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'קשר' })).toBeInTheDocument();
  });

  it('rejects an invalid email', async () => {
    renderWithProviders(<Screen />, { token: MANAGER });
    const email = await screen.findByRole('textbox', { name: /אימייל/ });
    await userEvent.type(email, 'not-an-email');
    await userEvent.click(screen.getByRole('button', { name: 'קשר' }));
    expect(await screen.findByText('כתובת האימייל אינה תקינה')).toBeInTheDocument();
  });

  it('removes a link after confirmation', async () => {
    renderWithProviders(<Screen />, { token: MANAGER });
    await userEvent.click(await screen.findByRole('button', { name: 'הסרת קישור' }));
    const dialog = await screen.findByRole('dialog');
    await userEvent.click(within(dialog).getByRole('button', { name: 'הסר קישור' }));
    await waitFor(() => expect(screen.queryByText('רונית לוי')).not.toBeInTheDocument());
  });

  it('shows "no permission" to a parent', async () => {
    renderWithProviders(<Screen />, { token: PARENT });
    expect(await screen.findByText('אין לך הרשאה לצפות בעמוד זה')).toBeInTheDocument();
  });
});
