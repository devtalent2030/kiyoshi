import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosInstance';
import sushiProfile from '../../assets/sushi-profile.JPG';
import { jwtDecode } from 'jwt-decode';
import {
  Box,
  Typography,
  Table,
  TableContainer,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme,
} from '@mui/material';

const CustomerPortal = () => {
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const theme = useTheme();

  const token = localStorage.getItem('token');
  const userId = token ? jwtDecode(token).id : null;

  useEffect(() => {
    if (userId) {
      axiosInstance
        .get(`/customers/${userId}`)
        .then((res) => setProfile(res.data))
        .catch((err) => console.error('Error fetching profile:', err));

      axiosInstance
        .get(`/customers/${userId}/orders`)
        .then((res) => setOrders(res.data))
        .catch((err) => console.error('Error fetching orders:', err));

      axiosInstance
        .get(`/customers/${userId}/favorites`)
        .then((res) => setFavorites(res.data))
        .catch((err) => console.error('Error fetching favorites:', err));
    }
  }, [userId]);

  const handleReOrder = (orderId) => {
    axiosInstance
      .post(`/orders/reorder`, { orderId })
      .then(() => alert('Order placed successfully!'))
      .catch((err) => console.error('Error re-ordering:', err));
  };

  const handleUpdateProfile = () => alert('Redirect to profile update form!');

  return (
    <Box
      sx={{
        mt: 3,
        px: { xs: 1, sm: 2, md: 3 }, // Dynamic padding
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontSize: { xs: '1rem', md: '1.5rem' }, // Scaled font size
          textAlign: 'center',
          fontWeight: 'bold',
          color: theme.palette.primary.main,
        }}
      >
        Welcome Back{profile ? `, ${profile.FirstName}!` : '!'}
      </Typography>

      <Grid container spacing={1}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card raised sx={{ p: 2 }}>
            <CardContent>
              <img
                src={sushiProfile}
                alt={`${profile?.FirstName || 'Profile'} ${profile?.LastName || ''}`}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginBottom: '0.5rem',
                }}
              />
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontSize: { xs: '0.9rem', md: '1.2rem' } }}
              >
                My Profile
              </Typography>
              {profile ? (
                <>
                  <Typography variant="body2">
                    <strong>Name:</strong> {profile.FirstName} {profile.LastName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Email:</strong> {profile.EmailAddress}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Phone:</strong> {profile.PhoneNumber}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Payment Info:</strong> {profile.PaymentInfo || 'N/A'}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      mt: 2,
                      fontSize: '0.8rem',
                      padding: '4px 8px',
                    }}
                    onClick={handleUpdateProfile}
                  >
                    Update Profile
                  </Button>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Loading profile...
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Orders Table */}
        <Grid item xs={12} md={8}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }}
          >
            My Orders
          </Typography>
          <TableContainer
            component={Paper}
            sx={{
              overflowX: 'auto',
              maxWidth: '100%',
            }}
          >
            <Table size="small" sx={{ minWidth: { xs: '100%', md: 650 } }}>
              <TableHead>
                <TableRow>
                  <TableCell>Order #</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>
                        {new Date(order.orderDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            fontSize: '0.8rem',
                            padding: '4px 8px',
                          }}
                          onClick={() => handleReOrder(order.id)}
                        >
                          Re-order
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Favorites Section */}
        <Grid item xs={12}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }}
          >
            My Favorites
          </Typography>
          <Grid container spacing={1}>
            {favorites.length > 0 ? (
              favorites.map((item) => (
                <Grid item xs={6} sm={4} md={3} key={item.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" fontWeight="bold">
                        {item.itemName}
                      </Typography>
                      <Typography variant="body2">
                        ${item.price.toFixed(2)}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          fontSize: '0.8rem',
                          padding: '4px 8px',
                          mt: 1,
                        }}
                        onClick={() => handleReOrder(item.id)}
                      >
                        Order Again
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  textAlign: 'center',
                  width: '100%',
                }}
              >
                No favorites found.
              </Typography>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerPortal;
