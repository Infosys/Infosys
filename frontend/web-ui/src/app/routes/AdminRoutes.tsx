import { Routes, Route } from 'react-router-dom';
import { AdminHomePage } from '../pages/admin-pages/AdminHomePage';

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminHomePage />} />
      <Route path="/home" element={<AdminHomePage />} />
    </Routes>
  );
};
