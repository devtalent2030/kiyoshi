import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = Boolean(localStorage.getItem('token')); // Check if the user is logged in
  return isLoggedIn ? children : <Navigate to="/" />; // Redirect to home page if not logged in
};

export default ProtectedRoute;
