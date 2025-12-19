import type { FC } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';

import { Route, Routes } from 'react-router-dom';
import CitizenHomePage from '../pages/Citizen/CitizenHomePage';
import Properties from '../pages/Citizen/Properties';
import PropertyDetails from '../pages/Citizen/PropertyDetails';
import PropertyLocationView from '../pages/Citizen/PropertyLocationView';
import { ApplicationLog } from '../pages/Agent';

const CitizenRoutes: FC = () => {
  return (
    <Routes>
      <Route
        path=""
        element={
          <ProtectedRoute allowedRoles={['CITIZEN']}>
            <CitizenHomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="properties"
        element={
          <ProtectedRoute allowedRoles={['CITIZEN']}>
              <Properties />
          </ProtectedRoute>
        }
      />
      <Route
        path="properties/:propertyId"
        element={
          <ProtectedRoute allowedRoles={['CITIZEN']}>
              <PropertyDetails />
          </ProtectedRoute>
        }
      />
      {/* <Route
        path="my-city"
        element={
          <ProtectedRoute>
            <CityAppProvider>
              <MyCity />
            </CityAppProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="bills"
        element={
          <ProtectedRoute>
            <BillsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="billsHistory"
        element={
          <ProtectedRoute>
            <BillHistoryScreen />
          </ProtectedRoute>
        }
      /> */}
      <Route
        path="property-location"
        element={
          <ProtectedRoute allowedRoles={['CITIZEN']}>
            <PropertyLocationView />
          </ProtectedRoute>
        }
      />

      <Route
        path="application-logs/:id"
        element={
          <ProtectedRoute allowedRoles={['CITIZEN']}>
            <ApplicationLog />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default CitizenRoutes;
