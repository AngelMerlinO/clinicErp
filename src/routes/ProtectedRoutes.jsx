// src/routes/ProtectedRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardHomePage from '../features/dashboard/pages/DashboardHomePage';
import PatientsListPage from '../features/patients/pages/PatientsListPage';
import AdminLayout from '../layouts/AdminLayout';

export const ProtectedRoutes = () => (
  <AdminLayout>
    <Routes>
      <Route path="/" element={<DashboardHomePage />} />
      <Route path="/patients" element={<PatientsListPage />} />
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  </AdminLayout>
);
