import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';

/** Sends a signed-out visitor to the login screen. */
export function RequireAuth() {
  const token = useAppSelector((s) => s.auth.token);
  const location = useLocation();
  if (!token) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}
