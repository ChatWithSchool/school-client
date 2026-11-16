import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, vi } from 'vitest';
import { renderWithProviders } from '../../test/utils';
import type { Lesson, Me } from '../../api/types';
import { useGetMeQuery } from '../../api/authApi';
import { useListLessonsQuery } from '../../api/lessonsApi';
import { downloadLessonsCsv, lessonsToCsv } from './csv';
import Screen from './index';

vi.mock('../../api/authApi', () => ({ useGetMeQuery: vi.fn() }));
vi.mock('../../api/lessonsApi', () => ({ useListLessonsQuery: vi.fn() }));

const manager: Me = {
  user: {
    id: 'yuval.mizrahi@school.example',
    firstName: 'Yuval',
    lastName: 'Mizrahi',
    email: 'yuval.mizrahi@school.example',
    roles: ['management'],
  },
  permissions: { T04: 'full' },
  landing: 'X03',
};

const lessons = {
  items: [
    {
      id: 'lesson-1',
      dayOfWeek: 0,
      period: 1,
      classId: 'class-1',
      groupId: null,
      subjectId: 'subject-1',
      teacherId: 'teacher-1',
      roomId: null,
    },
  ],
};

function meResult(data: Me | undefined, isLoading = false, isError = false) {
  return {
    data,
    isLoading,
    isError,
    error: undefined,
    refetch: vi.fn(),
  } as ReturnType<typeof useGetMeQuery>;
}

function lessonsResult(
  data: typeof lessons | undefined,
  options: { isLoading?: boolean; isError?: boolean } = {},
) {
  return {
    data,
    isLoading: options.isLoading ?? false,
    isFetching: false,
    isError: options.isError ?? false,
    error: options.isError ? { status: 500, data: {} } : undefined,
    refetch: vi.fn(),
  } as ReturnType<typeof useListLessonsQuery>;
}

beforeEach(() => {
  vi.mocked(useGetMeQuery).mockReturnValue(meResult(manager));
  vi.mocked(useListLessonsQuery).mockReturnValue(lessonsResult(lessons));
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('T04 timetable import/export screen', () => {
  it('shows a loading state while permission data is loading', () => {
    vi.mocked(useGetMeQuery).mockReturnValue(meResult(undefined, true));
    renderWithProviders(<Screen />, { token: 'mock.yuval.mizrahi@school.example' });

    expect(screen.getByRole('status', { name: 'טוען' })).toBeInTheDocument();
  });

  it('shows the import workflow and current schedule export to management', () => {
    renderWithProviders(<Screen />, { token: 'mock.yuval.mizrahi@school.example' });

    expect(screen.getByRole('button', { name: 'הורדת תבנית' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ייצוא נוכחית' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ייבוא מקובץ' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'תוצאות בדיקה' })).toBeInTheDocument();
  });

  it('shows mock validation results after an Excel file is selected', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Screen />, { token: 'mock.yuval.mizrahi@school.example' });

    const input = screen.getByRole('group', { name: 'העלאת קובץ' }).querySelector('input[type="file"]');
    if (!(input instanceof HTMLInputElement)) throw new Error('T04 file input was not rendered');
    await user.upload(
      input,
      new File(['lesson,day'], 'timetable.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),
    );

    expect(await screen.findByText('timetable.xlsx הועלה')).toBeInTheDocument();
    expect(await screen.findByText('שיבוץ כפול של המורה בח2')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'ייבא תקינות' }));
    expect(await screen.findByText('נוצרה טיוטה לבדיקה')).toBeInTheDocument();
  });

  it('serializes the contract fields as escaped UTF-8 CSV', () => {
    const lesson: Lesson = {
      id: 'lesson,"1',
      dayOfWeek: 0,
      period: 2,
      classId: 'class-1',
      groupId: null,
      subjectId: 'subject-1',
      teacherId: 'teacher-1',
      roomId: null,
    };

    expect(lessonsToCsv([lesson])).toBe(
      '\uFEFF"מזהה שיעור","יום בשבוע","שיעור","מזהה כיתה","מזהה קבוצה","מזהה מקצוע","מזהה מורה","מזהה חדר"\r\n' +
        '"lesson,""1","0","2","class-1","","subject-1","teacher-1",""\r\n',
    );
  });

  it('starts a CSV download with a localized filename', () => {
    const createObjectURL = vi.fn(() => 'blob:csv');
    const revokeObjectURL = vi.fn();
    let filename = '';
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL });
    vi.useFakeTimers();
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      filename = this.download;
    });

    downloadLessonsCsv(lessons.items);

    expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(filename).toBe('מערכת-שעות.csv');
    vi.runAllTimers();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:csv');
  });

  it('shows an empty state when there are no lessons to export', () => {
    vi.mocked(useListLessonsQuery).mockReturnValue(lessonsResult({ items: [] }));
    renderWithProviders(<Screen />, { token: 'mock.yuval.mizrahi@school.example' });

    expect(screen.getByText('אין שיעורים לייצוא')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ייצוא נוכחית' })).toBeDisabled();
  });

  it('shows an error state with retry when the timetable cannot be loaded', () => {
    vi.mocked(useListLessonsQuery).mockReturnValue(
      lessonsResult(undefined, { isError: true }),
    );
    renderWithProviders(<Screen />, { token: 'mock.yuval.mizrahi@school.example' });

    expect(screen.getByRole('button', { name: 'נסי שוב' })).toBeInTheDocument();
  });

  it('denies access to users without T04 permission', () => {
    vi.mocked(useGetMeQuery).mockReturnValue(
      meResult({ ...manager, permissions: {} }),
    );
    renderWithProviders(<Screen />, { token: 'mock.mor.dahan@school.example' });

    expect(screen.getByRole('heading', { name: 'אין לך הרשאה לצפות בעמוד זה' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'ייבוא מקובץ' })).not.toBeInTheDocument();
  });
});
