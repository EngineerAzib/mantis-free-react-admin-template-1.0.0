import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { loginUser } from '../api/auth';
import { GetAuthorizedPersonInfo } from '../api/CompanyStoreUser';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [userTabs, setUserTabs] = useState([]);

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const roleInfo = await GetAuthorizedPersonInfo();
          console.log('User role info:', roleInfo);
          setUserRole(roleInfo.role);
          setUserTabs(roleInfo.tabs || []);
        } catch (error) {
          console.error('Failed to fetch user role:', error);
        }
      }
    };

    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    console.log('Restoring auth state:', { token, storedUser });

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === 'object') {
          setIsAuthenticated(true);
          setUser(parsedUser);
          fetchUserRole();
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
      
      // Fetch user role after login
      try {
        const roleInfo = await GetAuthorizedPersonInfo();
        console.log('User role info:', roleInfo);
        setUserRole(roleInfo.role);
        setUserTabs(roleInfo.tabs || []);
      } catch (error) {
        console.error('Failed to fetch user role:', error);
      }
      
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
    setUserRole(null);
    setUserTabs([]);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, userRole, userTabs }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};