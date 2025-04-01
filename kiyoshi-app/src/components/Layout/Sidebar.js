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
  IconButton,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import SushiIcon from '@mui/icons-material/LocalDining';
import CloseIcon from '@mui/icons-material/Close';
import '../../assets/Sidebar.css';

const drawerWidth = 260;

const Sidebar = ({ mobileOpen, onDrawerToggle, isSidebarVisible, setIsSidebarVisible }) => {
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

  const toggleSidebar = () => {
    const newVisibility = !isSidebarVisible;
    setIsSidebarVisible(newVisibility);
    localStorage.setItem('sidebarVisible', newVisibility);
  };

  const drawerContent = (
    <>
      <Toolbar
        sx={{
          background: 'linear-gradient(135deg, rgba(255, 235, 59, 0.3) 0%, rgba(56, 142, 60, 0.3) 100%)', // Slightly opaque for contrast
          backdropFilter: 'blur(15px)',
          borderBottom: '1px solid rgba(255, 235, 59, 0.5)',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: '#000', // Black and bold
            fontFamily: "'Sawarabi Mincho', serif",
            textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)', // Light shadow for readability
          }}
        >
          {isLoggedIn ? (isAdmin ? 'Sushi Admin' : 'Sushi Customer') : 'Sushi Guest'}
        </Typography>
        <IconButton onClick={toggleSidebar} sx={{ color: '#000' }}>
          <CloseIcon />
        </IconButton>
      </Toolbar>

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
                '&:hover': { backgroundColor: 'rgba(255, 235, 59, 0.2)' },
                py: 1.5,
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <SushiIcon sx={{ mr: 2, color: '#ff5722' }} />
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: 'bold',
                  color: '#000', // Black and bold
                  fontFamily: "'Sawarabi Mincho', serif",
                  letterSpacing: '0.5px',
                  textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)', // Light shadow for readability
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  if (!isSidebarVisible) {
    return null;
  }

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      >
        <canvas id="sushiShaderCanvas" />
      </Box>

      {/* Desktop Sidebar (Persistent) */}
      {isMediumUp && (
        <Drawer
          variant="persistent"
          open={isSidebarVisible}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              background: 'rgba(255, 255, 255, 0.15)', // Slightly more opaque for black text
              backdropFilter: 'blur(15px)',
              borderRight: '2px solid rgba(255, 235, 59, 0.5)',
              overflow: 'hidden',
              boxShadow: '4px 0 20px rgba(0, 0, 0, 0.4)',
              zIndex: 2,
              borderRadius: '0 20px 20px 0',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Mobile Sidebar (Temporary) */}
      {!isMediumUp && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              background: 'rgba(255, 255, 255, 0.15)', // Slightly more opaque for black text
              backdropFilter: 'blur(15px)',
              borderRight: '2px solid rgba(255, 235, 59, 0.5)',
              overflow: 'hidden',
              boxShadow: '4px 0 20px rgba(0, 0, 0, 0.4)',
              zIndex: 2,
              borderRadius: '0 20px 20px 0',
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