import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';
import Screen from './index';

describe('G03 grade history screen', () => {
  it('renders the grade history title and rows with author information', async () => {
    renderWithProviders(<Screen />, { token: 'test-token' });

    expect(screen.getByRole('heading', { name: 'היסטוריית שינויי ציון' })).toBeInTheDocument();

    expect(await screen.findByText('עמית כהן')).toBeInTheDocument();
    expect(screen.getByText('78')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
  });
});
