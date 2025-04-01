import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

import { CartProvider } from './context/CartContext';

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
import Cart from './components/Pages/Cart';

const App = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    const sidebarPreference = localStorage.getItem('sidebarVisible');
    setIsSidebarVisible(sidebarPreference !== 'false'); // Load from localStorage
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const toggleSidebar = () => {
    const newVisibility = !isSidebarVisible;
    setIsSidebarVisible(newVisibility);
    localStorage.setItem('sidebarVisible', newVisibility);
  };

  return (
    <CartProvider>
      <Router>
        <Header 
          onDrawerToggle={handleDrawerToggle} 
          isSidebarVisible={isSidebarVisible} 
          toggleSidebar={toggleSidebar} 
        />
        <Box sx={{ display: 'flex', pt: { xs: 8, sm: 8 } }}>
          <Sidebar 
            mobileOpen={mobileOpen} 
            onDrawerToggle={handleDrawerToggle} 
            isSidebarVisible={isSidebarVisible} 
            setIsSidebarVisible={setIsSidebarVisible} 
          />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
              <Route path="/portal" element={<ProtectedRoute><CustomerPortal /></ProtectedRoute>} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </Box>
        </Box>
        <Footer />
      </Router>
    </CartProvider>
  );
};

export default App;