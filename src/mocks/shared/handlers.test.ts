import type {
  Assessment,
  AttendanceRecord,
  Grade,
  Invite,
  Lesson,
  List,
  Page,
  SchoolEvent,
} from '../../api/types';
import { CLASS_ID } from '.';

const API = import.meta.env.VITE_API_URL;
const TEACHER = 'mock.mor.dahan@school.example';

async function get<T>(path: string, token: string | null = TEACHER) {
  const res = await fetch(`${API}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return { status: res.status, body: (await res.json()) as T };
}

/** Throws when two items share the same key, and names the key. */
function expectUnique<T>(items: T[], key: (item: T) => string) {
  const seen = new Set<string>();
  for (const item of items) {
    const k = key(item);
    expect(seen.has(k), `duplicate ${k}`).toBe(false);
    seen.add(k);
  }
}

describe('shared collection mocks', () => {
  it('needs a signed-in user', async () => {
    const { status, body } = await get('/rooms', null);
    expect(status).toBe(401);
    expect(body).toEqual({ error: { code: 'UNAUTHENTICATED', message: 'נדרשת התחברות' } });
  });

  it('filters lessons by classId and returns contract-shaped lessons', async () => {
    const { status, body } = await get<List<Lesson>>(`/lessons?classId=${CLASS_ID['ז1']}`);
    expect(status).toBe(200);
    expect(body.items.length).toBeGreaterThan(0);
    for (const l of body.items) {
      expect(l.classId).toBe(CLASS_ID['ז1']);
      expect(l).toEqual({
        id: expect.any(String),
        classId: expect.any(String),
        groupId: null,
        subjectId: expect.any(String),
        teacherId: expect.any(String),
        roomId: l.roomId === null ? null : expect.any(String),
        dayOfWeek: expect.any(Number),
        period: expect.any(Number),
      });
      expect(l.dayOfWeek).toBeGreaterThanOrEqual(0);
      expect(l.dayOfWeek).toBeLessThanOrEqual(5);
      expect(l.period).toBeGreaterThanOrEqual(1);
      expect(l.period).toBeLessThanOrEqual(10);
    }
  });

  it('has a weekly grid without conflicts for classes, teachers and rooms', async () => {
    const { body } = await get<List<Lesson>>('/lessons');
    expect(new Set(body.items.map((l) => l.classId)).size).toBeGreaterThanOrEqual(2);
    expectUnique(body.items, (l) => `class ${l.classId} ${l.dayOfWeek}/${l.period}`);
    expectUnique(body.items, (l) => `teacher ${l.teacherId} ${l.dayOfWeek}/${l.period}`);
    expectUnique(
      body.items.filter((l) => l.roomId !== null),
      (l) => `room ${l.roomId} ${l.dayOfWeek}/${l.period}`,
    );
  });

  it('returns grades with null for a score not entered, matching gradedCount', async () => {
    const { body: assessments } = await get<Page<Assessment>>('/assessments');
    for (const a of assessments.items) {
      const { body } = await get<List<Grade>>(`/assessments/${a.id}/grades`);
      expect(body.items.every((g) => g.assessmentId === a.id)).toBe(true);
      expect(body.items.filter((g) => g.score !== null)).toHaveLength(a.gradedCount!);
    }
    const future = await get<List<Grade>>('/assessments/asm-4/grades');
    expect(future.body.items.every((g) => g.score === null)).toBe(true);
    expect((await get('/assessments/nope/grades')).status).toBe(404);
  });

  it('filters attendance by class and date, and rejects an unknown slot', async () => {
    const { body } = await get<List<AttendanceRecord>>(
      `/attendance?class=${CLASS_ID['ז1']}&date=2026-10-22`,
    );
    expect(body.items).toHaveLength(8);
    expect(body.items.find((r) => r.studentId === 'stu-4')?.status).toBe('absent');
    expect(body.items.every((r) => r.period === null)).toBe(true);
    expect((await get('/attendance?slot=morning')).status).toBe(400);
  });

  it('filters invites by status and events by date range', async () => {
    const pending = await get<Page<Invite>>('/invites?status=pending');
    expect(pending.body.items).toHaveLength(3);
    expect(pending.body.total).toBe(3);
    expect((await get('/invites?status=unknown')).status).toBe(400);

    const december = await get<List<SchoolEvent>>('/events?from=2026-12-01&to=2026-12-31');
    expect(december.body.items.map((e) => e.type)).toEqual(['vacation']);
  });

  it('returns student tags as a list of labels', async () => {
    const { body } = await get<List<string>>('/students/stu-5/tags');
    expect(body).toEqual({ items: ['מעקב', 'תגבור קריאה'] });
    expect((await get('/students/nope/tags')).status).toBe(404);
  });
});
