import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { SchoolEvent } from '../../api/types';
import { server } from '../../mocks/server';
import { renderWithProviders } from '../../test/utils';
import Screen from './index';

const MANAGER = 'mock.yuval.mizrahi@school.example';
const TEACHER = 'mock.mor.dahan@school.example';
const PARENT = 'mock.amit.biton@school.example';

const EVENTS: SchoolEvent[] = [
  {
    id: 'e1',
    title: 'פסח',
    type: 'holiday',
    startDate: '2027-04-21',
    endDate: '2027-04-28',
    gradeLevels: [],
  },
  {
    id: 'e2',
    title: 'ערב הורים',
    type: 'parents_day',
    startDate: '2026-12-10',
    endDate: '2026-12-10',
    gradeLevels: ['ז', 'ח'],
  },
];

const useEvents = (items: SchoolEvent[]) =>
  server.use(http.get('*/events', () => HttpResponse.json({ items })));

describe('I07 events list', () => {
  beforeEach(() => {
    // מקפיאים רק את התאריך, כדי שתאריכי ברירת המחדל בטופס יהיו קבועים
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-24T10:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the events in a list with type, dates and scope', async () => {
    useEvents(EVENTS);
    renderWithProviders(<Screen />, { token: MANAGER });

    expect(await screen.findByText('פסח')).toBeInTheDocument();
    const table = screen.getByRole('table');
    expect(within(table).getByText('חג')).toBeInTheDocument();
    expect(screen.getByText('21/04/2027')).toBeInTheDocument();
    expect(screen.getByText('כל המוסד')).toBeInTheDocument();
    expect(screen.getByText('ערב הורים')).toBeInTheDocument();
    expect(screen.getByText('ז, ח')).toBeInTheDocument();
  });

  it('shows an empty state when there are no events', async () => {
    useEvents([]);
    renderWithProviders(<Screen />, { token: MANAGER });

    expect(await screen.findByText('אין אירועים ביומן')).toBeInTheDocument();
  });

  it('shows the legend of the event types', async () => {
    useEvents(EVENTS);
    renderWithProviders(<Screen />, { token: MANAGER });

    expect(await screen.findByRole('heading', { name: 'מקרא סוגי אירועים' })).toBeInTheDocument();
  });

  it('shows an error when loading the events fails', async () => {
    server.use(http.get('*/events', () => new HttpResponse(null, { status: 500 })));
    renderWithProviders(<Screen />, { token: MANAGER });

    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });

  it('adds an event and shows it in the list', async () => {
    const user = userEvent.setup();
    const events = [...EVENTS];
    const bodies: unknown[] = [];

    server.use(
      http.get('*/events', () => HttpResponse.json({ items: events })),
      http.post('*/events', async ({ request }) => {
        const body = (await request.json()) as Omit<SchoolEvent, 'id'>;
        bodies.push(body);
        events.push({ id: 'e3', ...body });
        return HttpResponse.json({ id: 'e3' }, { status: 201 });
      }),
    );

    renderWithProviders(<Screen />, { token: MANAGER });
    await screen.findByText('פסח');

    await user.click(screen.getByRole('button', { name: 'הוספת אירוע' }));
    await user.type(await screen.findByRole('textbox', { name: /כותרת האירוע/ }), 'ישיבת צוות');
    await user.click(screen.getByRole('button', { name: 'הוסף אירוע' }));

    expect(await screen.findByText('ישיבת צוות')).toBeInTheDocument();
    expect(bodies).toEqual([
      expect.objectContaining({
        title: 'ישיבת צוות',
        type: 'event',
        startDate: '2026-11-24',
        endDate: '2026-11-24',
        gradeLevels: [],
      }),
    ]);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('does not send an event without a title', async () => {
    const user = userEvent.setup();
    let posted = false;
    useEvents(EVENTS);
    server.use(
      http.post('*/events', () => {
        posted = true;
        return HttpResponse.json({ id: 'e3' }, { status: 201 });
      }),
    );

    renderWithProviders(<Screen />, { token: MANAGER });
    await screen.findByText('פסח');

    await user.click(screen.getByRole('button', { name: 'הוספת אירוע' }));
    await user.click(await screen.findByRole('button', { name: 'הוסף אירוע' }));

    expect(await screen.findByText('חובה להזין כותרת (לפחות 2 תווים)')).toBeInTheDocument();
    expect(posted).toBe(false);
  });

  it('hides the add button from a user with view-only access', async () => {
    useEvents(EVENTS);
    renderWithProviders(<Screen />, { token: TEACHER });

    expect(await screen.findByText('פסח')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'הוספת אירוע' })).not.toBeInTheDocument();
  });

  it('shows the forbidden state to a user without access', async () => {
    renderWithProviders(<Screen />, { token: PARENT });

    expect(await screen.findByText(/אין לך הרשאה/)).toBeInTheDocument();
  });
});
