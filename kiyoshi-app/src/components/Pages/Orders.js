import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import axiosInstance from '../../axiosInstance';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    axiosInstance
      .get('/orders')
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.error('Error fetching orders:', err);
      });
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = searchTerm
      ? order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm)
      : true;
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box
      sx={{
        pt: { xs: 8, sm: 8 },
        px: { xs: 2, sm: 3 },
        pb: 3,
        background: 'linear-gradient(to bottom, #ffffff, #f5f5f5)',
        minHeight: '100vh',
        width: '100vw',
        maxWidth: '100%',
        overflowX: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 'bold', color: '#ef5350', textAlign: 'center' }}
      >
        Orders
      </Typography>

      {/* Search & Filter Row */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
          flexWrap: 'wrap',
          alignItems: 'center',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <TextField
          label="Search by Customer or Order ID"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{
            flex: '1 1 auto',
            maxWidth: '300px',
            minWidth: '200px',
          }}
        />
        <FormControl
          sx={{
            flex: '1 1 auto',
            maxWidth: '200px',
            minWidth: '150px',
          }}
        >
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
            size="small"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Orders Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          overflowX: 'auto',
          maxWidth: '100%',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Table
          sx={{
            minWidth: 600,
            tableLayout: 'fixed',
          }}
        >
          <TableHead>
            <TableRow sx={{ backgroundColor: '#ef5350' }}>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Order ID</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Customer Name</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Total Price</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Order Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                <TableCell>{new Date(order.orderDate).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Orders;
