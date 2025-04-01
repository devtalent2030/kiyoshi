import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosInstance';
import sushiProfile from '../../assets/sushi-profile.JPG';
import { jwtDecode } from 'jwt-decode';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  Collapse,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SushiIcon from '@mui/icons-material/LocalDining';

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover: { scale: 1.05, boxShadow: '0 12px 24px rgba(0, 0, 0, 0.4)' },
};

const CustomerPortal = () => {
  const [profile, setProfile] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingPayment, setEditingPayment] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const theme = useTheme();

  const token = localStorage.getItem('token');
  const userId = token ? jwtDecode(token).id : null;

  const fetchCustomerData = () => {
    if (userId) {
      axiosInstance
        .get(`/api/customers/${userId}`)
        .then((res) => {
          console.log('Profile response:', res.data);
          setProfile(res.data);
          setPaymentInfo(res.data.PaymentInfo || '');
          setPhoneNumber(res.data.PhoneNumber || '');
        })
        .catch((err) => console.error('Error fetching profile:', err.response?.data || err.message));

      axiosInstance
        .get(`/api/customers/${userId}/favorites`)
        .then((res) => {
          console.log('Favorites response:', res.data);
          setFavorites(res.data);
        })
        .catch((err) => console.error('Error fetching favorites:', err.response?.data || err.message));

      axiosInstance
        .get(`/api/customers/${userId}/orders`)
        .then((res) => {
          console.log('Orders response:', res.data);
          setOrders(res.data);
        })
        .catch((err) => console.error('Error fetching orders:', err.response?.data || err.message));
    }
  };

  useEffect(() => {
    fetchCustomerData();
    const interval = setInterval(fetchCustomerData, 10000);
    return () => clearInterval(interval);
  }, [userId]);

  const handleUpdatePaymentInfo = () => {
    axiosInstance
      .put(`/api/customers/${userId}/update-payment`, { paymentInfo })
      .then(() => {
        alert('Payment information updated!');
        setEditingPayment(false);
        fetchCustomerData();
      })
      .catch((err) => console.error('Error updating payment info:', err.response?.data || err.message));
  };

  const handleUpdatePhoneNumber = () => {
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$|^\d{10}$/;
    if (!phoneNumber || !phoneRegex.test(phoneNumber.replace(/-/g, ''))) {
      alert('Please enter a valid phone number (e.g., 123-456-7890 or 1234567890).');
      return;
    }

    axiosInstance
      .put(`/api/customers/${userId}`, { PhoneNumber: phoneNumber })
      .then(() => {
        alert('Phone number updated!');
        setEditingPhone(false);
        fetchCustomerData();
      })
      .catch((err) => console.error('Error updating phone number:', err.response?.data || err.message));
  };

  const handleToggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <Box
      sx={{
        mt: 4,
        px: { xs: 2, sm: 3, md: 4 },
        py: 4,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%)',
        color: '#fff',
        width: '100%',
        maxWidth: '1400px',
        mx: 'auto',
        position: 'relative',
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontFamily: "'Sawarabi Mincho', serif",
            fontWeight: 'bold',
            textAlign: 'center',
            textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8)',
            color: '#ffeb3b', // Gold for top-tier feel
            background: 'linear-gradient(45deg, #ff5722, #ffeb3b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            borderBottom: '2px solid #ffeb3b',
            pb: 1,
            mb: 4,
          }}
        >
          Welcome Back{profile ? `, ${profile.FirstName}!` : '!'}
        </Typography>
      </motion.div>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
            <Card
              sx={{
                p: 2,
                borderRadius: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 235, 59, 0.3)', // Gold border
              }}
            >
              <CardContent>
                <img
                  src={sushiProfile}
                  alt="Profile"
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    margin: '0 auto 1.5rem',
                    display: 'block',
                    border: '3px solid #ffeb3b', // Thicker gold border
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                  }}
                />
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontFamily: "'Sawarabi Mincho', serif",
                    textAlign: 'center',
                    color: '#ffeb3b', // Gold for prominence
                    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  My Sushi Profile
                </Typography>
                {profile ? (
                  <>
                    <Typography variant="body2" sx={{ color: '#ddd' }}>
                      <strong>Name:</strong> {profile.FirstName} {profile.LastName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#ddd' }}>
                      <strong>Email:</strong> {profile.EmailAddress}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#ddd' }}>
                      <strong>Phone:</strong> {phoneNumber || 'Not set'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#ddd' }}>
                      <strong>Payment:</strong> {paymentInfo || 'Not set'}
                    </Typography>
                    {editingPhone ? (
                      <Box sx={{ mt: 2 }}>
                        <TextField
                          label="Update Phone Number"
                          variant="outlined"
                          fullWidth
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="123-456-7890"
                          sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', '& .MuiInputBase-input': { color: '#fff' } }}
                        />
                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            onClick={handleUpdatePhoneNumber}
                            sx={{ backgroundColor: '#ff5722', '&:hover': { backgroundColor: '#e64a19' } }}
                          >
                            Save
                          </Button>
                          <Button variant="outlined" onClick={() => setEditingPhone(false)} sx={{ color: '#fff' }}>
                            Cancel
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="contained"
                          onClick={() => setEditingPhone(true)}
                          sx={{
                            mt: 2,
                            backgroundColor: '#388e3c',
                            '&:hover': { backgroundColor: '#2e6b27' },
                            borderRadius: '20px',
                          }}
                        >
                          Update Phone
                        </Button>
                      </motion.div>
                    )}
                    {editingPayment ? (
                      <Box sx={{ mt: 2 }}>
                        <TextField
                          label="Update Payment Info"
                          variant="outlined"
                          fullWidth
                          value={paymentInfo}
                          onChange={(e) => setPaymentInfo(e.target.value)}
                          sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', '& .MuiInputBase-input': { color: '#fff' } }}
                        />
                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            onClick={handleUpdatePaymentInfo}
                            sx={{ backgroundColor: '#ff5722', '&:hover': { backgroundColor: '#e64a19' } }}
                          >
                            Save
                          </Button>
                          <Button variant="outlined" onClick={() => setEditingPayment(false)} sx={{ color: '#fff' }}>
                            Cancel
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="contained"
                          onClick={() => setEditingPayment(true)}
                          sx={{
                            mt: 2,
                            backgroundColor: '#388e3c',
                            '&:hover': { backgroundColor: '#2e6b27' },
                            borderRadius: '20px',
                          }}
                        >
                          Update Payment
                        </Button>
                      </motion.div>
                    )}
                  </>
                ) : (
                  <Typography variant="body2" sx={{ color: '#b0bec5', textAlign: 'center' }}>
                    Loading your sushi profile...
                  </Typography>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Favorites Card */}
        <Grid item xs={12} md={4}>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
            <Card
              sx={{
                p: 2,
                borderRadius: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 235, 59, 0.3)', // Gold border
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontFamily: "'Sawarabi Mincho', serif",
                    color: '#ffeb3b', // Gold for prominence
                    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  Favorite Sushi
                </Typography>
                {favorites.length > 0 ? (
                  favorites.map((fav) => (
                    <Box key={fav.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <SushiIcon sx={{ mr: 1, color: '#ff5722' }} />
                      <Typography variant="body2" sx={{ color: '#ddd' }}>
                        {fav.itemName} - ${Number(fav.price).toFixed(2)}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ color: '#b0bec5' }}>
                    No sushi favorites yet.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Orders Card */}
        <Grid item xs={12} md={4}>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
            <Card
              sx={{
                p: 2,
                borderRadius: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 235, 59, 0.3)', // Gold border
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontFamily: "'Sawarabi Mincho', serif",
                    color: '#ffeb3b', // Gold for prominence
                    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  Recent Sushi Orders
                </Typography>
                {orders.length > 0 ? (
                  orders.slice(0, 3).map((order) => (
                    <Box key={order.id} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ color: '#ffeb3b' }}>
                          Order #{order.id} - ${order.totalPrice.toFixed(2)} ({order.status})
                        </Typography>
                        <IconButton
                          onClick={() => handleToggleExpand(order.id)}
                          sx={{ color: '#fff' }}
                        >
                          {expandedOrder === order.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Box>
                      <Collapse in={expandedOrder === order.id}>
                        <Box sx={{ mt: 1, backgroundColor: 'rgba(0, 0, 0, 0.2)', p: 1, borderRadius: '5px' }}>
                          {order.items.map((item, index) => (
                            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" sx={{ color: '#ddd' }}>{item.name}</Typography>
                              <Typography variant="body2" sx={{ color: '#ddd' }}>
                                {item.quantity} x ${item.lineTotal.toFixed(2)}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Collapse>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ color: '#b0bec5' }}>
                    No sushi orders yet.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerPortal;