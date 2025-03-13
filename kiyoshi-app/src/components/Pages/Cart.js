import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import {
  Box,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';
import { jwtDecode } from 'jwt-decode';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false); // State to control dialog visibility
  const [orderId, setOrderId] = useState(null); // State to store the order ID

  // Check if user is logged in by retrieving token
  const token = localStorage.getItem('token');
  const userId = token ? jwtDecode(token).id : null; // Set to null if no token (guest)

  const getTotalPrice = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!cart.length) {
      alert('Your cart is empty.');
      return;
    }

    try {
      // Prepare order data, making customerId optional for guests
      const orderData = {
        // Only include customerId if the user is logged in
        ...(userId && { customerId: userId }),
        orderDate: new Date().toISOString(),
        orderStatus: 'Completed',
        totalPrice: getTotalPrice(),
        orderItems: cart.map((item) => ({
          MenuItemID: item.id,
          Quantity: item.quantity,
          LineTotal: item.price * item.quantity,
        })),
      };

      console.log('Sending order data:', JSON.stringify(orderData, null, 2));

      const response = await axiosInstance.post('/api/orders', orderData);

      console.log('Full response:', response);

      if (response.data.success) {
        setOrderId(response.data.orderId); // Store the order ID
        setOpenDialog(true); // Open the custom dialog
        clearCart();
        // Navigate after 10 seconds
        setTimeout(() => {
          setOpenDialog(false);
          navigate(userId ? '/customer-portal' : '/'); // Navigate to portal if logged in, homepage if guest
        }, 10000);
      } else {
        console.error('Order failed with response:', response.data);
        alert('Failed to place order: ' + (response.data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Checkout error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      alert('Failed to place order: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    navigate(userId ? '/customer-portal' : '/'); // Navigate to portal if logged in, homepage if guest
  };

  return (
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: '#f5f5f5', maxWidth: '1200px', mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#ef5350', fontWeight: 'bold', textAlign: 'center' }}>
        Shopping Cart
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#ef5350' }}>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Item</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Price</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Quantity</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Total</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.length > 0 ? (
              cart.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>${Number(item.price).toFixed(2)}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      size="small"
                      sx={{ width: 60 }}
                      inputProps={{ min: 1 }}
                    />
                  </TableCell>
                  <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="error" onClick={() => removeFromCart(item.id)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Your cart is empty.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {cart.length > 0 && (
        <>
          <Typography variant="h5" sx={{ textAlign: 'right', mt: 3 }}>
            Total: ${getTotalPrice().toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3, backgroundColor: '#26a69a' }}
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </Button>
        </>
      )}

      {/* Enhanced Dialog for Order Confirmation */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#1a1a1a',
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://www.transparenttextures.com/patterns/bamboo.png")',
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
            textAlign: 'center',
            p: 4,
            border: '2px solid #d4af37',
          },
        }}
      >
        <DialogTitle sx={{ color: '#d4af37', fontWeight: 'bold', fontSize: '2rem', fontFamily: '"Playfair Display", serif' }}>
          🍣 Order Confirmed 🍣
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ color: '#fff', fontFamily: '"Roboto", sans-serif', mb: 2 }}>
            Thank you for your order at Yoshi Take!
          </Typography>
          <Typography variant="body1" sx={{ color: '#fff', fontSize: '1.2rem' }}>
            Your order <strong>#{orderId}</strong> has been successfully confirmed.
          </Typography>
          <Typography variant="body2" sx={{ color: '#d4af37', mt: 1, fontStyle: 'italic' }}>
            We’ll prepare your sushi with the finest ingredients. Enjoy!
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button
            onClick={handleCloseDialog}
            variant="contained"
            sx={{
              backgroundColor: '#ef5350',
              color: '#fff',
              fontWeight: 'bold',
              px: 4,
              py: 1,
              '&:hover': { backgroundColor: '#c62828' },
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Cart;