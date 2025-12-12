// PublicRoute.tsx
// Higher-order component for restricting access to public routes if user is authenticated.
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import LoadingPage from "../app/components/Loader";

/**
 * PublicRoute Component
 * Restricts access to public routes for authenticated users.
 * Redirects authenticated users to the agent home page.
 */
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get authentication state from context
  const { isAuthenticated, loading } = useAuth();

  // Show loading indicator while auth state is being determined
  if (loading) {
    return <LoadingPage message='Securing your information as you leave.'/>;
  }

  // Redirect authenticated users to agent home
  if (isAuthenticated) {
    return <Navigate to="/agent" replace />;
  }

  // Render children if user is not authenticated
  return <>{children}</>;
};

export default PublicRoute;