import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
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

  it('shows a loading skeleton before the data arrives', async () => {
    renderWithProviders(<Screen />, { token: MANAGER });
    expect(await screen.findByRole('status')).toBeInTheDocument();
    expect(await screen.findByText('רונית לוי')).toBeInTheDocument();
  });

  it('shows an error state with a retry button when the server fails', async () => {
    server.use(
      http.get('*/api/students/:id', () =>
        HttpResponse.json({ message: 'server error' }, { status: 500 }),
      ),
    );
    renderWithProviders(<Screen />, { token: MANAGER });
    expect(await screen.findByText(/לא הצלחנו לטעון/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'נסי שוב' })).toBeInTheDocument();
  });

  it('rejects an invalid email', async () => {
    renderWithProviders(<Screen />, { token: MANAGER });
    const email = await screen.findByRole('textbox', { name: /אימייל/ });
    await userEvent.type(email, 'not-an-email');
    await userEvent.click(screen.getByRole('button', { name: 'קשר' }));
    expect(await screen.findByText('כתובת האימייל אינה תקינה')).toBeInTheDocument();
  });

  it('links a parent who already has an account', async () => {
    renderWithProviders(<Screen />, { token: MANAGER });
    await screen.findByText('רונית לוי');
    const email = screen.getByRole('textbox', { name: /אימייל/ });
    await userEvent.type(email, 'amit.biton@school.example');
    await userEvent.click(screen.getByRole('button', { name: 'קשר' }));
    expect(await screen.findByText('עמית ביטון')).toBeInTheDocument();
  });

  it('invites a parent who has no account yet', async () => {
    renderWithProviders(<Screen />, { token: MANAGER });
    await screen.findByText('רונית לוי');
    const email = screen.getByRole('textbox', { name: /אימייל/ });
    await userEvent.type(email, 'new.parent@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'קשר' }));
    expect(await screen.findByText('ממתין להזמנה')).toBeInTheDocument();
  });

  it('does not link the same parent twice', async () => {
    renderWithProviders(<Screen />, { token: MANAGER });
    await screen.findByText('רונית לוי');
    const email = screen.getByRole('textbox', { name: /אימייל/ });
    await userEvent.type(email, 'ronit.levi@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'קשר' }));
    expect(await screen.findByText('ההורה עם האימייל הזה כבר מקושר לתלמיד')).toBeInTheDocument();
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
