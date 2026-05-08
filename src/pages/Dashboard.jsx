import React from 'react';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import EmployeeDashboard from '../components/dashboard/EmployeeDashboard';

const Dashboard = () => {
  let isAdmin = false;
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    isAdmin = user?.role === 'admin';
  } catch {
    // Ignore error
  }

  return isAdmin ? <AdminDashboard /> : <EmployeeDashboard />;
};

export default Dashboard;
