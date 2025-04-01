import React from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SushiIcon from '@mui/icons-material/LocalDining';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

// Animation variants
const buttonVariants = {
  hover: { scale: 1.1, color: '#ffeb3b' },
  tap: { scale: 0.95 },
};

const Header = ({ onDrawerToggle, isSidebarVisible, toggleSidebar }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar
      position="fixed"
      sx={{
        background: 'transparent', // Fully transparent background
        zIndex: (theme) => theme.zIndex.drawer + 1,
        width: '100%', // Full width
        boxShadow: 'none', // Remove shadow for cleaner transparency
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)', // Subtle border instead of solid green
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: { xs: '0 12px', sm: '0 24px' },
          backgroundColor: 'rgba(255, 255, 255, 0.05)', // Very subtle overlay for contrast
          backdropFilter: 'blur(8px)', // Enhanced blur for glassy effect
        }}
      >
        {/* Logo/Title with Toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton
              color="inherit"
              onClick={toggleSidebar}
              sx={{ mr: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%' }}
            >
              {isSidebarVisible ? <CloseIcon sx={{ fontSize: '1.8rem' }} /> : <MenuIcon sx={{ fontSize: '1.8rem' }} />}
            </IconButton>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <SushiIcon sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, mr: 1, color: '#fff' }} />
            {/* Removed "Sushi App" Typography */}
          </motion.div>
        </Box>

        {/* Desktop Nav */}
        {!isSmallScreen && (
          <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 } }}>
            {[
              { to: '/', label: 'Home' },
              { to: '/menu', label: 'Menu' },
              ...(isLoggedIn ? [{ to: '/orders', label: 'Orders' }, { to: '/portal', label: 'Portal' }] : []),
              ...(isAdmin ? [{ to: '/dashboard', label: 'Dashboard' }, { to: '/inventory', label: 'Inventory' }] : []),
              ...(isLoggedIn ? [{ label: 'Logout', onClick: handleLogout }] : []),
            ].map((item, idx) => (
              <motion.div key={idx} variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button
                  color="inherit"
                  sx={{
                    fontFamily: "'Sawarabi Mincho', serif",
                    fontSize: { xs: '0.8rem', sm: '1rem' },
                    textTransform: 'none',
                    color: '#fff',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                  }}
                  component={item.to ? Link : 'button'}
                  to={item.to}
                  onClick={item.onClick}
                >
                  {item.label}
                </Button>
              </motion.div>
            ))}
          </Box>
        )}

        {/* Mobile Hamburger */}
        {isSmallScreen && (
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton
              color="inherit"
              onClick={onDrawerToggle}
              sx={{ ml: 'auto', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%' }}
            >
              <MenuIcon sx={{ fontSize: '1.8rem' }} />
            </IconButton>
          </motion.div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;