import { screen } from '@testing-library/react';
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
});