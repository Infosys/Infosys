
// ProtectedRoute is a wrapper component that restricts access to its children based on authentication and user role.
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../provider/AuthProvider";
import LoadingPage from "../../../../pages/loading-page/LoadingPage";


// Props for ProtectedRoute:
// - children: The components to render if access is allowed
// - allowedRoles: Optional array of roles that are permitted to access the route
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('SERVICE_MANAGER' | 'COMMISSIONER' | 'ADMIN')[];
}


const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  // Get authentication state and user role from context
  const { isAuthenticated, loading, role } = useAuth();

  // Show loading indicator while authentication status is being determined
  if (loading) {
    return <LoadingPage message="Loading..."/>;
  }

  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is provided, check if the user's role is permitted
  if (allowedRoles && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      // If user has a known role, redirect to their respective home page
      if (role === 'SERVICE_MANAGER') {
        return <Navigate to="/service-manager/home" replace />;
      } else if (role === 'COMMISSIONER') {
        return <Navigate to="/commissioner/home" replace />;
      } else if (role === 'ADMIN') {
        return <Navigate to="/admin/home" replace />;
      }
      // If role is unknown or not allowed, redirect to login
      return <Navigate to="/login" replace />;
    }
  }

  // If authenticated and role is allowed (or no role restriction), render children
  return <>{children}</>;
};


// Export the ProtectedRoute component as default
export default ProtectedRoute;