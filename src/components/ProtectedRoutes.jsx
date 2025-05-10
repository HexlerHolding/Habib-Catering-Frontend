import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../redux/slices/authSlice';

const ProtectedRoutes = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Show loading if auth state is not determined yet
  if (isAuthenticated === undefined || isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoutes;
