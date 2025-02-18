import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const Header = ({ onDrawerToggle }) => {
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
        backgroundColor: '#ef5350',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        width: '100%',
        maxWidth: '1200px', // Limit the header width
        margin: '0 auto', // Center the header
        left: 0, // Ensure alignment
        right: 0, // Ensure alignment
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: { xs: '0 8px', sm: '0 16px' }, // Reduced padding for smaller screens
        }}
      >
        {/* Title / Logo */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            whiteSpace: 'nowrap', // Prevent text from wrapping
            overflow: 'hidden', // Hide overflow content
            textOverflow: 'ellipsis', // Add ellipsis if content overflows
            fontSize: { xs: '1rem', sm: '1.2rem' }, // Smaller font size on mobile
          }}
        >
          Kiyoshi Take-Out
        </Typography>

        {/* Desktop Nav */}
        {!isSmallScreen && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" sx={{ fontSize: '0.9rem' }} component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" sx={{ fontSize: '0.9rem' }} component={Link} to="/menu">
              Menu
            </Button>
            {isLoggedIn && (
              <Button color="inherit" sx={{ fontSize: '0.9rem' }} component={Link} to="/orders">
                Orders
              </Button>
            )}
            {isLoggedIn && (
              <Button color="inherit" sx={{ fontSize: '0.9rem' }} component={Link} to="/portal">
                Customer Portal
              </Button>
            )}
            {isAdmin && (
              <Button color="inherit" sx={{ fontSize: '0.9rem' }} component={Link} to="/dashboard">
                Dashboard
              </Button>
            )}
            {isAdmin && (
              <Button color="inherit" sx={{ fontSize: '0.9rem' }} component={Link} to="/inventory">
                Inventory
              </Button>
            )}
            {isLoggedIn && (
              <Button color="inherit" sx={{ fontSize: '0.9rem' }} onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Box>
        )}

        {/* Mobile Hamburger Icon */}
        {isSmallScreen && (
          <IconButton
            color="inherit"
            onClick={onDrawerToggle}
            sx={{
              marginLeft: 'auto', // Push to the right
            }}
          >
            <MenuIcon sx={{ fontSize: '1.5rem' }} />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;