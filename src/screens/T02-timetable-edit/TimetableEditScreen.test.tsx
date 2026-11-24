import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import TimetableEditScreen from './index';
import {
  DAYS,
  HOURS,
  INITIAL_LESSONS,
  SUBJECT_OPTIONS,
  CLASS_OPTIONS,
  TEACHER_OPTIONS,
  ROOM_OPTIONS,
} from '../../mocks/timetableData'

// ה-Select של Radix צריך כמה פונקציות שחסרות ב-jsdom
beforeAll(() => {
  window.HTMLElement.prototype.hasPointerCapture = () => false;
  window.HTMLElement.prototype.releasePointerCapture = () => {};
  window.HTMLElement.prototype.scrollIntoView = () => {};
  window.ResizeObserver =
    window.ResizeObserver ||
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
});

const renderScreen = () =>
  render(
    <BrowserRouter>
      <TimetableEditScreen />
    </BrowserRouter>
  );

// ---------- עזרים ----------
const existing = INITIAL_LESSONS[0];

type Option = { value: string; label: string };

// ערך שונה מהקיים, כדי שרק סוג אחד של התנגשות יופעל בכל בדיקה
const otherThan = (options: Option[], current: string) =>
  options.find((o) => o.value !== current)!.value;

const labelOf = (options: Option[], value: string) =>
  options.find((o) => o.value === value)!.label;

interface FormValues {
  subject: string;
  className: string;
  teacher: string;
  room: string;
  day: string;
  hour: number;
}

// בחירה ב-Select של Radix: לוחצים על ה-combobox ואז על האפשרות
async function choose(
  user: ReturnType<typeof userEvent.setup>,
  field: RegExp,
  optionLabel: string
) {
  await user.click(screen.getByRole('combobox', { name: field }));
  await user.click(await screen.findByRole('option', { name: optionLabel }));
}

async function fillAndSave(values: FormValues) {
  const user = userEvent.setup();
  await choose(user, /מקצוע/, labelOf(SUBJECT_OPTIONS, values.subject));
  await choose(user, /כיתה/, labelOf(CLASS_OPTIONS, values.className));
  await choose(user, /מורה/, labelOf(TEACHER_OPTIONS, values.teacher));
  await choose(user, /חדר/, labelOf(ROOM_OPTIONS, values.room));
  await choose(user, /יום/, DAYS.find((d) => d === values.day)!);
  await choose(user, /שעה/, HOURS.find((h) => h.id === values.hour)!.label);
  await user.click(screen.getByRole('button', { name: 'שמירת שיעור' }));
}

const base = (): FormValues => ({
  subject: SUBJECT_OPTIONS[0].value,
  className: otherThan(CLASS_OPTIONS, existing.className),
  teacher: otherThan(TEACHER_OPTIONS, existing.teacher),
  room: otherThan(ROOM_OPTIONS, existing.room),
  day: existing.day,
  hour: Number(existing.hour),
});

// ---------- בדיקות ----------
describe('TimetableEditScreen (T02)', () => {
  test('renders timetable edit screen and main title', () => {
    renderScreen();
    expect(screen.getByRole('heading', { name: /עריכת מערכת שעות/i })).toBeInTheDocument();
  });

  test('renders lesson form fields correctly', () => {
    renderScreen();
    expect(screen.getByText('חלון שיעור')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /שמירת שיעור/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /פרסום/i })).toBeInTheDocument();
  });

  test('publish button is disabled until it is connected to an action', () => {
    renderScreen();
    expect(screen.getByRole('button', { name: /פרסום/i })).toBeDisabled();
  });

  test('shows a validation error when required fields are missing', async () => {
    renderScreen();
    await userEvent.click(screen.getByRole('button', { name: 'שמירת שיעור' }));
    expect(screen.getByRole('alert')).toHaveTextContent('נא למלא את כל שדות החובה');
  });

  test('detects a room conflict', async () => {
    renderScreen();
    await fillAndSave({ ...base(), room: existing.room });
    expect(screen.getByRole('alert')).toHaveTextContent('התנגשות חדר');
  });

  test('detects a teacher conflict', async () => {
    renderScreen();
    await fillAndSave({ ...base(), teacher: existing.teacher });
    expect(screen.getByRole('alert')).toHaveTextContent('התנגשות מורה');
  });

  test('detects a class conflict', async () => {
    renderScreen();
    await fillAndSave({ ...base(), className: existing.className });
    expect(screen.getByRole('alert')).toHaveTextContent('התנגשות כיתה');
  });

  test('saves a valid lesson without showing an error', async () => {
    renderScreen();
    // משבצת פנויה: שעה אחרת באותו יום
    const freeHour = Number(existing.hour) === 7 ? 6 : Number(existing.hour) + 1;
    await fillAndSave({ ...base(), hour: freeHour });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
