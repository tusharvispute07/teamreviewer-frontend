import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  let userRole = null;

  try {
    const user = JSON.parse(localStorage.getItem('user'));
    userRole = user?.role;
  } catch {
    // Fallback if parsing fails
  }

  // 1. Not logged in at all -> redirect to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // 2. Role is restricted, and user doesn't match -> redirect to generic dashboard
  if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Authorized -> render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
