// AgentRoutes.tsx
// Defines all route mappings for the agent user role.
// Uses ProtectedRoute to restrict access to authenticated agents only.


import type { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import HomePage from '../pages/Agent/HomePage';
import ReviewedProperty from '../pages/Agent/ReviewedProperty';
import PropertyFormVerification from '../pages/Agent/PropertyFormVerification';
import SearchProperty from '../pages/Agent/SearchProperty';
import DraftPage from '../pages/PropertyForm/DraftPage';
import SendEmail from '../pages/Agent/SendEmail';
import {AddRequestOrComment, ApplicationLog} from '../pages/Agent';

/**
 * AgentRoutes component
 * Sets up all routes accessible to agents, each wrapped in ProtectedRoute for role-based access control.
 */
const AgentRoutes: FC = () => {
  // Render all agent-specific routes
  return (
    <Routes>
      {/* Home page route for agents */}
      <Route
        path=""
        element={
          <ProtectedRoute allowedRoles={['AGENT']}>
            <HomePage />
          </ProtectedRoute>
        }
      />
      {/* Reviewed properties route */}
      <Route
        path="reviewed-properties"
        element={
          <ProtectedRoute allowedRoles={['AGENT']}>
            <ReviewedProperty />
          </ProtectedRoute>
        }
      />

      {/* Property verification route (dynamic by propertyId) */}
      <Route
        path="verification/:propertyId"
        element={
          <ProtectedRoute allowedRoles={['AGENT']}>
            <PropertyFormVerification />
          </ProtectedRoute>
        }
      />
      {/* Add comment/request route */}
      <Route
        path="add-comment"
        element={
          <ProtectedRoute allowedRoles={['AGENT']}>
            <AddRequestOrComment />
          </ProtectedRoute>
        }
      />
      {/* Search property route */}
      <Route
        path="search-property"
        element={
          <ProtectedRoute allowedRoles={['AGENT']}>
            <SearchProperty />
          </ProtectedRoute>
        }
      />

      {/* Draft property route (dynamic by propertyId) */}
      <Route
        path="draft/:propertyId"
        element={
          <ProtectedRoute allowedRoles={['AGENT']}>
            <DraftPage />
          </ProtectedRoute>
        }
      />

      {/* Application log route (dynamic by id) */}
      <Route
        path="ApplicationLog/:id"
        element={
          <ProtectedRoute allowedRoles={['AGENT']}>
            <ApplicationLog />
          </ProtectedRoute>
        }
      />
      {/*
        Example of an additional ApplicationLog route (currently commented out)
        <Route
          path="/ApplicationLog"
          element={
            <ProtectedRoute>
              <ApplicationLog />
            </ProtectedRoute>
          }
        />
      */}
      {/* Send email route */}
      <Route
        path="send-email/:Id"
        element={
          <ProtectedRoute allowedRoles={['AGENT']}>
            <SendEmail />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AgentRoutes;
