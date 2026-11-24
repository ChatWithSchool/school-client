import { screen, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { shared } from '../../mocks/shared';
import { server } from '../../mocks/server';
import { renderWithProviders } from '../../test/utils';
import Screen from './index';

const MANAGER = 'mock.yuval.mizrahi@school.example';
const PARENT = 'mock.amit.biton@school.example';

describe('G03 grade history screen', () => {
  const originalHistory = [...shared.gradeHistory];

  afterEach(() => {
    shared.gradeHistory.splice(0, shared.gradeHistory.length, ...originalHistory);
  });

  it('renders the grade history title and rows with author information', async () => {
    renderWithProviders(<Screen />, { token: MANAGER });

    expect(screen.getByRole('heading', { name: 'היסטוריית שינויי ציון' })).toBeInTheDocument();

    const updatedRow = await screen.findByRole('row', { name: /85/ });
    expect(within(updatedRow).getByText('עמית כהן')).toBeInTheDocument();
    expect(within(updatedRow).getByText('78')).toBeInTheDocument();
    expect(within(updatedRow).getByText('85')).toBeInTheDocument();
  });

  it('shows an empty state when the grade has no history', async () => {
    shared.gradeHistory.splice(0);
    renderWithProviders(<Screen />, { token: MANAGER });

    expect(await screen.findByText('אין נתוני היסטוריה להצגה.')).toBeInTheDocument();
  });


    it('shows an error state when the server fails', async () => {
    server.use(http.get('*/grades/:gradeId/history', () => new HttpResponse(null, { status: 500 })));
    renderWithProviders(<Screen />, { token: MANAGER });

    expect(await screen.findByText('לא ניתן לטעון את ההיסטוריה.')).toBeInTheDocument();
  });


  it('shows a forbidden state when the user has no permission', async () => {
    renderWithProviders(<Screen />, { token: PARENT });

    expect(await screen.findByText('אין לך הרשאה לצפות בעמוד זה')).toBeInTheDocument();
  });
});
