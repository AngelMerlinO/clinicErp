// src/routes/AppRouter.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/pages/LoginPage';
import ProtectedRoutes from './ProtectedRoutes';

const isAuthenticated = !!localStorage.getItem('token');

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      {isAuthenticated ? (
        <Route path="/*" element={<ProtectedRoutes />} />
      ) : (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      )}
    </Routes>
  </BrowserRouter>
);
