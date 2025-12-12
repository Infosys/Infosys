
// PublicRoute is a wrapper component that restricts access to its children for authenticated users.
// It is typically used for routes like login or signup that should not be accessible when logged in.
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../provider/AuthProvider";
import LoadingPage from "../../../../pages/loading-page/LoadingPage";


// Props: children - the components to render if the user is not authenticated
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get authentication state from context
  const { isAuthenticated, loading } = useAuth();

  // Show loading indicator while authentication status is being determined
  if (loading) {
    return <LoadingPage message="Loading..."/>;
  }

  // If user is authenticated, redirect to the service manager's home page
  if (isAuthenticated) {
    return <Navigate to="/service-manager/home" replace />;
  }

  // If not authenticated, render the children components (e.g., login or signup forms)
  return <>{children}</>;
};


// Export the PublicRoute component as default
export default PublicRoute;