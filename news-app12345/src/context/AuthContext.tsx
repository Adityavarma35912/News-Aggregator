import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '../types/auth';
import api from '../api/client';
import { setToken, getToken, removeToken, decodeToken } from '../utils/jwt';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.userId && decoded.username && decoded.role) {
        setUser({ userId: decoded.userId, username: decoded.username, role: decoded.role });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        removeToken();
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { username, password });
      setToken(res.data.token);
      setUser({ userId: res.data.userId, username: res.data.username, role: res.data.role });
      setIsAuthenticated(true);
    } catch (err: any) {
      setUser(null);
      setIsAuthenticated(false);
      removeToken();
      throw new Error(err.response?.data?.error || 'Login failed');
    }
  };

  const signup = async (username: string, password: string) => {
    try {
      const res = await api.post('/auth/signup', { username, password });
      setToken(res.data.token);
      setUser({ userId: res.data.userId, username: res.data.username, role: res.data.role });
      setIsAuthenticated(true);
    } catch (err: any) {
      setUser(null);
      setIsAuthenticated(false);
      removeToken();
      throw new Error(err.response?.data?.error || 'Signup failed');
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    removeToken();
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 