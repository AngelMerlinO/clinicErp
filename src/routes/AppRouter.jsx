// src/routes/AppRouter.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/pages/LoginPage';
import DashboardHomePage from '../features/dashboard/pages/DashboardHomePage';
import AdminLayout from '../layouts/AdminLayout';

const isAuthenticated = !!localStorage.getItem('token');

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            <Route
              path="/"
              element={
                <AdminLayout>
                  <DashboardHomePage />
                </AdminLayout>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};
