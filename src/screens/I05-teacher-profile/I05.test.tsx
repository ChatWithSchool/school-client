import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import TeacherProfileScreen from './index';

describe('I05 - Teacher Profile Screen', () => {
  it('renders the teacher profile screen and main tabs successfully', () => {
    render(
      <BrowserRouter>
        <TeacherProfileScreen />
      </BrowserRouter>
    );
    
    // בדיקה שהכותרת הראשית והטאבים מופיעים במסך בהצלחה
    expect(screen.getByText(/פרופיל מורה/i)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /פרטים/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /מקצועות וכיתות/i })).toBeInTheDocument();
  });
});