import { render, screen } from '@testing-library/react';
import Screen from './index';

describe('G03 grade history screen', () => {
  it('renders the grade history title and rows with author information', () => {
    render(<Screen />);

    expect(screen.getByRole('heading', { name: 'היסטוריית שינויי ציון' })).toBeInTheDocument();
    expect(screen.getByText('היסטוריה')).toBeInTheDocument();
    expect(screen.getByText('אורלי כהן')).toBeInTheDocument();
    expect(screen.getByText('78')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
  });
});
