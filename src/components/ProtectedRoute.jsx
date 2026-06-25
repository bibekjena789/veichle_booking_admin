import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import authService from '../api/auth';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, userRole } = useAuth();
  const [verifying, setVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const verifySession = async () => {
      setVerifying(true);
      try {
        // Verify the token with the server
        const result = await authService.verifyCurrentSession();
        
        if (result.success) {
          setIsValid(true);
        } else {
          // Token is invalid - clear session and redirect to login
          authService.clearAll();
          setIsValid(false);
        }
      } catch (error) {
        console.error('Session verification error:', error);
        authService.clearAll();
        setIsValid(false);
      } finally {
        setVerifying(false);
      }
    };

    if (isAuthenticated) {
      verifySession();
    } else {
      setVerifying(false);
      setIsValid(false);
    }
  }, [isAuthenticated]);

  if (loading || verifying) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Verifying session...</p>
      </div>
    );
  }

  if (!isAuthenticated || !isValid) {
    return <Navigate to="/login" replace />;
  }

  // Check role if required
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;