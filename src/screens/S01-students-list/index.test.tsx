import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Screen from './index';

describe('S01 students list', () => {
  it('renders the screen header, search and table', () => {
    render(<Screen />);

    expect(screen.getByRole('heading', { name: 'תלמידים' })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'חיפוש תלמיד' })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'רשימת תלמידים' })).toBeInTheDocument();
  });

  it('has a primary add button, row selection and tag filter controls', async () => {
    render(<Screen />);

    const addButton = screen.getByRole('button', { name: 'תלמיד חדש' });
    expect(addButton).toHaveClass('bg-primary-600');

    const rowCheckbox = screen.getByRole('checkbox', { name: 'בחירת נוי לוי' });
    await userEvent.click(rowCheckbox);
    expect(rowCheckbox).toHaveAttribute('aria-checked', 'true');

    expect(screen.getByRole('combobox', { name: 'תגית' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'שכבה' })).toBeInTheDocument();
  });
});
