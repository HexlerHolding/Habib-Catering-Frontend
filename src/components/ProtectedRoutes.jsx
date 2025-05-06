import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser } from '../redux/slices/authSlice';
import MainLayout from './MainLayout';

const ProtectedRoutes = ({ isSidebarOpen, toggleSidebar, closeSidebar, children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  
  console.log("Protected Route Check:", { isAuthenticated, user });
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" />;
  }
  
  return (
    <MainLayout
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={toggleSidebar}
      closeSidebar={closeSidebar}
    >
      {children || <Outlet />}
    </MainLayout>
  );
};

export default ProtectedRoutes;
