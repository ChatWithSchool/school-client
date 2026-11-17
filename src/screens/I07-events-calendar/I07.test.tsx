import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import Screen from './index';

describe('I07 events calendar', () => {
  it('renders the v1-lite list and hides the monthly calendar concept', async () => {
    renderWithProviders(<Screen />);

    expect(screen.getByRole('heading', { name: /יומן בית ספרי/i })).toBeInTheDocument();
    expect(screen.getByText('אסיפת הורים')).toBeInTheDocument();
    expect(screen.queryByText(/תצוגת לוח חודשי/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /הוספת אירוע/i })).toBeInTheDocument();
  });

  it('opens the event form for managers and allows adding an event', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Screen />);

    await user.click(screen.getByRole('button', { name: /הוספת אירוע/i }));

    expect(screen.getByRole('heading', { name: /הוספת אירוע/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /כותרת/i })).toBeInTheDocument();

    await user.type(screen.getByRole('textbox', { name: /כותרת/i }), 'שיעור פתוח');
    await user.click(screen.getByRole('combobox', { name: /סוג אירוע/i }));
    await user.click(screen.getByRole('option', { name: 'אירוע' }));
    await user.type(screen.getByLabelText(/תאריך התחלה/i), '2026-12-02');
    await user.type(screen.getByLabelText(/תאריך סיום/i), '2026-12-02');
    await user.click(screen.getByRole('button', { name: /שמירה/i }));

    expect(await screen.findByText('שיעור פתוח')).toBeInTheDocument();
  });
});
