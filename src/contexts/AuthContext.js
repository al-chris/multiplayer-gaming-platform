// src/contexts/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
// import jwtDecode from 'jwt-decode';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('access_token') || null,
    user: null,
  });

  useEffect(() => {
    if (auth.token) {
      try {
        const decoded = jwtDecode(auth.token);
        setAuth((prev) => ({ ...prev, user: decoded }));
      } catch (error) {
        console.error('Invalid token:', error);
        setAuth({ token: null, user: null });
        localStorage.removeItem('access_token');
      }
    }
  }, [auth.token]);

  const login = (token) => {
    localStorage.setItem('access_token', token);
    const decoded = jwtDecode(token);
    setAuth({ token, user: decoded });
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setAuth({ token: null, user: null });
  };

  const setGuest = (user_id) => {
    setAuth({ token: null, user: { sub: user_id } });
    localStorage.setItem('guest_user_id', user_id);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, setGuest }}>
      {children}
    </AuthContext.Provider>
  );
};
