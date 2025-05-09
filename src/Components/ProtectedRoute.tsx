import { Navigate } from "react-router-dom";
import { useUser } from "../hooks/UserContext";
import { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
  backup?: string; // Optional redirect path (default is /login)
  requireVerified?: boolean; // If true, only allow verified users
}

/**
 * A route wrapper that protects pages from unauthenticated or unverified users.
 *
 * - Redirects to /login if user is not logged in
 * - Redirects to /verify-email if `requireVerified` is true and email is not verified
 * - Otherwise, renders the protected children
 *
 * @example
 * <Route path="/dashboard" element={
 *   <ProtectedRoute requireVerified={true}><Dashboard /></ProtectedRoute>
 * } />
 */
const ProtectedRoute = ({ children, backup = "/login", requireVerified = false }: ProtectedRouteProps) => {
  const { user } = useUser();

  if (!user || !user.email) {
    return <Navigate to={backup} replace />;
  }

  if (requireVerified && !user.verified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

export default ProtectedRoute;
