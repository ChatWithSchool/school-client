import { http, HttpResponse } from 'msw';
import type { StudentFormPayload, StudentFormRecord } from '../api/studentsApi';
import { authz, err } from './http';

const studentsStore: Record<string, StudentFormRecord> = {
  '1': {
    id: '1',
    firstName: 'נועם',
    lastName: 'ביטון',
    nationalId: '123456782',
    birthDate: '2012-01-01',
    className: 'ח1',
    phone: '050-000-0000',
    phoneExtra: '',
    parentEmail: 'amit.biton@example.com',
    address: '',
    notes: '',
    tags: ['חדש'],
  },
  '2': {
    id: '2',
    firstName: 'יובל',
    lastName: 'קליין',
    nationalId: '234567891',
    birthDate: '2012-04-05',
    className: 'ח1',
    phone: '050-000-0001',
    phoneExtra: '',
    parentEmail: '',
    address: '',
    notes: '',
    tags: [],
  },
  '3': {
    id: '3',
    firstName: 'עדי',
    lastName: 'פרץ',
    nationalId: '345678912',
    birthDate: '2011-07-12',
    className: 'ח2',
    phone: '050-000-0002',
    phoneExtra: '',
    parentEmail: '',
    address: '',
    notes: '',
    tags: ['מעקב'],
  },
  '4': {
    id: '4',
    firstName: 'מיה',
    lastName: 'לוי',
    nationalId: '987654321',
    birthDate: '2012-09-20',
    className: 'ז1',
    phone: '050-000-0003',
    phoneExtra: '',
    parentEmail: '',
    address: '',
    notes: '',
    tags: [],
  },
};

function nationalIdTaken(nationalId: string, excludeId?: string | null): boolean {
  return Object.values(studentsStore).some(
    (s) => s.id !== excludeId && s.nationalId === nationalId.trim(),
  );
}

function parentEmailTaken(email: string, excludeId?: string | null): boolean {
  const normalized = email.trim().toLowerCase();
  return Object.values(studentsStore).some(
    (s) => s.id !== excludeId && s.parentEmail && s.parentEmail.toLowerCase() === normalized,
  );
}

// ולידציה בצד "שרת": שדות חובה + כפילות ת"ז
function validateBody(body: Partial<StudentFormPayload>, selfId?: string) {
  const details: { field: string; message: string }[] = [];
  if (!body.firstName?.trim()) details.push({ field: 'firstName', message: 'שדה חובה' });
  if (!body.lastName?.trim()) details.push({ field: 'lastName', message: 'שדה חובה' });
  if (!body.nationalId?.trim()) details.push({ field: 'nationalId', message: 'שדה חובה' });
  if (!body.birthDate) details.push({ field: 'birthDate', message: 'שדה חובה' });
  if (!body.className) details.push({ field: 'className', message: 'שדה חובה' });
  if (!body.phone?.trim()) details.push({ field: 'phone', message: 'שדה חובה' });
  if (details.length) return err(400, 'VALIDATION_ERROR', 'הנתונים שנשלחו אינם תקינים', details);

  if (nationalIdTaken(body.nationalId!, selfId)) {
    return err(409, 'DUPLICATE_NATIONAL_ID', 'תלמיד עם תעודת זהות זו כבר קיים במערכת');
  }
  return null;
}

export const studentFormHandlers = [
  // חשוב: check-duplicate חייב להיות לפני :id, אחרת "check-duplicate" ייתפס כ-id
  http.get('*/api/students/check-duplicate', ({ request }) => {
    const a = authz(request, 'S02', 'write');
    if (a.res) return a.res;
    const params = new URL(request.url).searchParams;
    const nationalId = params.get('nationalId');
    const parentEmail = params.get('parentEmail');
    const excludeId = params.get('excludeId');
    return HttpResponse.json({
      nationalIdExists: nationalId ? nationalIdTaken(nationalId, excludeId) : false,
      parentEmailExists: parentEmail ? parentEmailTaken(parentEmail, excludeId) : false,
    });
  }),

  // זמני: GET /students/{id} שייך ל-S03. למחוק כשמתואם מי מוסיף אותו.
  http.get('*/api/students/:id', ({ params, request }) => {
    const a = authz(request, 'S02', 'write');
    if (a.res) return a.res;
    const student = studentsStore[String(params.id ?? '')];
    if (!student) return err(404, 'NOT_FOUND', 'תלמיד לא נמצא');
    return HttpResponse.json(student);
  }),

  http.post('*/api/students', async ({ request }) => {
    const a = authz(request, 'S02', 'write');
    if (a.res) return a.res;
    const body = (await request.json()) as StudentFormPayload;
    const invalid = validateBody(body);
    if (invalid) return invalid;

    const id = String(Date.now());
    const created: StudentFormRecord = { id, ...body };
    studentsStore[id] = created;
    return HttpResponse.json(created, { status: 201 });
  }),

  http.put('*/api/students/:id', async ({ params, request }) => {
    const a = authz(request, 'S02', 'write');
    if (a.res) return a.res;
    const id = String(params.id ?? '');
    if (!studentsStore[id]) return err(404, 'NOT_FOUND', 'תלמיד לא נמצא');

    const body = (await request.json()) as StudentFormPayload;
    const invalid = validateBody(body, id);
    if (invalid) return invalid;

    const updated: StudentFormRecord = { id, ...body };
    studentsStore[id] = updated;
    return HttpResponse.json(updated);
  }),
];