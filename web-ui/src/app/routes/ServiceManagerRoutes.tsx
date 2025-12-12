// Route definitions for the Service Manager section of the property tax web UI
// Maps service manager URLs to their respective page components

import { Routes, Route } from 'react-router-dom';
import { PropertyDetailsPage } from '../pages/service-manager-pages/PropertyDetailsPage';
import { ServiceHomePage } from '../pages/service-manager-pages/ServiceHomePage';

// Main route component for service manager pages
export const ServiceManagerRoutes = () => {
  return (
    <Routes>
      {/* Home page route for service manager (default and /home) */}
      <Route path="/" element={<ServiceHomePage />} />
      <Route path="/home" element={<ServiceHomePage />} />
      {/* Property details page for a specific application */}
      <Route path="/property-details/:applicationID" element={<PropertyDetailsPage />} />
    </Routes>
  );
};