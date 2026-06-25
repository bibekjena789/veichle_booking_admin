import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../api/auth';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = useCallback(() => {
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);
    
    if (authenticated) {
      const userData = authService.getUserData();
      setUser(userData);
      setUserRole(authService.getUserRole());
    } else {
      setUser(null);
      setUserRole(null);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (identifier, password) => {
    setLoading(true);
    try {
      const result = await authService.login(identifier, password);
      
      if (result.success) {
        const userData = authService.getUserData();
        setUser(userData);
        setUserRole(authService.getUserRole());
        setIsAuthenticated(true);
        return { success: true, data: userData };
      }
      
      return { success: false, message: result.message };
    } catch (error) {
      return { success: false, message: 'Login failed' };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setUserRole(null);
    setIsAuthenticated(false);
    navigate('/login');
  }, [navigate]);

  const getUserData = useCallback(() => {
    return authService.getUserData();
  }, []);

  const getUserName = useCallback(() => {
    return authService.getUserName();
  }, []);

  const getUserEmail = useCallback(() => {
    return authService.getUserEmail();
  }, []);

  const getUserPhone = useCallback(() => {
    return authService.getUserPhone();
  }, []);

  const getLastLogin = useCallback(() => {
    return authService.getLoginHistory();
  }, []);

  return {
    user,
    isAuthenticated,
    loading,
    userRole,
    login,
    logout,
    checkAuth,
    getUserData,
    getUserName,
    getUserEmail,
    getUserPhone,
    getLastLogin,
    isVehicleAdmin: authService.isVehicleAdmin.bind(authService),
  };
};

export default useAuth;