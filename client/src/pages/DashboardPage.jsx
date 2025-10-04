import React from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import ManagerDashboard from '../components/dashboard/ManagerDashboard';
import EmployeeDashboard from '../components/dashboard/EmployeeDashboard';

const DashboardPage = () => {
  const { user, isLoading } = useAuth();

  console.log('DashboardPage - Current user:', user);
  console.log('DashboardPage - isLoading:', isLoading);

  // Show loading state while auth is being checked
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If no user is found after loading is complete
  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  const renderDashboard = () => {
    console.log('Rendering dashboard for role:', user?.role);
    switch (user?.role) {
      case 'ADMIN':
        return <AdminDashboard key="admin" />;
      case 'MANAGER':
        return <ManagerDashboard key="manager" />;
      case 'EMPLOYEE':
        return <EmployeeDashboard key="employee" />;
      default:
        console.log('Unknown role or no role found');
        return (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">
              Unknown role. Please contact your administrator.
            </p>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-slate-100 dark:bg-background-dark py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {renderDashboard()}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
