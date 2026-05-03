import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/index';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      const { user, token } = response.data;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      setUser(user);
      setToken(token);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };

  const signup = async (name, email, password, confirmPassword) => {
    try {
      const response = await authService.signup({ name, email, password, confirmPassword });
      const { user, token } = response.data;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      setUser(user);
      setToken(token);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Signup failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, isAdmin, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
