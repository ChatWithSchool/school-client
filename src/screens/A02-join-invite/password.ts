/**
 * The password policy (A06: the institution policy). No policy is defined yet in the specs or the
 * contract, so this is the v1 rule. The screen and the mock both use it.
 */
const RULES: { ok: (p: string) => boolean; label: string }[] = [
  { ok: (p) => p.length >= 8, label: 'לפחות 8 תווים' },
  { ok: (p) => /[A-Za-z]/.test(p), label: 'אות באנגלית' },
  { ok: (p) => /\d/.test(p), label: 'ספרה' },
];

/** What the password is missing; empty when it is strong enough. */
export const missingInPassword = (password: string): string[] =>
  RULES.filter((r) => !r.ok(password)).map((r) => r.label);
