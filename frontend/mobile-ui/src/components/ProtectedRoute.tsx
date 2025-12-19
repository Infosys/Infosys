// ProtectedRoute.tsx
// Higher-order component for protecting routes based on authentication and user role.
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import LoadingPage from '../app/components/Loader';

/**
 * Props for ProtectedRoute
 * - children: The component(s) to render if access is allowed
 * - allowedRoles: Optional array of roles allowed to access the route
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('CITIZEN' | 'AGENT')[];
}

/**
 * ProtectedRoute Component
 * Restricts access to child routes based on authentication and allowed user roles.
 * Redirects to login or appropriate home page if access is denied.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  // Get authentication state and user role from context
  const { isAuthenticated, loading, role } = useAuth();

  // Show loading indicator while auth state is being determined
  if (loading) {
    return <LoadingPage message='Securing your information as you leave.'/>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is specified, check if user's role is allowed
  if (allowedRoles && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      // Redirect to appropriate home based on their actual role
      if (role === 'CITIZEN') {
        return <Navigate to="/citizen" replace />;
      } else if (role === 'AGENT') {
        return <Navigate to="/agent" replace />;
      }
      // Default redirect if role is unknown
      return <Navigate to="/login" replace />;
    }
  }

  // Render children if access is allowed
  return <>{children}</>;
};

export default ProtectedRoute;
