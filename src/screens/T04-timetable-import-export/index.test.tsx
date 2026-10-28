import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Screen from './index';

describe('T04 timetable import/export screen', () => {
  it('renders the page and validates an uploaded file', async () => {
    render(
      <MemoryRouter>
        <Screen />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'ייבוא וייצוא מערכת שעות' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'הורדת תבנית' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ייצוא נוכחי' })).toBeInTheDocument();

    const file = new File(['lesson,day'], 'timetable.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(input, file);

    expect(await screen.findByText('timetable.xlsx')).toBeInTheDocument();
    expect(await screen.findByText('שיבוץ כפול של המורה בח2')).toBeInTheDocument();
    expect(screen.getByText('שגיאת בחירת חדר')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ייבוא תקינות' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'ייבוא תקינות' }));
    expect(await screen.findByText('נוצרה טיוטה לבדיקה')).toBeInTheDocument();
  });
});
