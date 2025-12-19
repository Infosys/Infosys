// Main entry point for the React app
import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './styles/globals.css';
import Providers from './Providers';
import 'react-toastify/dist/ReactToastify.css';

import CitizenRoutes from './app/routes/CitizenRoutes';
import AgentRoutes from './app/routes/AgentRoutes';
import { FormRoutes } from './app/routes/FormRoutes';
import CommonRoutes from './app/routes/CommonRoutes';

// App component sets up global providers and all main routes
const App: React.FC = () => {
  return (
    <Providers>
      {/* Set up React Router for all app routes */}
      <Router>
        <Routes>
          {/* Redirect root to landing page */}
          <Route path="/" element={<Navigate to="/landing-page" />} />
          {/* Citizen user routes */}
          <Route path="/citizen/*" element={<CitizenRoutes />} />
          {/* Property form routes */}
          <Route path="/property-form/*" element={<FormRoutes />} />
          {/* Agent user routes */}
          <Route path="/agent/*" element={<AgentRoutes />} />
          {/* Common routes for all users (fallback) */}
          <Route path="/*" element={<CommonRoutes />} />
        </Routes>
      </Router>
    </Providers>
  );
};
export default App;
