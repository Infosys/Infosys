
// AuthLoader is a wrapper component that manages authentication state before rendering its children.
// It handles loading, error, and unauthenticated states by showing the login screen or a loading indicator.
import React from 'react';
import { useAuth } from '../provider/AuthProvider';
import LoginScreen from '../../../pages/Login-SignUp/Login-SignUp';
import LoadingPage from '../../../pages/loading-page/LoadingPage';



const AuthLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get authentication state and updater from context
  const { loading, isAuthenticated, error, updateAuthState } = useAuth();

  // Show a full-page loading indicator while authentication status is being determined
  if (loading) {
    return (
      <LoadingPage message="Authenticating..."/>
    );
  }

  // If there is an authentication error, show the login screen and pass the updateAuthState callback
  if (error) {
    return <LoginScreen onLoginSuccess={updateAuthState} />;
  }

  // If user is not authenticated, show the login screen
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={updateAuthState} />;
  }

  // If authenticated, render the children components
  return <>{children}</>;
};


// Export the AuthLoader component as default
export default AuthLoader;
 