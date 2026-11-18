import { useGetMeQuery } from '../../api/authApi';
import type { Level } from '../../api/types';
import { useAppSelector } from '../../app/hooks';

/** The user's access level on a screen: undefined while permissions load, null when denied, or a known level. */
export function usePermission(screenId: string): Level | null | undefined {
  const token = useAppSelector((s) => s.auth.token);
  const { data } = useGetMeQuery(undefined, { skip: !token });
  if (!data) return undefined;
  return data.permissions[screenId] ?? null;
}

/** Can the user create or change data on this screen? 'read' cannot. */
export const canWrite = (level: Level | null | undefined): boolean =>
  level === 'full' || level === 'scoped';
