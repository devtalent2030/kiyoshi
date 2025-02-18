// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Footer from './components/Layout/Footer';

import Home from './components/Pages/Home';
import Login from './components/Pages/Login';
import Signup from './components/Pages/Signup';
import Dashboard from './components/Pages/Dashboard';
import Orders from './components/Pages/Orders';
import Inventory from './components/Pages/Inventory';
import CustomerPortal from './components/Pages/CustomerPortal';
import ProtectedRoute from './components/Pages/ProtectedRoute';
import Menu from './components/Pages/Menu';

const App = () => {
  // Controls Sidebar drawer on mobile
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Router>
      {/*
        Pass handleDrawerToggle to Header so it can open the Sidebar on small screens
      */}
      <Header onDrawerToggle={handleDrawerToggle} />
      
      <Box sx={{ display: 'flex', pt: { xs: 8, sm: 8 } }}>
        {/*
          Pass mobileOpen + handleDrawerToggle to Sidebar so it can act as 
          a permanent drawer on desktop or a temporary drawer on mobile
        */}
        <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />
        
        {/* Main Content Area */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute>
                  <Inventory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portal"
              element={
                <ProtectedRoute>
                  <CustomerPortal />
                </ProtectedRoute>
              }
            />
            <Route path="/menu" element={<Menu />} />
          </Routes>
        </Box>
      </Box>

      <Footer />
    </Router>
  );
};

export default App;
