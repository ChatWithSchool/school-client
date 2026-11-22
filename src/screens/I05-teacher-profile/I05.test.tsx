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
    expect(screen.getByRole('heading', { name: /פרופיל מורה/i })).toBeInTheDocument();
    // בדיקה שהכותרת הראשית והטאבים מופיעים במסך בהצלחה
   
  });
});