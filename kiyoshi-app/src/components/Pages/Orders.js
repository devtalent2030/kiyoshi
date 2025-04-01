import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Collapse,
  IconButton,
  Grid,
} from '@mui/material';
import { motion } from 'framer-motion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import axiosInstance from '../../axiosInstance';

// Animation variants
const orderVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover: { scale: 1.02, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)' },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchOrders = () => {
    axiosInstance
      .get('/api/orders')
      .then((res) => {
        console.log('Orders API Response:', res.data);
        setOrders(res.data);
      })
      .catch((err) => {
        console.error('Error fetching orders:', err.response?.data || err.message);
      });
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Real-time polling
    return () => clearInterval(interval);
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = searchTerm
      ? order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm)
      : true;
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const handleToggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <Box
      sx={{
        pt: { xs: 6, sm: 8 },
        px: { xs: 2, sm: 4 },
        pb: 4,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%)', // Sushi-themed gradient
        color: '#fff',
        overflowX: 'hidden',
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
          variant="h3"
          gutterBottom
          sx={{
            fontFamily: "'Sawarabi Mincho', serif",
            fontWeight: 'bold',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
          }}
        >
          Sushi Orders
        </Typography>
      </motion.div>

      {/* Filters */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 4,
          flexWrap: 'wrap',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(5px)',
          p: 2,
          borderRadius: '10px',
        }}
      >
        <TextField
          label="Search by Customer or ID"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{
            flex: '1 1 250px',
            maxWidth: '300px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '5px',
            '& .MuiInputBase-input': { color: '#fff' },
            '& .MuiInputLabel-root': { color: '#ffeb3b' },
          }}
        />
        <FormControl
          sx={{
            flex: '1 1 150px',
            maxWidth: '200px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '5px',
          }}
        >
          <InputLabel sx={{ color: '#ffeb3b' }}>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
            size="small"
            sx={{ color: '#fff' }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Orders Grid */}
      <Grid container spacing={3}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <motion.div
                variants={orderVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <Card
                  sx={{
                    borderRadius: '15px',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Glassmorphism
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
                    overflow: 'hidden',
                  }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: "'Sawarabi Mincho', serif",
                          fontWeight: 'bold',
                          color: '#ddd', // Changed from black to light grey
                        }}
                      >
                        Order #{order.id} - {order.customerName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#ffeb3b' }}>
                        Status: {order.status}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: '#ddd' }} // Changed from black to light grey
                      >
                        Total: ${order.totalPrice.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#b0bec5' }}>
                        {new Date(order.orderDate).toLocaleString()}
                      </Typography>
                    </Box>
                    <IconButton
                      onClick={() => handleToggleExpand(order.id)}
                      sx={{ color: '#fff' }}
                    >
                      {expandedOrder === order.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </CardContent>
                  <Collapse in={expandedOrder === order.id}>
                    <CardContent sx={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', p: 2 }}>
                      <Grid container spacing={1}>
                        <Grid item xs={6}><Typography variant="subtitle1" sx={{ color: '#ddd' }}>Item</Typography></Grid>
                        <Grid item xs={3}><Typography variant="subtitle1" sx={{ color: '#ddd' }}>Qty</Typography></Grid>
                        <Grid item xs={3}><Typography variant="subtitle1" sx={{ color: '#ddd' }}>Total</Typography></Grid>
                        {order.items.map((item, index) => (
                          <React.Fragment key={index}>
                            <Grid item xs={6}>
                              <Typography variant="body2" sx={{ color: '#ddd' }}>{item.name}</Typography>
                            </Grid>
                            <Grid item xs={3}>
                              <Typography variant="body2" sx={{ color: '#ddd' }}>{item.quantity}</Typography>
                            </Grid>
                            <Grid item xs={3}>
                              <Typography variant="body2" sx={{ color: '#ddd' }}>${item.lineTotal.toFixed(2)}</Typography>
                            </Grid>
                          </React.Fragment>
                        ))}
                      </Grid>
                    </CardContent>
                  </Collapse>
                </Card>
              </motion.div>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <Typography
                variant="h6"
                sx={{ textAlign: 'center', fontFamily: "'Sawarabi Mincho', serif'" }}
              >
                No Sushi Orders Found
              </Typography>
            </motion.div>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Orders;