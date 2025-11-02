import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { loginUser } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    console.log('Restoring auth state:', { token, storedUser });

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === 'object') {
          setIsAuthenticated(true);
          setUser(parsedUser);
        } else {
          console.error('Invalid user data in localStorage');
          localStorage.removeItem('user');
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { token, user } = await loginUser(email, password);
      console.log('Login success:', { token, user });
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: typeof error === 'string' ? error : error.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};