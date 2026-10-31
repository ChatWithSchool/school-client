import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import Screen from './index';

describe('S06 behavior notes screen', () => {
  it('shows the list with its columns and the new-note form', () => {
    renderWithProviders(<Screen />, { route: '/students/s06?student=st-1' });

    expect(screen.getByRole('heading', { name: 'הערות התנהגות' })).toBeInTheDocument();
    for (const name of ['תאריך', 'סוג', 'חומרה', 'נכתב ע"י', 'נראה להורה']) {
      expect(screen.getByRole('columnheader', { name })).toBeInTheDocument();
    }
    expect(screen.getAllByRole('row').length).toBeGreaterThan(1);
    expect(screen.getByLabelText(/סוג/)).toBeInTheDocument();
    expect(screen.getByLabelText(/תיאור/)).toBeInTheDocument();
  });

  it('the add button moves focus to the form', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Screen />, { route: '/students/s06?student=st-1' });

    await user.click(screen.getByRole('button', { name: 'הוספת הערה' }));
    expect(screen.getByLabelText(/סוג/)).toHaveFocus();
  });

  it('blocks an empty note and explains why', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Screen />, { route: '/students/s06?student=st-1' });

    await user.click(screen.getByRole('button', { name: 'שמירת הערה' }));
    expect(screen.getByText('יש לבחור סוג הערה')).toBeInTheDocument();
    expect(screen.getByText('יש למלא תיאור')).toBeInTheDocument();
  });

  it('shows the empty state for a student without notes', () => {
    renderWithProviders(<Screen />, { route: '/students/s06?student=st-2' });
    expect(screen.getByText('עוד לא נרשמו הערות התנהגות')).toBeInTheDocument();
  });
});
