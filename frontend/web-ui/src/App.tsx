// Main application entry point for the Property Tax Web UI
// Sets up routing, authentication, and sidebar providers for different user roles

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './app/global.css'
import { useAuth } from './app/features/login-signup/provider/AuthProvider';
import ProtectedRoute from './app/features/login-signup/components/ProtectedRouteComponent/ProtectedRoute';
import PublicRoute from './app/features/login-signup/components/PublicRouteComponent/PublicRoute';

import { SidebarProvider } from './app/components/Sidebar/provider/SMSideBarProvider';
import MapViewZones from './app/pages/map-pages/mapviewzones';
import { ServiceManagerRoutes } from './app/routes/ServiceManagerRoutes';
import { CommissionerRoutes } from './app/routes/CommissionerRoutes';
import { AdminRoutes } from './app/routes/AdminRoutes';
import { CommissionerSidebarProvider } from './app/components/Sidebar/provider/CMSideBarProvider';
import { AdminSidebarProvider } from './app/components/Sidebar/provider/AdminSidebarProvider';
import LoginScreen from './app/pages/Login-SignUp/Login-SignUp';

// Root App component
function App() {;
  // Get authentication state updater from context
  const { updateAuthState } = useAuth();
  return (
    // Set up React Router for navigation
    <BrowserRouter>
      <Routes>
        {/* Public Routes: Accessible without authentication */}
        <Route
          path="/"
          element={
            <PublicRoute>
              {/* Login screen for unauthenticated users */}
              <LoginScreen onLoginSuccess={updateAuthState} />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginScreen onLoginSuccess={updateAuthState} />
            </PublicRoute>
          }
        />

        {/* Protected Routes: Commissioner role only */}
        <Route
          path="/commissioner/*"
          element={
            <ProtectedRoute allowedRoles={['COMMISSIONER']}>
              {/* Commissioner sidebar and routes */}
              <CommissionerSidebarProvider>
                <CommissionerRoutes />
              </CommissionerSidebarProvider>
            </ProtectedRoute>
          }
        />

        {/* Protected Routes: Service Manager role only */}
        <Route
          path="/service-manager/*"
          element={
            <ProtectedRoute allowedRoles={['SERVICE_MANAGER']}>
              <SidebarProvider>
                <ServiceManagerRoutes />
              </SidebarProvider>
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Admin */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}> 
              <AdminSidebarProvider>
                <AdminRoutes />
              </AdminSidebarProvider>
            </ProtectedRoute>
          }
        />

        {/* Common Protected Routes - Both roles */}
        {/* Common Protected Route: Accessible by any authenticated user */}
        <Route
          path="/map-view"
          element={
            <ProtectedRoute>
              <MapViewZones />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

// Export the App component as default
export default App;