import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { renderWithProviders } from '../../test/utils';
import Screen from './index';

const renderCard = (route: string) =>
  renderWithProviders(
    <Routes>
      <Route path="/students/s03/:id" element={<Screen />} />
    </Routes>,
    { route },
  );

describe('S03 student card', () => {
  it('shows the header, the three summary cards and the details tab first', () => {
    renderCard('/students/s03/st-1');

    expect(screen.getByRole('heading', { name: 'אור שפירא', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('נוכחות החודש')).toBeInTheDocument();
    expect(screen.getByText('ממוצע ציונים')).toBeInTheDocument();
    expect(screen.getByText('הערות פתוחות')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'פרטים', selected: true })).toBeInTheDocument();
    expect(screen.getByText('פרטים אישיים')).toBeInTheDocument();
    expect(screen.getByText(/5 היעדרויות מתוך 10/)).toBeInTheDocument();
  });

  it('opens the behavior notes tab (S06 inside S03) only when asked', async () => {
    const user = userEvent.setup();
    renderCard('/students/s03/st-1');

    expect(screen.queryByRole('columnheader', { name: 'נראה להורה' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: 'הערות התנהגות' }));
    expect(screen.getByRole('columnheader', { name: 'נראה להורה' })).toBeInTheDocument();
  });

  it('S03.3: the add button opens the new-note form inside the tab', async () => {
    const user = userEvent.setup();
    renderCard('/students/s03/st-1?tab=notes');

    expect(screen.queryByLabelText(/תיאור/)).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'הוספת הערה' }));
    expect(screen.getByLabelText(/תיאור/)).toBeInTheDocument();
  });

  it('S03.1: the attendance tab shows the totals and the breakdown table', () => {
    renderCard('/students/s03/st-1?tab=attendance');

    expect(screen.getByText('אחוז נוכחות')).toBeInTheDocument();
    expect(screen.getByText('ימי היעדרות')).toBeInTheDocument();
    expect(screen.getByText('פירוט')).toBeInTheDocument();
    expect(screen.getByText('איחור של 10 דקות')).toBeInTheDocument();
  });

  it('S03.2: the grades tab shows the grades by subject and the teachers feedback', () => {
    renderCard('/students/s03/st-1?tab=grades');

    expect(screen.getByText('ציונים לפי מקצוע')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'מגמה' })).toBeInTheDocument();
    expect(screen.getByText('משוב מורים')).toBeInTheDocument();
  });

  it('opens the tab from ?tab=', () => {
    renderCard('/students/s03/st-1?tab=grades');
    expect(screen.getByRole('tab', { name: 'ציונים', selected: true })).toBeInTheDocument();
  });

  it('shows not-found for an unknown student', () => {
    renderCard('/students/s03/unknown');
    expect(screen.getByText('העמוד לא נמצא')).toBeInTheDocument();
  });
});
