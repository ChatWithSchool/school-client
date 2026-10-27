import type {
  Assessment,
  AttendanceAlert,
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

  it('returns grades with null for a score not entered, and the right gradedCount', async () => {
    // [students in the class, scores entered]: ח1 has 12 students, ז1 has 8
    const expected: Record<string, [number, number]> = {
      'asm-1': [12, 11],
      'asm-2': [12, 10],
      'asm-3': [8, 5],
      'asm-4': [8, 0],
    };
    const { body: assessments } = await get<Page<Assessment>>('/assessments');
    expect(assessments.items.map((a) => [a.id, a.gradedCount])).toEqual(
      Object.entries(expected).map(([id, [, entered]]) => [id, entered]),
    );
    for (const [id, [students, entered]] of Object.entries(expected)) {
      const { body } = await get<List<Grade>>(`/assessments/${id}/grades`);
      expect(body.items).toHaveLength(students);
      expect(body.items.every((g) => g.assessmentId === id)).toBe(true);
      expect(body.items.filter((g) => g.score !== null)).toHaveLength(entered);
    }
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

  // the server rules, checked here on their own (not with the code that wrote the mock alerts)
  it('backs every open alert with the attendance records', async () => {
    const { body: alerts } = await get<Page<AttendanceAlert>>('/attendance/alerts');
    const { body: records } = await get<List<AttendanceRecord>>('/attendance');
    const latest = records.items
      .map((r) => r.date)
      .sort()
      .at(-1)!;
    const open = alerts.items.filter((a) => a.status === 'open');
    expect(open).toHaveLength(3);
    for (const a of open) {
      expect(a.closedBy).toBeNull();
      expect(a.closedAt).toBeNull();
      const days = records.items
        .filter((r) => r.studentId === a.studentId && r.period === null)
        .sort((x, y) => x.date.localeCompare(y.date));
      expect(days.every((r) => r.classId === a.classId)).toBe(true);
      if (a.type === 'streak') {
        // absent on the last `count` days, and not on the day before them
        const run = days.slice(-a.count!);
        expect(days.at(-1)?.date).toBe(latest);
        expect(a.count).toBeGreaterThanOrEqual(3);
        expect(run.every((r) => r.status === 'absent')).toBe(true);
        expect(days.at(-a.count! - 1)?.status).not.toBe('absent');
        expect(run[0].date).toBe(a.since);
        expect(a.month).toBeNull();
      } else {
        expect(a.month).toBe(latest.slice(0, 7));
        const absences = days.filter((r) => r.status === 'absent' && r.date.startsWith(a.month!));
        expect(a.count).toBeGreaterThanOrEqual(3);
        expect(absences).toHaveLength(a.count!);
        expect(absences[0].date).toBe(a.since);
      }
    }
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
