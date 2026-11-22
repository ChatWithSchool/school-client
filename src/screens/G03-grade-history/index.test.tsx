import { screen } from '@testing-library/react';
import { shared } from '../../mocks/shared';
import { renderWithProviders } from '../../test/utils';
import Screen from './index';

const MANAGER = 'mock.yuval.mizrahi@school.example';
const PARENT = 'mock.amit.biton@school.example';

describe('G03 grade history screen', () => {
  it('renders the grade history title and rows with author information', async () => {
    renderWithProviders(<Screen />, { token: MANAGER });

    expect(screen.getByRole('heading', { name: 'היסטוריית שינויי ציון' })).toBeInTheDocument();

    expect(await screen.findByText('עמית כהן')).toBeInTheDocument();
    expect(screen.getByText('78')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
  });

  it('shows an empty state when the grade has no history', async () => {
    shared.gradeHistory.splice(0);
    renderWithProviders(<Screen />, { token: MANAGER });

    expect(await screen.findByText('אין נתוני היסטוריה להצגה.')).toBeInTheDocument();
  });

  it('shows a forbidden state when the user has no permission', async () => {
    renderWithProviders(<Screen />, { token: PARENT });

    expect(await screen.findByText('אין לך הרשאה לצפות בעמוד זה')).toBeInTheDocument();
  });
});
