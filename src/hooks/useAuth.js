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

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        // Verify token with server
        const verifyResult = await authService.verifyCurrentSession();
        
        if (verifyResult.success) {
          const userData = authService.getUserData();
          setUser(userData);
          setUserRole(authService.getUserRole());
          setIsAuthenticated(true);
        } else {
          // Token invalid - try to refresh
          const refreshResult = await authService.refreshToken();
          if (refreshResult.success) {
            const userData = authService.getUserData();
            setUser(userData);
            setUserRole(authService.getUserRole());
            setIsAuthenticated(true);
          } else {
            authService.clearAll();
            setIsAuthenticated(false);
            setUser(null);
            setUserRole(null);
          }
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setUserRole(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
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

  const refreshToken = useCallback(async () => {
    const result = await authService.refreshToken();
    if (result.success) {
      const userData = authService.getUserData();
      setUser(userData);
      setUserRole(authService.getUserRole());
      setIsAuthenticated(true);
    }
    return result;
  }, []);

  const verifyToken = useCallback(async (token) => {
    return authService.verifyToken(token);
  }, []);

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
    refreshToken,
    verifyToken,
    getUserData,
    getUserName,
    getUserEmail,
    getUserPhone,
    getLastLogin,
    isVehicleAdmin: authService.isVehicleAdmin.bind(authService),
  };
};

export default useAuth;