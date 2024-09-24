// src/components/Layout/PrivateRoute.js

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);
  const guestUser = localStorage.getItem('guest_user_id');
  return auth.token || guestUser ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
