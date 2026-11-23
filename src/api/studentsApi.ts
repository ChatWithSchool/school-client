import type { StudentFormRecord } from '../mocks/studentForm';

export type StudentFormPayload = Omit<StudentFormRecord, 'id'>;

export async function getStudentById(id: string): Promise<StudentFormRecord> {
  const response = await fetch(`/api/students/${encodeURIComponent(id)}`);
  if (!response.ok) {
    throw new Error('לא ניתן לטעון את פרטי התלמיד');
  }
  return response.json() as Promise<StudentFormRecord>;
}

export async function createStudent(payload: StudentFormPayload): Promise<StudentFormRecord> {
  const response = await fetch('/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('שמירת התלמיד נכשלה');
  }
  return response.json() as Promise<StudentFormRecord>;
}

export async function updateStudent(
  id: string,
  payload: StudentFormPayload,
): Promise<StudentFormRecord> {
  const response = await fetch(`/api/students/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('עדכון פרטי התלמיד נכשל');
  }
  return response.json() as Promise<StudentFormRecord>;
}
