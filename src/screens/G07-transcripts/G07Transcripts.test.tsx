import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import G07Transcripts from '.';

const MANAGER = 'mock.yuval.mizrahi@school.example';
const PARENT = 'mock.amit.biton@school.example';

describe('G07 transcripts screen', () => {
  it('shows the screen title', async () => {
    renderWithProviders(<G07Transcripts />, { token: MANAGER });
    expect(await screen.findByText('הפקת תעודות')).toBeInTheDocument();
  });

  it('shows a transcript preview after selecting a student', async () => {
    renderWithProviders(<G07Transcripts />, { token: MANAGER });
    await screen.findByText('הפקת תעודות');
    await userEvent.click(screen.getByRole('combobox', { name: /כיתה או תלמיד/i }));
    await userEvent.click(await screen.findByText(/נועם/));
    expect(await screen.findByText('בית ספר לדוגמה')).toBeInTheDocument();
  });

  it('shows missing grades alert when a student has missing scores', async () => {
    renderWithProviders(<G07Transcripts />, { token: MANAGER });
    await screen.findByText('הפקת תעודות');
    // stu-20 is in class ח1 and has a missing grade in math
    await userEvent.click(screen.getByRole('combobox', { name: /כיתה או תלמיד/i }));
    await userEvent.click(await screen.findByText(/עמית/));
    expect(await screen.findByText(/בדיקות לפני הפקה/)).toBeInTheDocument();
  });

  it('shows no permission to a parent', async () => {
    renderWithProviders(<G07Transcripts />, { token: PARENT });
    expect(await screen.findByText('אין לך הרשאה לצפות בעמוד זה')).toBeInTheDocument();
  });
});
