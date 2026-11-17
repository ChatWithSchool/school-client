import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TimetableEditScreen from './index';
describe('TimetableEditScreen (T02)', () => {
  test('renders timetable edit screen and main title', () => {
    render(
      <BrowserRouter>
        <TimetableEditScreen />
      </BrowserRouter>
    );

    // בדיקה שהכותרת הראשית של המסך מופיעה
    expect(screen.getByRole('heading', { name: /עריכת מערכת שעות/i })).toBeInTheDocument();
  });

  test('renders lesson form fields correctly', () => {
    render(
      <BrowserRouter>
        <TimetableEditScreen />
      </BrowserRouter>
    );

    // בדיקה ששדה חלון שיעור והכפתורים קיימים במסך
    expect(screen.getByText('חלון שיעור')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /שמירת שיעור/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /פרסום/i })).toBeInTheDocument();
  });
});