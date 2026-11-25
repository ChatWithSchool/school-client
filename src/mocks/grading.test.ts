import type { GradingWeight } from '../api/gradingApi';
import { resetGradingMocks } from './grading';

const API = import.meta.env.VITE_API_URL;
const MANAGEMENT = 'mock.yuval.mizrahi@school.example';
const QUERY = '/grading/weights?gradeLevel=%D7%96&subjectId=sub-math&termId=term-a';

async function getWeights() {
  const response = await fetch(`${API}${QUERY}`, {
    headers: { Authorization: `Bearer ${MANAGEMENT}` },
  });
  return {
    status: response.status,
    body: (await response.json()) as { items: GradingWeight[] },
  };
}

describe('grading weight mocks', () => {
  it('keeps grading weights private and resets their state to the seed', async () => {
    const initial = await getWeights();
    expect(initial.status).toBe(200);
    expect(initial.body.items[0].weights).toEqual([
      { type: 'exam', percent: 60 },
      { type: 'quiz', percent: 20 },
      { type: 'assignment', percent: 20 },
    ]);

    const saved = await fetch(`${API}/grading/weights`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${MANAGEMENT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gradeLevel: 'ז',
        subjectId: 'sub-math',
        termId: 'term-a',
        weights: [
          { type: 'exam', percent: 50 },
          { type: 'quiz', percent: 25 },
          { type: 'assignment', percent: 25 },
        ],
      }),
    });
    expect(saved.status).toBe(204);

    resetGradingMocks();
    const reset = await getWeights();
    expect(reset.body.items[0].weights).toEqual(initial.body.items[0].weights);
  });
});
