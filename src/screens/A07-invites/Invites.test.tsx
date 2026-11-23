import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { delay, http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { shared } from '../../mocks/shared';
import { renderWithProviders } from '../../test/utils';
import InvitesScreen from '.';

const MANAGER = 'mock.yuval.mizrahi@school.example';
const PARENT = 'mock.amit.biton@school.example';
const LIOR = 'lior.peretz@school.example';
const render = () => renderWithProviders(<InvitesScreen />, { token: MANAGER });
const fail = (status: number, code: string) => () =>
  HttpResponse.json({ error: { code, message: code } }, { status });
const answer = (status: number, code: string) =>
  server.use(http.get('*/api/invites', fail(status, code), { once: true }));

async function sendInvite(email: string) {
  await userEvent.click(await screen.findByRole('tab', { name: 'הזמנה חדשה' }));
  await userEvent.type(screen.getByLabelText('אימייל *'), email);
  await userEvent.click(screen.getByRole('combobox', { name: 'תפקיד *' }));
  const options = await screen.findAllByRole('option');
  expect(options.map((o) => o.textContent)).toEqual(['מחנך/ת', 'מורה מקצועי', 'הורה']);
  await userEvent.click(options[0]);
  await userEvent.click(screen.getByRole('button', { name: 'שלח הזמנה' }));
}

async function confirm(button: string) {
  await userEvent.click(
    within(await screen.findByRole('dialog')).getByRole('button', { name: button }),
  );
}

describe('A07 invites', () => {
  it('הזמנה חדשה מופיעה בממתינות ותוכן המייל ביומן', async () => {
    render();
    expect(await screen.findByText(LIOR)).toBeInTheDocument();
    expect(screen.getAllByText('פגה').length).toBeGreaterThan(0);
    await sendInvite('new.teacher@school.example');
    const table = await screen.findByRole('table', { name: 'הזמנות ממתינות' });
    expect(await within(table).findByText('new.teacher@school.example')).toBeInTheDocument();
    expect(screen.getByText('אל: new.teacher@school.example')).toBeInTheDocument();
  });

  it('חוסם אימייל כפול, ומהטופס אפשר לשלוח שוב ולבטל', async () => {
    render();
    await screen.findByText(LIOR);
    await sendInvite(LIOR);
    expect(await screen.findByText(/כבר קיימת הזמנה ממתינה/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'שלח שוב' }));
    await confirm('שלח שוב');
    expect(await screen.findByText('ההזמנה נשלחה שוב')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'בטל הזמנה' }));
    await confirm('בטל הזמנה');
    await waitFor(() => expect(screen.getByRole('button', { name: 'בטל הזמנה' })).toBeDisabled());
  });

  it('שליחה חוזרת וביטול מתפריט השורה', async () => {
    render();
    await userEvent.click(await screen.findByRole('button', { name: `פעולות עבור ${LIOR}` }));
    await userEvent.click(await screen.findByRole('menuitem', { name: 'שלח שוב' }));
    await confirm('שלח שוב');
    expect(await screen.findByText(`אל: ${LIOR}`)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: `פעולות עבור ${LIOR}` }));
    await userEvent.click(await screen.findByRole('menuitem', { name: 'בטל הזמנה' }));
    await confirm('בטל הזמנה');
    await waitFor(() => expect(screen.queryByRole('cell', { name: LIOR })).not.toBeInTheDocument());
  });

  it('טעינה: שלד בטבלה', async () => {
    server.use(http.get('*/api/invites', () => delay('infinite')));
    render();
    expect(await screen.findByRole('table')).toHaveAttribute('aria-busy', 'true');
  });

  it('ריק: הסבר וכפתור שעובר לטופס', async () => {
    shared.invites = shared.invites.filter((i) => i.status !== 'pending');
    render();
    expect(await screen.findByText('אין הזמנות ממתינות.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'הזמנה חדשה' }));
    expect(await screen.findByLabelText('אימייל *')).toBeInTheDocument();
  });

  it('שגיאה: קוד תקלה ו"נסי שוב"; 403: אין הרשאה', async () => {
    answer(500, 'INTERNAL');
    const { unmount } = render();
    expect(await screen.findByText(/קוד תקלה: INTERNAL/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'נסי שוב' }));
    expect(await screen.findByText(LIOR)).toBeInTheDocument();
    unmount();
    answer(403, 'FORBIDDEN');
    render();
    expect(await screen.findByText('אין לך הרשאה לצפות בעמוד זה')).toBeInTheDocument();
  });

  it('שגיאה: אין חיבור לרשת', async () => {
    server.use(http.get('*/api/invites', () => HttpResponse.error()));
    render();
    expect(await screen.findByText(/קוד תקלה: FETCH_ERROR/)).toBeInTheDocument();
  });

  it('הרשאה: משתמש ללא A07 מקבל חסימה ולא שולח בקשת הזמנות', async () => {
    let invitesRequested = false;
    server.use(
      http.get('*/api/invites', () => {
        invitesRequested = true;
        return HttpResponse.json({ items: [], total: 0, page: 1, size: 25 });
      }),
    );
    renderWithProviders(<InvitesScreen />, { token: PARENT });
    expect(await screen.findByText('אין לך הרשאה לצפות בעמוד זה')).toBeInTheDocument();
    expect(invitesRequested).toBe(false);
  });
});
