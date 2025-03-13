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
import { motion } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';
import SushiIcon from '@mui/icons-material/LocalDining'; // Sushi-themed icon
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

// Animation variants
const buttonVariants = {
  hover: { scale: 1.1, color: '#ffeb3b' },
  tap: { scale: 0.95 },
};

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
        background: 'linear-gradient(90deg, #ff5722 0%, #ef5350 100%)', // Sushi orange gradient
        zIndex: (theme) => theme.zIndex.drawer + 1,
        width: '100%',
        maxWidth: '1400px',
        mx: 'auto',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        borderBottom: '2px solid #388e3c', // Seaweed green accent
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: { xs: '0 12px', sm: '0 24px' },
          backgroundColor: 'rgba(255, 255, 255, 0.1)', // Glassy overlay
          backdropFilter: 'blur(5px)',
        }}
      >
        {/* Logo/Title */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <SushiIcon sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, mr: 1, color: '#fff' }} />
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Sawarabi Mincho', serif",
                fontWeight: 'bold',
                color: '#fff',
                textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
                fontSize: { xs: '1.2rem', sm: '1.5rem' },
              }}
            >
              
            </Typography>
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