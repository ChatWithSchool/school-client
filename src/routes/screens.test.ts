import { SCREENS, pathFor } from './screens';

describe('screen registry', () => {
  it('has unique ids and paths', () => {
    expect(new Set(SCREENS.map((s) => s.id)).size).toBe(SCREENS.length);
    expect(new Set(SCREENS.map((s) => s.path)).size).toBe(SCREENS.length);
  });
  it('covers the version 1 screens', () => {
    expect(SCREENS.length).toBe(48);
    expect(pathFor('S01')).toBe('/students/s01');
    expect(pathFor('S03')).toBe('/students/s03/:id');
    expect(pathFor('X03')).toBe('/');
    expect(pathFor('A04')).toBe('/settings/a04');
  });
  it('keeps login, join and password reset outside the shell', () => {
    expect(
      SCREENS.filter((s) => s.public)
        .map((s) => s.id)
        .sort(),
    ).toEqual(['A01', 'A02', 'A03']);
  });
});
