import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, vi } from 'vitest';
import Screen from './index';

const { getMeMock, permissionMock } = vi.hoisted(() => ({
  getMeMock: vi.fn(),
  permissionMock: vi.fn(),
}));

vi.mock('../../api/authApi', () => ({ useGetMeQuery: getMeMock }));
vi.mock('../../features/auth/usePermission', () => ({
  usePermission: permissionMock,
  canWrite: (level: string | undefined) => level === 'full' || level === 'scoped',
}));

function renderScreen() {
  render(<Screen />);
}

beforeEach(() => {
  getMeMock.mockReturnValue({
    data: { permissions: { S10: 'full' } },
    isError: false,
    isLoading: false,
    refetch: vi.fn(),
  });
  permissionMock.mockReturnValue('full');
});

describe('S10 bulk actions screen', () => {
  it('shows the selection count and available actions', async () => {
    await renderScreen();

    expect(screen.getByRole('heading', { name: 'פעולות קבוצתיות' })).toBeInTheDocument();
    expect(screen.getByText(/נבחרו 3 תלמידים/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'שיוך לכיתה / קבוצה' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'הוספת תגית' })).toBeEnabled();
    expect(screen.getByRole('button', { name: /ייצוא נבחרים/ })).toBeDisabled();
  });

  it('selects all filtered results and updates the count', async () => {
    const user = userEvent.setup();
    await renderScreen();

    await user.click(screen.getByRole('button', { name: 'בחירת כל התוצאות המסוננות' }));

    expect(screen.getByText(/נבחרו 120 תלמידים/)).toBeInTheDocument();
    expect(screen.getByText(/התוצאות המסוננות/)).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'בחירת כל התוצאות המסוננות' }),
    ).not.toBeInTheDocument();
  });

  it('confirms a class assignment and displays the result summary', async () => {
    const user = userEvent.setup();
    await renderScreen();

    await user.click(screen.getByRole('button', { name: 'שיוך לכיתה / קבוצה' }));
    const dialog = screen.getByRole('dialog', { name: 'שיוך לכיתה / קבוצה' });
    expect(dialog).toHaveAccessibleDescription('בחר יעד לשיוך עבור 3 התלמידים הנבחרים');

    await user.click(within(dialog).getByRole('combobox', { name: 'בחירת כיתה' }));
    await user.click(await screen.findByRole('option', { name: 'י"א 1' }));
    await user.click(within(dialog).getByRole('button', { name: 'אישור ושיוך' }));

    expect(await screen.findByText(/3 תלמידים עודכנו בהצלחה, 0 נכשלו/)).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the tag action with the selected-student count', async () => {
    const user = userEvent.setup();
    await renderScreen();

    await user.click(screen.getByRole('button', { name: 'הוספת תגית' }));

    expect(screen.getByRole('dialog', { name: 'הוספת תגית' })).toHaveAccessibleDescription(
      'בחר תגית להוספה עבור 3 התלמידים הנבחרים',
    );
    expect(screen.getByRole('combobox', { name: 'בחירת תגית' })).toBeInTheDocument();
  });

  it('shows a validation error and keeps the class dialog open when confirming without a selection', async () => {
    const user = userEvent.setup();
    await renderScreen();

    await user.click(screen.getByRole('button', { name: 'שיוך לכיתה / קבוצה' }));
    const dialog = screen.getByRole('dialog', { name: 'שיוך לכיתה / קבוצה' });
    await user.click(within(dialog).getByRole('button', { name: 'אישור ושיוך' }));

    expect(within(dialog).getByText('יש לבחור כיתה')).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'שיוך לכיתה / קבוצה' })).toBeInTheDocument();
    expect(screen.queryByText(/עודכנו בהצלחה/)).not.toBeInTheDocument();
  });

  it('shows a validation error and keeps the tag dialog open when confirming without a selection', async () => {
    const user = userEvent.setup();
    await renderScreen();

    await user.click(screen.getByRole('button', { name: 'הוספת תגית' }));
    const dialog = screen.getByRole('dialog', { name: 'הוספת תגית' });
    await user.click(within(dialog).getByRole('button', { name: 'אישור והוספה' }));

    expect(within(dialog).getByText('יש לבחור תגית')).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'הוספת תגית' })).toBeInTheDocument();
    expect(screen.queryByText(/עודכנו בהצלחה/)).not.toBeInTheDocument();
  });

  it('shows an action summary in the dialog after choosing a class', async () => {
    const user = userEvent.setup();
    await renderScreen();

    await user.click(screen.getByRole('button', { name: 'שיוך לכיתה / קבוצה' }));
    const dialog = screen.getByRole('dialog', { name: 'שיוך לכיתה / קבוצה' });

    await user.click(within(dialog).getByRole('combobox', { name: 'בחירת כיתה' }));
    await user.click(await screen.findByRole('option', { name: 'י"א 1' }));

    expect(within(dialog).getByText('שיוך 3 תלמידים לכיתה י"א 1')).toBeInTheDocument();
  });
});
