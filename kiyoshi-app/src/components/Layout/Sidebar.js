// src/components/Layout/Sidebar.js
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
import '../../assets/Sidebar.css'; 

// Images
import img1 from '../../assets/side-icons/od1.png';
import img2 from '../../assets/side-icons/od2.png';
import img3 from '../../assets/side-icons/od4.png';
import img4 from '../../assets/side-icons/xr1.png';
import img5 from '../../assets/side-icons/xr2.png';
import img6 from '../../assets/side-icons/od3.png';
import img7 from '../../assets/side-icons/gr2.png';
import img8 from '../../assets/side-icons/gr4.png';

const drawerWidth = 240;

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

  // The content we want inside the drawer
  const drawerContent = (
    <>
      {/* Animated Background */}
      <div className="sidebar-animation-container">
        <img src={img1} alt="icon1" className="sidebar-icon icon1" />
        <img src={img2} alt="icon2" className="sidebar-icon icon2" />
        <img src={img3} alt="icon3" className="sidebar-icon icon3" />
        <img src={img4} alt="icon4" className="sidebar-icon icon4" />
        <img src={img5} alt="icon5" className="sidebar-icon icon5" />
        <img src={img6} alt="icon6" className="sidebar-icon icon6" />
        <img src={img7} alt="Order Now 1" className="sidebar-icon order-now order-now-1" />
        <img src={img8} alt="Order Now 2" className="sidebar-icon order-now order-now-2" />
      </div>

      {/* Sidebar Header */}
      <Toolbar>
        <Box sx={{ textAlign: 'center', width: '100%' }}>
          <Typography variant="h6" sx={{ color: '#000' }}>
            {isLoggedIn ? (isAdmin ? 'Admin Panel' : 'Customer') : 'Guest'}
          </Typography>
        </Box>
      </Toolbar>

      {/* Sidebar Menu */}
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/">
            <ListItemText primary="Home" primaryTypographyProps={{ fontWeight: 'bold', color: '#000' }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/menu">
            <ListItemText primary="Menu" primaryTypographyProps={{ fontWeight: 'bold', color: '#000' }} />
          </ListItemButton>
        </ListItem>

        {isLoggedIn && (
          <>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/orders">
                <ListItemText primary="Orders" primaryTypographyProps={{ fontWeight: 'bold', color: '#000' }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/portal">
                <ListItemText primary="Customer Portal" primaryTypographyProps={{ fontWeight: 'bold', color: '#000' }} />
              </ListItemButton>
            </ListItem>
          </>
        )}

        {isAdmin && (
          <>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/dashboard">
                <ListItemText primary="Dashboard" primaryTypographyProps={{ fontWeight: 'bold', color: '#000' }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/inventory">
                <ListItemText primary="Inventory" primaryTypographyProps={{ fontWeight: 'bold', color: '#000' }} />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </>
  );

  return (
    <>
      {/* On medium+ screens, show a permanent drawer */}
      {isMediumUp && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              position: 'relative',
              overflow: 'hidden',
              background: 'linear-gradient(to bottom, #FF8C00, #FF4500)',
              color: '#000',
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      )}

      {/* On small screens, use a temporary drawer that slides in */}
      {!isMediumUp && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: 'linear-gradient(to bottom, #FF8C00, #FF4500)',
              color: '#000',
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
