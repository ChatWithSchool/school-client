import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import Screen from './index';

describe('S07 student transfer screen', () => {
  it('shows the transfer form and confirms the new class after submit', async () => {
    const user = userEvent.setup();

    renderWithProviders(<Screen />);

    expect(screen.getByRole('heading', { name: /העברת תלמיד בין כיתות/i })).toBeInTheDocument();
    expect(screen.getByText('כיתה נוכחית')).toBeInTheDocument();
    expect(screen.getByText('כיתה חדשה')).toBeInTheDocument();
    expect(screen.getByText('תאריך תחולה')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /אשר העברה/i }));

    expect(screen.getByText(/העברה נקלטה/i)).toBeInTheDocument();
    expect(screen.getByText(/כיתה חדשה:/i)).toBeInTheDocument();
    expect(screen.getAllByText(/א׳ 1/i).length).toBeGreaterThan(0);
  });
});
