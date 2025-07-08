import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ children, roles }) => {
  const { user } = useAuth();

  
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-6">
        <h1 className="text-3xl font-bold text-red-600 mb-4">⛔ Access Denied</h1>
        <p className="text-gray-700 mb-6">
          Your current role <span className="font-semibold text-[#0466c8]">({user.role})</span> does not have permission to access this page.
        </p>
        <Navigate to="/slips" replace />
      </div>
    );
  }

  
  return children;
};

export default PrivateRoute;
