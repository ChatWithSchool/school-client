import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { renderWithProviders } from '../../test/utils';
import Substitutes from '.';

const MANAGER = 'mock.yuval.mizrahi@school.example';
const TEACHER = 'mock.mor.dahan@school.example';

describe('T03 substitutes screen', () => {
  it('shows available teachers and lessons without a teacher', async () => {
    renderWithProviders(<Substitutes />, { token: MANAGER });
    expect(await screen.findByText('דנה כהן')).toBeInTheDocument();
    expect(await screen.findByText('שיעור 3 · מתמטיקה')).toBeInTheDocument();
    expect(screen.getAllByText('מורה נעדר')).toHaveLength(2);
  });

  it('shows "no permission" to a teacher', async () => {
    renderWithProviders(<Substitutes />, { token: TEACHER });
    expect(await screen.findByText('אין לך הרשאה לצפות בעמוד זה')).toBeInTheDocument();
  });

  it('assigns a substitute and removes the lesson from the list', async () => {
    renderWithProviders(<Substitutes />, { token: MANAGER });
    await screen.findByText('שיעור 3 · מתמטיקה');
    const buttons = await screen.findAllByRole('button', { name: 'שבץ' });
    await userEvent.click(buttons[0]);
    expect(await screen.findByText(/השיבוץ של דנה כהן נשמר/)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText('שיעור 3 · מתמטיקה')).not.toBeInTheDocument());
  });

  it('hides the action column from a read-only user', async () => {
    // the same manager, but the server says the level on T03 is "read"
    server.use(
      http.get('*/api/auth/me', () =>
        HttpResponse.json({
          user: {
            id: 'u1',
            firstName: 'יובל',
            lastName: 'מזרחי',
            email: 'yuval.mizrahi@school.example',
            roles: ['management'],
          },
          permissions: { T03: 'read' },
          landing: 'T03',
        }),
      ),
    );
    renderWithProviders(<Substitutes />, { token: MANAGER });
    expect(await screen.findByText('דנה כהן')).toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: 'פעולה' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'שבץ' })).not.toBeInTheDocument();
  });
});
