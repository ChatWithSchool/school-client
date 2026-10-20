import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { renderWithProviders } from '../../test/utils';
import Login from '.';

function setup() {
  return renderWithProviders(
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<p>דף הבית</p>} />
      <Route path="/students/s01" element={<p>רשימת תלמידים</p>} />
    </Routes>,
    { route: '/login' },
  );
}

describe('A01 login', () => {
  it('signs in and goes to the landing screen of the role', async () => {
    const { store } = setup();
    await userEvent.type(screen.getByLabelText('אימייל'), 'yuval.mizrahi@school.example');
    await userEvent.type(screen.getByLabelText('סיסמה'), 'Demo1234!');
    await userEvent.click(screen.getByRole('button', { name: 'כניסה' }));
    expect(await screen.findByText('דף הבית')).toBeInTheDocument();
    expect(store.getState().auth.token).toBe('mock.yuval.mizrahi@school.example');
  });

  it('routes a secretary to the students list', async () => {
    setup();
    await userEvent.type(screen.getByLabelText('אימייל'), 'or.barak@school.example');
    await userEvent.type(screen.getByLabelText('סיסמה'), 'Demo1234!');
    await userEvent.click(screen.getByRole('button', { name: 'כניסה' }));
    expect(await screen.findByText('רשימת תלמידים')).toBeInTheDocument();
  });

  it('shows the server error for a wrong password and does not sign in', async () => {
    const { store } = setup();
    await userEvent.type(screen.getByLabelText('אימייל'), 'yuval.mizrahi@school.example');
    await userEvent.type(screen.getByLabelText('סיסמה'), 'wrong');
    await userEvent.click(screen.getByRole('button', { name: 'כניסה' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('האימייל או הסיסמה שגויים');
    await waitFor(() => expect(store.getState().auth.token).toBeNull());
  });
});
