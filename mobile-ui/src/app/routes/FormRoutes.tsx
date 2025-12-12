// FormRoutes.tsx
// Defines all route mappings for the property form workflow (location, owner, address, etc).
// Uses ProtectedRoute to restrict access to authenticated agents and citizens only.
import type { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import LocationPage from '../pages/PropertyForm/LocationPage';
import LocationSelectionPage from '../pages/PropertyForm/LocationSelectionPage';
import LocationViewPage from '../pages/PropertyForm/LocationViewPage';
import PropertyInformation from '../pages/PropertyForm/PropertyInformation';
import OwnerDetails from '../pages/PropertyForm/OwnerDetails';
import OwnerDetailsTwo from '../pages/PropertyForm/OwnerDetailsTwo';
import PropertyAddress from '../pages/PropertyForm/PropertyAddress';
import AssessmentDetails from '../pages/PropertyForm/AssessmentDetails';
import ISGRDetailsPage from '../pages/PropertyForm/IGRSDetailsPage';
import ISGRAdditionalDetailsPage from '../pages/PropertyForm/IGRSAdditionalDetailsPage';
import ConstructionDetailsPage from '../pages/PropertyForm/ConstructionDetailsPage';
import FloorDetailsPage from '../pages/PropertyForm/FloorDetailsPage';
import FloorDetailsCards from '../pages/PropertyForm/FloorDetailsCards';
import DocumentsInformation from '../pages/PropertyForm/DocumentsInformation';
import { DocumentUpload } from '../pages/PropertyForm/DocumentUpload';
import { PropertySummary } from '../pages/PropertyForm/PropertySummary';
import PropertyInformationSubmitted from '../pages/Agent/PropertyInformationSubmitted';
import PreliminaryInfo from '../pages/PropertyForm/PreliminaryInfo';

/**
 * FormRoutes component
 * Sets up all routes for the property form process, each wrapped in ProtectedRoute for role-based access control.
 */
export const FormRoutes: FC = () => {
  // Render all property form workflow routes
  return (
    <Routes>
      {/* Route for preliminary property information step, accessible to AGENT and CITIZEN roles only */}
      <Route
        path="preliminary-information"
        element={
          <ProtectedRoute allowedRoles={['AGENT', 'CITIZEN']}>
            <PreliminaryInfo />
          </ProtectedRoute>
        }
      />
      {/* Location page route (with and without propertyId) */}
      <Route
        path="location"
        element={
          <ProtectedRoute allowedRoles={['AGENT', 'CITIZEN']}>
            <LocationPage />
          </ProtectedRoute>
        }
      />
      {/* Location selection page route */}
      <Route
        path="location/:propertyId"
        element={
          <ProtectedRoute allowedRoles={['AGENT', 'CITIZEN']}>
            <LocationPage />
          </ProtectedRoute>
        }
      />

      {/* Location view page route */}
      <Route
        path="location-selection"
        element={
          <ProtectedRoute allowedRoles={['AGENT', 'CITIZEN']}>
            <LocationSelectionPage />
          </ProtectedRoute>
        }
      />
      {/* Property information page route */}
      <Route
        path="location-view"
        element={
          <ProtectedRoute allowedRoles={['AGENT', 'CITIZEN']}>
            <LocationViewPage />
          </ProtectedRoute>
        }
      />
      {/* Owner details page route */}
      <Route
        path="property-information"
        element={
          <ProtectedRoute allowedRoles={['AGENT', 'CITIZEN']}>
            <PropertyInformation />
          </ProtectedRoute>
        }
      />
      {/* Owner details two page route */}
      <Route
        path="owner-details"
        element={
          <ProtectedRoute allowedRoles={['AGENT', 'CITIZEN']}>
            <OwnerDetails />
          </ProtectedRoute>
        }
      />

      {/* Property address page route */}
      <Route
        path="owner-details-two"
        element={
          <ProtectedRoute allowedRoles={['AGENT', 'CITIZEN']}>
            <OwnerDetailsTwo />
          </ProtectedRoute>
        }
      />
      {/* Assessment details page route */}
      <Route
        path="property-address"
        element={
          <ProtectedRoute allowedRoles={['AGENT', 'CITIZEN']}>
            <PropertyAddress />
          </ProtectedRoute>
        }
      />
      {/* IGRS details page route */}
      <Route
        path="assessment-details"
        element={
          <ProtectedRoute allowedRoles={['AGENT', 'CITIZEN']}>
            <AssessmentDetails />
          </ProtectedRoute>
        }
      />
      {/* IGRS additional details page route */}
      <Route
        path="igrs-details"
        element={
          <ProtectedRoute allowedRoles={['AGENT', 'CITIZEN']}>
            <ISGRDetailsPage />
          </ProtectedRoute>
        }
      />
      {/* Construction details page route */}
      <Route
        path="igrs-additional-details"
        element={
          <ProtectedRoute allowedRoles={['AGENT', 'CITIZEN']}>
            <ISGRAdditionalDetailsPage />
          </ProtectedRoute>
        }
      />
      {/* Floor details page route */}
      <Route
        path="construction-details"
        element={
          <ProtectedRoute allowedRoles={['AGENT', 'CITIZEN']}>
            <ConstructionDetailsPage />
          </ProtectedRoute>
        }
      />
      {/* Floor details cards page route */}
      <Route
        path="floor-details"
        element={
          <ProtectedRoute allowedRoles={['AGENT', 'CITIZEN']}>
            <FloorDetailsPage />
          </ProtectedRoute>
        }
      />
      {/* Documents information page route */}
      <Route
        path="floor-details-cards"
        element={
          <ProtectedRoute allowedRoles={['AGENT', 'CITIZEN']}>
            <FloorDetailsCards />
          </ProtectedRoute>
        }
      />
      {/* Document upload page route */}
      <Route
        path="documents"
        element={
          <ProtectedRoute allowedRoles={['AGENT', 'CITIZEN']}>
            <DocumentsInformation />
          </ProtectedRoute>
        }
      />
      {/* Property summary page route */}
      <Route
        path="documents-upload"
        element={
          <ProtectedRoute allowedRoles={['AGENT', 'CITIZEN']}>
            <DocumentUpload />
          </ProtectedRoute>
        }
      />
      {/* Property information submitted page route */}
      <Route
        path="summary"
        element={
          <ProtectedRoute allowedRoles={['AGENT', 'CITIZEN']}>
            <PropertySummary />
          </ProtectedRoute>
        }
      />
      <Route
        path="PropertyInformationSubmitted"
        element={
          <ProtectedRoute allowedRoles={['AGENT', 'CITIZEN']}>
            <PropertyInformationSubmitted />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
