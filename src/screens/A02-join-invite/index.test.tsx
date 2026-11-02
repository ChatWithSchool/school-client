import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import JoinInviteScreen from '.';

describe('A02 join-invite', () => {
  it('shows a validation error when password is too short', async () => {
    renderWithProviders(<JoinInviteScreen />);
    await userEvent.type(screen.getByLabelText(/שם פרטי/), 'ישראל');
    await userEvent.type(screen.getByLabelText(/שם משפחה/), 'ישראלי');
    await userEvent.type(screen.getByLabelText(/סיסמה עם מד חוזק/), '123');
    await userEvent.type(screen.getByLabelText(/אימות סיסמה/), '123');
    await userEvent.click(screen.getByRole('button', { name: 'יצירת חשבון' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('הסיסמה חלשה מדי');
  });

  it('shows an error when passwords do not match', async () => {
    renderWithProviders(<JoinInviteScreen />);
    await userEvent.type(screen.getByLabelText(/שם פרטי/), 'ישראל');
    await userEvent.type(screen.getByLabelText(/שם משפחה/), 'ישראלי');
    await userEvent.type(screen.getByLabelText(/סיסמה עם מד חוזק/), 'Abcdef1!');
    await userEvent.type(screen.getByLabelText(/אימות סיסמה/), 'different');
    await userEvent.click(screen.getByRole('button', { name: 'יצירת חשבון' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('הסיסמאות אינן תואמות');
  });
});
