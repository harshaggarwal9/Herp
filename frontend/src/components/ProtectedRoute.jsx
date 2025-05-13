// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';

const ProtectedRoute = ({ allowedRole }) => {
  const { user } = useAuthStore();

  if (user === null) {
    // Still loading or no auth yet - return null or loader
    return null;
  }

  if (!user || user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

