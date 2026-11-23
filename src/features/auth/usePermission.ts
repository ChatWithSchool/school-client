import { useGetMeQuery } from '../../api/authApi';
import type { Level } from '../../api/types';
import { useAppSelector } from '../../app/hooks';

/** The user's access level on a screen: 'full', 'scoped' (own classes or children), 'read' or undefined. */
export function usePermission(screenId: string): Level | undefined {
  const token = useAppSelector((s) => s.auth.token);
  const { data } = useGetMeQuery(undefined, { skip: !token });
  return data?.permissions[screenId];
}

/** Can the user create or change data on this screen? 'read' cannot. */
export const canWrite = (level: Level | undefined): boolean =>
  level === 'full' || level === 'scoped';
