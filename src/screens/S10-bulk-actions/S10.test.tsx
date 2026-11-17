import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Screen from './index';

describe('S10 bulk actions screen', () => {
  it('shows the selection count and available actions', () => {
    render(<Screen />);

    expect(screen.getByRole('heading', { name: 'פעולות קבוצתיות' })).toBeInTheDocument();
    expect(screen.getByText(/נבחרו 3 תלמידים/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'שיוך לכיתה / קבוצה' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'הוספת תגית' })).toBeEnabled();
    expect(screen.getByRole('button', { name: /ייצוא נבחרים/ })).toBeDisabled();
  });

  it('selects all filtered results and updates the count', async () => {
    const user = userEvent.setup();
    render(<Screen />);

    await user.click(screen.getByRole('button', { name: 'בחירת כל התוצאות המסוננות' }));

    expect(screen.getByText(/נבחרו 120 תלמידים/)).toBeInTheDocument();
    expect(screen.getByText(/מכלל התוצאות המסוננות/)).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'בחירת כל התוצאות המסוננות' }),
    ).not.toBeInTheDocument();
  });

  it('confirms a class assignment and displays the result summary', async () => {
    const user = userEvent.setup();
    render(<Screen />);

    await user.click(screen.getByRole('button', { name: 'שיוך לכיתה / קבוצה' }));
    const dialog = screen.getByRole('dialog', { name: 'שיוך לכיתה / קבוצה' });
    expect(dialog).toHaveAccessibleDescription(
      'בחר יעד לשיוך עבור 3 התלמידים הנבחרים',
    );

    await user.click(within(dialog).getByRole('combobox', { name: 'בחירת כיתה' }));
    await user.click(await screen.findByRole('option', { name: 'י"א 1' }));
    await user.click(within(dialog).getByRole('button', { name: 'אישור ושיוך' }));

    const summary = await screen.findByRole('status');
    expect(summary).toHaveTextContent(
      'הפעולה הושלמה: 3 תלמידים עודכנו בהצלחה, 0 נכשלו.',
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the tag action with the selected-student count', async () => {
    const user = userEvent.setup();
    render(<Screen />);

    await user.click(screen.getByRole('button', { name: 'הוספת תגית' }));

    expect(screen.getByRole('dialog', { name: 'הוספת תגית' })).toHaveAccessibleDescription(
      'בחר תגית להוספה עבור 3 התלמידים הנבחרים',
    );
    expect(screen.getByRole('combobox', { name: 'בחירת תגית' })).toBeInTheDocument();
  });
});
