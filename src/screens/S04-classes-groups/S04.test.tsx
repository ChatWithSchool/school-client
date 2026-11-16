import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Screen from './index';

function renderScreen(search = '') {
  window.history.replaceState({}, '', `/students/s04${search}`);
  return render(<Screen />);
}

describe('S04 classes and groups screen', () => {
  it('shows the study groups by default, including their class and student counts', () => {
    renderScreen();

    expect(screen.getByRole('heading', { name: 'כיתות וקבוצות לימוד' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'קבוצות לימוד' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    const groupsTable = screen.getByRole('table', { name: 'קבוצות לימוד' });
    expect(within(groupsTable).getByText("הקבצה א' מתמטיקה")).toBeInTheDocument();
    expect(within(groupsTable).getByText('חוצת-כיתה')).toBeInTheDocument();
    expect(within(groupsTable).getAllByText('2')).toHaveLength(1);
  });

  it('switches to classes and keeps the selected tab in the URL', async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByRole('tab', { name: 'כיתות' }));

    expect(screen.getByRole('tab', { name: 'כיתות' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(window.location.search).toBe('?tab=classes');
    const classesTable = screen.getByRole('table', { name: 'כיתות' });
    expect(within(classesTable).getByText('ז1')).toBeInTheDocument();
    expect(within(classesTable).getByText('נועם גולדשטיין')).toBeInTheDocument();
  });

  it('keeps the creation form open when the group name is missing, then creates the group', async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByRole('button', { name: 'הוספת קבוצה' }));
    const dialog = screen.getByRole('dialog', { name: 'יצירת קבוצת לימוד חדשה' });
    await user.click(within(dialog).getByRole('button', { name: 'שמור וצור' }));
    expect(await within(dialog).findByText('נא להזין שם')).toBeInTheDocument();

    await user.type(within(dialog).getByRole('textbox', { name: 'שם הקבוצה' }), 'קבוצת בדיקה');
    await user.click(within(dialog).getByRole('button', { name: 'שמור וצור' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    expect(
      await within(screen.getByRole('table', { name: 'קבוצות לימוד' })).findByText(
        'קבוצת בדיקה',
      ),
    ).toBeInTheDocument();
  });

  it('adds and removes a student and updates the group count', async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getAllByRole('button', { name: 'שיוך תלמידים' })[0]);
    const dialog = screen.getByRole('dialog', {
      name: "שיוך תלמידים – הקבצה א' מתמטיקה",
    });

    await user.type(within(dialog).getByRole('searchbox', { name: 'הוספת תלמיד' }), 'אורי');
    await user.click(await screen.findByRole('option', { name: 'אורי שפירא (ח1)' }));
    expect(within(dialog).getByText('אורי שפירא')).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: 'סגור' }));
    const groupsTable = screen.getByRole('table', { name: 'קבוצות לימוד' });
    expect(within(groupsTable).getByText('3')).toBeInTheDocument();

    await user.click(screen.getAllByRole('button', { name: 'שיוך תלמידים' })[0]);
    const reopenedDialog = screen.getByRole('dialog', {
      name: "שיוך תלמידים – הקבצה א' מתמטיקה",
    });
    const studentRow = within(reopenedDialog).getByText('אורי שפירא').closest('li');
    expect(studentRow).not.toBeNull();
    await user.click(within(studentRow!).getByRole('button', { name: 'הסרה' }));

    expect(within(reopenedDialog).queryByText('אורי שפירא')).not.toBeInTheDocument();
    await user.click(within(reopenedDialog).getByRole('button', { name: 'סגור' }));
    expect(within(groupsTable).getByText('2')).toBeInTheDocument();
  });

  it('shows each member’s class in the cross-class group', async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getAllByRole('button', { name: 'שיוך תלמידים' })[1]);
    const dialog = screen.getByRole('dialog', { name: 'שיוך תלמידים – חוג גמרא עיון' });

    expect(within(dialog).getByText('אורי שפירא')).toBeInTheDocument();
    expect(within(dialog).getByText('ח1')).toBeInTheDocument();
  });
});
