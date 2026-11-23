// src/screens/I01-institution-structure/I01.test.tsx
import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '../../mocks/server';
import { renderWithProviders } from '../../test/utils';
import Screen from './index';

// כמו ב-Announcements.test.tsx: הטוקנים מוגדרים בקובץ הבדיקה עצמו

const MANAGER = 'mock.yuval.mizrahi@school.example';
const PARENT = 'mock.amit.biton@school.example';

type User = ReturnType<typeof userEvent.setup>;

// המשתמש נטען אסינכרונית (GET me), לכן מחכים עד שהטופס מופיע
async function renderScreen() {
  renderWithProviders(<Screen />, { token: MANAGER });
  await screen.findByRole('textbox', { name: /שם המוסד/ });
}

const heading = (name: RegExp) => screen.getByRole('heading', { name });

async function fillValidForm(user: User) {
  await user.type(screen.getByRole('textbox', { name: /שם המוסד/ }), 'תל-אביב');

  await user.click(screen.getByRole('combobox', { name: /סוג מוסד/ }));
  await user.click(screen.getByRole('option', { name: 'בית ספר יסודי' }));

  await user.click(screen.getByRole('combobox', { name: /שכבות לימוד/ }));
  await user.click(screen.getByRole('checkbox', { name: 'יסודי' }));
  await user.keyboard('{Escape}');
}

async function goToConfirm(user: User) {
  await fillValidForm(user);
  await user.click(screen.getByRole('button', { name: /המשך/ }));
}

describe('I01 institution structure wizard', () => {
  beforeEach(() => {
    // מקפיאים רק את התאריך, כדי שהשנה הנוכחית (תשפ"ז) לא תשתנה עם הזמן
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-20T10:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the first setup step and key fields', async () => {
    await renderScreen();

    expect(heading(/אשף הקמת מוסד: מבנה בית הספר/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /המשך/ })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /שם המוסד/ })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /סוג מוסד/ })).toBeInTheDocument();
  });

  it('selects the current school year by default', async () => {
    await renderScreen();

    expect(screen.getByRole('combobox', { name: /שנת לימודים נוכחית/ })).toHaveTextContent('תשפ"ז');
  });

  it('shows validation errors when continuing with empty required fields', async () => {
    const user = userEvent.setup();
    await renderScreen();

    await user.click(screen.getByRole('button', { name: /המשך/ }));

    expect(screen.getAllByText('שדה חובה').length).toBeGreaterThan(0);
    expect(heading(/אשף הקמת מוסד: מבנה בית הספר/)).toBeInTheDocument();
  });

  it('reduces the number of required-field errors after one field is filled', async () => {
    const user = userEvent.setup();
    await renderScreen();

    // השנה מלאה כברירת מחדל, ולכן נשארות שלוש שגיאות
    await user.click(screen.getByRole('button', { name: /המשך/ }));
    expect(screen.getAllByText('שדה חובה')).toHaveLength(3);

    await user.type(screen.getByRole('textbox', { name: /שם המוסד/ }), 'תל-אביב');

    expect(screen.getAllByText('שדה חובה')).toHaveLength(2);
  });

  it('updates the preview when the number of classes changes', async () => {
    const user = userEvent.setup();
    await renderScreen();

    await user.click(screen.getByRole('combobox', { name: /שכבות לימוד/ }));
    await user.click(screen.getByRole('checkbox', { name: 'יסודי' }));

    await user.click(screen.getByRole('combobox', { name: /מספר כיתות בכל שכבה/ }));
    await user.click(screen.getByRole('option', { name: '3' }));

    expect(screen.getAllByText('יסודי').length).toBeGreaterThan(0);
    expect(screen.getByText('א, ב, ג')).toBeInTheDocument();
  });

  it('moves to the confirmation step with a summary when the form is valid', async () => {
    const user = userEvent.setup();
    await renderScreen();

    await goToConfirm(user);

    expect(heading(/אשף הקמת מוסד: אישור/)).toBeInTheDocument();
    expect(screen.getByText('תל-אביב')).toBeInTheDocument();
    expect(screen.getByText('בית ספר יסודי')).toBeInTheDocument();
    expect(screen.getByText('תשפ"ז')).toBeInTheDocument();
    expect(screen.getByText('א, ב')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'אישור' })).toBeInTheDocument();
  });

  it('returns to the form with the entered values when pressing back', async () => {
    const user = userEvent.setup();
    await renderScreen();

    await goToConfirm(user);
    await user.click(screen.getByRole('button', { name: /חזרה/ }));

    expect(heading(/אשף הקמת מוסד: מבנה בית הספר/)).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /שם המוסד/ })).toHaveValue('תל-אביב');
  });

  it('creates the institution and its structure, then shows a success message', async () => {
    const user = userEvent.setup();
    const institutionBodies: unknown[] = [];
    const structureBodies: unknown[] = [];

    server.use(
      http.post('*/institutions', async ({ request }) => {
        institutionBodies.push(await request.json());
        return HttpResponse.json({ id: 'inst-1' }, { status: 201 });
      }),
      http.post('*/institutions/:id/structure', async ({ request, params }) => {
        structureBodies.push({ id: params.id, body: await request.json() });
        return HttpResponse.json({ ok: true }, { status: 201 });
      }),
    );

    await renderScreen();

    await goToConfirm(user);
    await user.click(screen.getByRole('button', { name: 'אישור' }));

    expect(await screen.findByText('המוסד נוצר בהצלחה.')).toBeInTheDocument();
    expect(institutionBodies).toEqual([
      expect.objectContaining({ name: 'תל-אביב', type: 'elementary' }),
    ]);
    expect(structureBodies).toEqual([
      {
        id: 'inst-1',
        body: expect.objectContaining({ levels: ['elementary'], classesPerLevel: 2 }),
      },
    ]);
  });

  it('shows an error and allows retry when creating the institution fails', async () => {
    const user = userEvent.setup();
    server.use(http.post('*/institutions', () => new HttpResponse(null, { status: 500 })));

    await renderScreen();

    await goToConfirm(user);
    await user.click(screen.getByRole('button', { name: 'אישור' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('אירעה שגיאה בשמירה');
    expect(screen.getByRole('button', { name: 'אישור' })).toBeEnabled();
  });

  it('does not create a second institution when retrying after the structure failed', async () => {
    const user = userEvent.setup();
    let institutionCalls = 0;
    let structureCalls = 0;

    server.use(
      http.post('*/institutions', () => {
        institutionCalls += 1;
        return HttpResponse.json({ id: 'inst-1' }, { status: 201 });
      }),
      http.post('*/institutions/:id/structure', () => {
        structureCalls += 1;
        return structureCalls === 1
          ? new HttpResponse(null, { status: 500 })
          : HttpResponse.json({ ok: true }, { status: 201 });
      }),
    );

    await renderScreen();

    await goToConfirm(user);
    await user.click(screen.getByRole('button', { name: 'אישור' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('אירעה שגיאה בשמירה');

    await user.click(screen.getByRole('button', { name: 'אישור' }));

    expect(await screen.findByText('המוסד נוצר בהצלחה.')).toBeInTheDocument();
    expect(institutionCalls).toBe(1);
    expect(structureCalls).toBe(2);
  });

  it('shows the forbidden state and no form for a user without write permission', async () => {
    renderWithProviders(<Screen />, { token: PARENT });

    expect(await screen.findByText(/אין לך הרשאה/)).toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: /שם המוסד/ })).not.toBeInTheDocument();
  });

  it('shows the forbidden state for a visitor without a token', () => {
    renderWithProviders(<Screen />);

    expect(screen.getByText(/אין לך הרשאה/)).toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: /שם המוסד/ })).not.toBeInTheDocument();
  });
});
