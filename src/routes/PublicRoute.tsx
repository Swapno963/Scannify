import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../auth/auth';

interface PublicRouteProps {
  children: React.ReactNode;
  restricted?: boolean;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children, restricted = false }) => {
  if (isAuthenticated() && restricted) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default PublicRoute;