import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('learnora_token') || null);
  const [loading, setLoading] = useState(true);
  const [storageMode, setStorageMode] = useState('Checking database status...');

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('learnora_token');
      if (storedToken) {
        try {
          const res = await apiClient.getMe();
          if (res && res.user) {
            setUser(res.user);
            if (res.storageMode) setStorageMode(res.storageMode);
          } else {
            throw new Error('Invalid user payload');
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err.message);
          localStorage.removeItem('learnora_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await apiClient.login({ email, password });
    if (!res || !res.token || !res.user) {
      throw new Error(res?.message || 'Login failed to return valid session token.');
    }
    localStorage.setItem('learnora_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const register = async (name, email, password, role) => {
    const res = await apiClient.register({ name, email, password, role });
    if (!res || !res.token || !res.user) {
      throw new Error(res?.message || 'Registration failed to return valid session token.');
    }
    localStorage.setItem('learnora_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('learnora_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        role: user ? user.role : null,
        loading,
        storageMode,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
