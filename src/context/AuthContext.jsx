import { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize and check token on load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await authAPI().getUser("getUser", {});
        setUser(userData.user);
      } catch (err) {
        console.error('Auto-login failed:', err.message);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const data = await authAPI().signin("login", { email, password });
      localStorage.setItem('token', data.token);
      
      const userData = await authAPI().getUser("getUser", {});
      localStorage.setItem('user', JSON.stringify({ name: userData.user.name, email: userData.user.email}));
      setUser(userData.user);
      return userData.user;
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Login failed. Please check credentials.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    setError(null);
    setLoading(true);
    try {
      const data = await authAPI().signup("save",{ name, email, password });
      localStorage.setItem('token', data.token);
      
      const userData = await authAPI().getUser("getUser", {});
      localStorage.setItem('user', JSON.stringify({ name: userData.user.name, email: userData.user.email, }));
      setUser(userData.user);
      return userData.user;
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Registration failed. Try again.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await authAPI().signout("logout", {});
    } catch (err) {
      console.error('Backend logout request failed:', err.message);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
