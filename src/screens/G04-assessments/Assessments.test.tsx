import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes, useLocation } from 'react-router-dom';
import { shared } from '../../mocks/shared';
import { renderWithProviders } from '../../test/utils';
import Assessments from '.';

const TEACHER = 'mock.mor.dahan@school.example'; // English in ז1, ז2 and ח1
const MANAGER = 'mock.yuval.mizrahi@school.example';
const PARENT = 'mock.amit.biton@school.example';

function Where() {
  const { pathname, search } = useLocation();
  return <p>{`${pathname}${search}`}</p>;
}

function setup(token: string, route = '/grades/g04') {
  return renderWithProviders(
    <Routes>
      <Route path="/grades/g04" element={<Assessments />} />
      <Route path="*" element={<Where />} />
    </Routes>,
    { route, token },
  );
}

const rowOf = async (title: string) =>
  (await screen.findByText(title)).closest('tr') as HTMLElement;

async function choose(label: RegExp, option: string) {
  await userEvent.click(screen.getByRole('combobox', { name: label }));
  await userEvent.click(await screen.findByRole('option', { name: option }));
}

describe('G04 assessments', () => {
  it('lists only the assessments of the teacher, with the graded count of the class', async () => {
    setup(TEACHER);
    const row = await rowOf('בוחן אוצר מילים');
    const h1 = shared.students.filter((s) => s.classId === 'cls-h1').length;
    expect(within(row).getByText('בוחן')).toBeInTheDocument();
    expect(within(row).getByText('21.10')).toBeInTheDocument();
    expect(within(row).getByText('10%')).toBeInTheDocument();
    expect(await within(row).findByText(`${h1 - 2}/${h1}`)).toBeInTheDocument();
    expect(screen.getByText('מבחן אמצע')).toBeInTheDocument();
    expect(screen.queryByText('מבחן בשברים')).not.toBeInTheDocument();
  });

  it('warns when the weights of a class and subject do not add up to 100', async () => {
    setup(TEACHER);
    expect(await screen.findByText('סכום המשקלים צריך להיות 100%')).toBeInTheDocument();
    expect(await screen.findByText(/ח1 · אנגלית: כרגע/)).toBeInTheDocument();
  });

  it('creates an assessment that is ready for grades at once', async () => {
    setup(TEACHER, '/grades/g04?classId=cls-h1&subjectId=sub-eng');
    // the class and subject chosen in G08 ("מבחן חדש")
    const classBox = await screen.findByRole('combobox', { name: /כיתה \/ קבוצה/ });
    await waitFor(() => expect(classBox).toHaveTextContent('ח1'));
    expect(screen.getByRole('combobox', { name: /מקצוע/ })).toHaveTextContent('אנגלית');
    await userEvent.type(screen.getByLabelText(/^שם/), 'מבחן סוף פרק');
    await choose(/^סוג/, 'מבחן');
    await userEvent.type(screen.getByLabelText('משקל %'), '90');
    await userEvent.click(screen.getByRole('button', { name: 'יצירה' }));

    expect(await screen.findByText('מבחן סוף פרק')).toBeInTheDocument();
    // 10 + 90: ח1 English is no longer in the warning
    await waitFor(() => expect(screen.queryByText(/ח1 · אנגלית: כרגע/)).not.toBeInTheDocument());
    const created = shared.assessments.find((a) => a.title === 'מבחן סוף פרק')!;
    expect(shared.grades.filter((g) => g.assessmentId === created.id).length).toBeGreaterThan(0);

    await userEvent.click(screen.getByRole('button', { name: 'להזנת ציונים' }));
    expect(
      await screen.findByText(
        `/grades/g01?classId=cls-h1&subjectId=sub-eng&assessmentId=${created.id}`,
      ),
    ).toBeInTheDocument();
  });

  it('checks the required fields before sending', async () => {
    setup(TEACHER);
    await screen.findByText('מבחן אמצע');
    await userEvent.click(screen.getByRole('button', { name: 'יצירה' }));
    expect(screen.getByText('חובה לבחור כיתה')).toBeInTheDocument();
    expect(screen.getByText('חובה שם (לפחות 2 תווים)')).toBeInTheDocument();
    expect(screen.getByText('חובה לבחור סוג')).toBeInTheDocument();
    expect(screen.getByText('חובה לבחור מקצוע')).toBeInTheDocument();
  });

  it('edits an assessment from its row', async () => {
    setup(TEACHER);
    await userEvent.click(await rowOf('מבחן אמצע'));
    expect(screen.getByRole('heading', { name: 'עריכה' })).toBeInTheDocument();
    const weight = screen.getByLabelText('משקל %');
    expect(weight).toHaveValue('30');
    await userEvent.clear(weight);
    await userEvent.type(weight, '45');
    await userEvent.click(screen.getByRole('button', { name: 'שמירת שינויים' }));
    expect(await within(await rowOf('מבחן אמצע')).findByText('45%')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'יצירה' })).toBeInTheDocument();
  });

  it('shows management all the assessments, without the form', async () => {
    setup(MANAGER);
    expect(await screen.findByText('מבחן בשברים')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'יצירת חדש' })).not.toBeInTheDocument();
  });

  it('shows "no permission" to a role without the screen', async () => {
    setup(PARENT);
    expect(await screen.findByText('אין לך הרשאה לצפות בעמוד זה')).toBeInTheDocument();
  });
});
