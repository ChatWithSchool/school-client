import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { Route, Routes, useLocation } from 'react-router-dom';
import { server } from '../../mocks/server';
import { pathFor } from '../../routes/screens';
import { renderWithProviders } from '../../test/utils';
import JoinInviteScreen from '.';

const Landed = () => <p>landed at {useLocation().pathname}</p>;

const open = (token: string) =>
  renderWithProviders(
    <Routes>
      <Route path="/join/:token" element={<JoinInviteScreen />} />
      <Route path="*" element={<Landed />} />
    </Routes>,
    { route: `/join/${token}` },
  );

async function fill(password: string, confirm = password) {
  await userEvent.type(await screen.findByLabelText(/שם פרטי/), 'ישראל');
  await userEvent.type(screen.getByLabelText(/שם משפחה/), 'ישראלי');
  await userEvent.type(screen.getByLabelText(/סיסמה עם מד חוזק/), password);
  await userEvent.type(screen.getByLabelText(/אימות סיסמה/), confirm);
  await userEvent.click(screen.getByRole('button', { name: 'יצירת חשבון' }));
}

describe('A02 join-invite', () => {
  it('a valid link shows the invite details and the form', async () => {
    open('demo-teacher');
    expect(await screen.findByText('אימייל: new.teacher@school.example')).toBeInTheDocument();
    expect(screen.getByText('תפקיד: מורה מקצועי')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'יצירת חשבון' })).toBeInTheDocument();
  });

  it('blocks a weak password and says what is missing', async () => {
    open('demo-teacher');
    await fill('abc');
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'הסיסמה חלשה מדי. חסר בה: לפחות 8 תווים, ספרה.',
    );
  });

  it('shows an error when passwords do not match', async () => {
    open('demo-teacher');
    await fill('Abcdef12', 'different1');
    expect(await screen.findByRole('alert')).toHaveTextContent('הסיסמאות אינן תואמות');
  });

  it('a valid password creates the account, signs in and goes to the home of the role', async () => {
    const { store } = open('demo-teacher');
    await fill('Abcdef12');
    expect(await screen.findByText(`landed at ${pathFor('T06')}`)).toBeInTheDocument();
    expect(store.getState().auth.token).toBe('mock.new.teacher@school.example');
  });

  it('an expired link shows a screen of its own that asks for a new invite', async () => {
    open('demo-expired');
    expect(await screen.findByText('קישור ההזמנה פג תוקף')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'יצירת חשבון' })).not.toBeInTheDocument();
  });

  it('a load error shows the X02 error with a code and retry', async () => {
    server.use(
      http.get(
        '*/api/invites/:token',
        () => HttpResponse.json({ error: { code: 'INTERNAL', message: 'x' } }, { status: 500 }),
        { once: true },
      ),
    );
    open('demo-teacher');
    expect(await screen.findByText(/קוד תקלה: INTERNAL/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'נסי שוב' }));
    expect(await screen.findByText('אימייל: new.teacher@school.example')).toBeInTheDocument();
  });
});
