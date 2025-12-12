// CommonRoutes.tsx
// Defines all common/public route mappings for the application (login, register, profile, etc).
// Uses PublicRoute for public pages and ProtectedRoute for authenticated pages.
import type { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import UnderConstructionPage from '../pages/UnderConstruction';
import ProfilePage from '../pages/Profile';
import LandingPage from '../../components/LandingPage';
import SignUpForm from '../../components/SignUpForm';
import OtpPage from '../../components/OtpPage';
import { useAuth } from '../../context/AuthProvider';
import NotFoundPage from '../components/NotFoundPage';
import PublicRoute from '../../components/PublicRoute';
import LoginScreen from '../../app/pages/LoginPage';

/**
 * CommonRoutes component
 * Sets up all routes that are common to both agents and citizens, including authentication and error pages.
 */
const CommonRoutes: FC = () => {
  // Get updateAuthState from auth context for login success
  const { updateAuthState } = useAuth();
  // Render all common/public routes
  return (
    <Routes>
      {/* Landing page route (public) */}
      <Route
        path="landing-page"
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        }
      />
      {/* Registration page route (public) */}
      <Route
        path="register"
        element={
          <PublicRoute>
            <SignUpForm />
          </PublicRoute>
        }
      />
      {/* OTP verification page route (public) */}
      <Route
        path="otp-verification"
        element={
          <PublicRoute>
            <OtpPage />
          </PublicRoute>
        }
      />
      {/* Login page route (public) */}
      <Route
        path="login"
        element={
          <PublicRoute>
            <LoginScreen onLoginSuccess={updateAuthState} />
          </PublicRoute>
        }
      />
      
      {/* Redirect /login without params to default CITIZEN role */}
      {/* Profile page route (protected, agent or citizen) */}
      <Route
        path="login-redirect"
        element={<Navigate to="/login?role=citizen" replace />}
      />
      {/* Under construction page route (protected, agent or citizen) */}
      <Route
        path="profile"
        element={
          <ProtectedRoute allowedRoles={['AGENT', 'CITIZEN']}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="under-construction"
        element={
          <ProtectedRoute allowedRoles={['AGENT', 'CITIZEN']}>
            <UnderConstructionPage />
          </ProtectedRoute>
        }
      />
      {/* Catch-all route for 404 not found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default CommonRoutes;
