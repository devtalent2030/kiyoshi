import React, { useEffect, useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  useMediaQuery,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import SushiIcon from '@mui/icons-material/LocalDining';
import '../../assets/Sidebar.css';

const drawerWidth = 260;

const Sidebar = ({ mobileOpen, onDrawerToggle }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const theme = useTheme();
  const isMediumUp = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    setIsLoggedIn(Boolean(token));
    setUser(storedUser);
    setIsAdmin(storedUser?.role === 'admin');
  }, []);

  const drawerContent = (
    <>
      {/* Sidebar Header */}
      <Toolbar
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)', // Makes sidebar semi-transparent
          zIndex: 2, // Keeps sidebar above content but under animation
        }}
      >
        <Box sx={{ textAlign: 'center', width: '100%' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: '#fff',
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
            }}
          >
            {isLoggedIn ? (isAdmin ? 'Sushi Admin' : 'Sushi Customer') : 'Sushi Guest'}
          </Typography>
        </Box>
      </Toolbar>

      {/* Sidebar Menu */}
      <List sx={{ position: 'relative', zIndex: 2 }}>
        {[
          { to: '/', label: 'Home' },
          { to: '/menu', label: 'Menu' },
          ...(isLoggedIn ? [{ to: '/orders', label: 'Orders' }, { to: '/portal', label: 'Customer Portal' }] : []),
          ...(isAdmin ? [{ to: '/dashboard', label: 'Dashboard' }, { to: '/inventory', label: 'Inventory' }] : []),
        ].map((item, idx) => (
          <ListItem key={idx} disablePadding>
            <ListItemButton
              component={Link}
              to={item.to}
              sx={{
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                py: 1.5,
              }}
            >
              <SushiIcon sx={{ mr: 2, color: '#ff5722' }} />
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: 'bold',
                  color: '#fff',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <>
      {/* Ensure the Shader Animation is placed in the background */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1, // Push animation behind everything
          pointerEvents: 'none', // Ensures sidebar interactivity
        }}
      >
        {/* Sushi Shader Animation */}
        <canvas id="sushiShaderCanvas" />
      </Box>

      {/* Permanent Drawer (Desktop) */}
      {isMediumUp && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              background: 'rgba(20, 20, 20, 0.7)', // Semi-transparent background
              backdropFilter: 'blur(10px)',
              borderRight: '2px solid #ff5722',
              overflow: 'hidden',
              boxShadow: '2px 0 10px rgba(0, 0, 0, 0.3)',
              zIndex: 2, // Keeps sidebar interactive but below animations
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Temporary Drawer (Mobile) */}
      {!isMediumUp && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              background: 'rgba(20, 20, 20, 0.7)',
              backdropFilter: 'blur(10px)',
              borderRight: '2px solid #ff5722',
              overflow: 'hidden',
              boxShadow: '2px 0 10px rgba(0, 0, 0, 0.3)',
              zIndex: 2,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;