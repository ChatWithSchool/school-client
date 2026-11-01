import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes, useLocation } from 'react-router-dom';
import { shared } from '../../mocks/shared';
import { renderWithProviders } from '../../test/utils';
import MySubjects from '.';

const TEACHER = 'mock.mor.dahan@school.example'; // English in ז1, ז2 and ח1
const MANAGER = 'mock.yuval.mizrahi@school.example';

function Where() {
  const { pathname, search } = useLocation();
  return <p>{`${pathname}${search}`}</p>;
}

function setup(token: string) {
  return renderWithProviders(
    <Routes>
      <Route path="/grades/g08" element={<MySubjects />} />
      <Route path="*" element={<Where />} />
    </Routes>,
    { route: '/grades/g08', token },
  );
}

describe('G08 my subjects', () => {
  it('shows one block for each class and subject of the teacher', async () => {
    setup(TEACHER);
    const h1 = await screen.findByRole('region', { name: 'ח1 · אנגלית' });
    expect(within(h1).getByText('מבחנים פתוחים').nextSibling).toHaveTextContent('1');
    expect(within(h1).getByText('תלמידים ללא ציון').nextSibling).toHaveTextContent('2');
    expect(screen.getByRole('region', { name: 'ז1 · אנגלית' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'ז2 · אנגלית' })).toBeInTheDocument();
  });

  it('keeps the class and subject when a shortcut is used', async () => {
    setup(TEACHER);
    const h1 = await screen.findByRole('region', { name: 'ח1 · אנגלית' });
    await userEvent.click(within(h1).getByRole('button', { name: 'הזנת ציונים' }));
    expect(
      await screen.findByText('/grades/g01?classId=cls-h1&subjectId=sub-eng'),
    ).toBeInTheDocument();
  });

  it('says so when the teacher has no classes', async () => {
    shared.teachingAssignments = [];
    setup(TEACHER);
    expect(await screen.findByText('עוד לא שויכת לכיתה')).toBeInTheDocument();
  });

  it('shows "no permission" to a role without the screen', async () => {
    setup(MANAGER);
    expect(await screen.findByText('אין לך הרשאה לצפות בעמוד זה')).toBeInTheDocument();
  });
});
