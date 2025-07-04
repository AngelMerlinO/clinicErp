// src/routes/ProtectedRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';

import DashboardHomePage from '../features/dashboard/pages/DashboardHomePage';
import UsersPage from '../features/users/pages/UsersPage';
import CostCenters from '../features/costCenters/pages/CostCentersPage';
import ProjectionsPage from '../features/projections/pages/ProjectionsPage';
// import more pages...

export default function ProtectedRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<DashboardHomePage />} />
        <Route path="usuarios" element={<UsersPage />} />
        <Route path="centros-costos" element={<CostCenters />} />
        <Route path="proyecciones" element={<ProjectionsPage />} />
        {/* Add other routes like ordenes, proyecciones, etc. */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AdminLayout>
  );
}
