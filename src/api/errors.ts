import type { ApiErrorBody } from './types';

/** A readable Hebrew message from an RTK Query error. */
export function errorMessage(err: unknown): string {
  const body = (err as { data?: Partial<ApiErrorBody> } | undefined)?.data;
  if (body?.error?.message) return body.error.message;
  if ((err as { status?: string } | undefined)?.status === 'FETCH_ERROR') {
    return 'אין חיבור לשרת. בדקי שהשרת פועל.';
  }
  return 'אירעה שגיאה, נסי שוב';
}

/** Field errors from a 400 VALIDATION_ERROR: { fieldName: message } */
export function fieldErrors(err: unknown): Record<string, string> {
  const details = (err as { data?: Partial<ApiErrorBody> } | undefined)?.data?.error?.details ?? [];
  return Object.fromEntries(details.map((d) => [d.field, d.message]));
}
