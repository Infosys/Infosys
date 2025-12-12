// Route definitions for the Commissioner section of the property tax web UI
// Maps commissioner URLs to their respective page components

import { Routes, Route } from 'react-router-dom';
import { CommisionerHomePage } from '../pages/commisioner-pages/CommisionerHomePage';
import { CommissionerPropertyDetailsPage } from '../pages/commisioner-pages/CommissionerPropertyDetailsPage';

// Main route component for commissioner pages
export const CommissionerRoutes = () => {
  return (
    <Routes>
      {/* Home page route for commissioner (default and /home) */}
      <Route path="/" element={<CommisionerHomePage />} />
      <Route path="/home" element={<CommisionerHomePage />} />
      {/* Property details page for a specific application */}
      <Route path="/property-details/:applicationID" element={<CommissionerPropertyDetailsPage />} />
    </Routes>
  );
};