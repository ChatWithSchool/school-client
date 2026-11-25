import { http, HttpResponse } from 'msw';
import type { SchoolEvent } from '../api/types';
import { authz, err } from './http';
import { shared } from './shared';

const EVENT_TYPES: SchoolEvent['type'][] = ['holiday', 'event', 'parents_day', 'vacation'];
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export const eventHandlers = [
  http.post('*/api/events', async ({ request }) => {
    const a = authz(request, 'I07', 'write');
    if (a.res) return a.res;

    const body = (await request.json()) as Partial<SchoolEvent>;
    const details: { field: string; message: string }[] = [];

    if (!body.title || body.title.trim().length < 2)
      details.push({ field: 'title', message: 'חובה כותרת (לפחות 2 תווים)' });
    if (!body.type || !EVENT_TYPES.includes(body.type))
      details.push({ field: 'type', message: 'חובה לבחור סוג אירוע' });
    if (!body.startDate || !DATE.test(body.startDate))
      details.push({ field: 'startDate', message: 'תאריך בפורמט YYYY-MM-DD' });
    if (!body.endDate || !DATE.test(body.endDate))
      details.push({ field: 'endDate', message: 'תאריך בפורמט YYYY-MM-DD' });
    if (body.startDate && body.endDate && body.endDate < body.startDate)
      details.push({ field: 'endDate', message: 'תאריך הסיום לא יכול להיות לפני ההתחלה' });
    if (details.length) return err(400, 'VALIDATION_ERROR', 'הנתונים שנשלחו אינם תקינים', details);

    const created: SchoolEvent = {
      id: `evt-${crypto.randomUUID()}`,
      title: body.title!.trim(),
      type: body.type!,
      startDate: body.startDate!,
      endDate: body.endDate!,
      gradeLevels: Array.isArray(body.gradeLevels) ? body.gradeLevels : [],
    };
    shared.events.push(created);
    return HttpResponse.json({ id: created.id }, { status: 201 });
  }),
];
