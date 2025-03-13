import React from 'react';
import { useCart } from '../context/CartContext';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const getTotalPrice = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleConfirmOrder = () => {
    clearCart(); // Already cleared in Cart.jsx, but here for safety
    navigate('/customer-portal');
  };

  return (
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: '#f5f5f5', maxWidth: '1200px', mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', color: '#ef5350' }}>
        Order Confirmation
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 500, margin: 'auto' }}>
        <Typography variant="h6">Order Summary</Typography>
        {cart.length > 0 ? (
          <>
            {cart.map((item) => (
              <Typography key={item.id} variant="body1" sx={{ mt: 1 }}>
                {item.itemName} x {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
              </Typography>
            ))}
            <Typography variant="h6" sx={{ mt: 2, textAlign: 'right' }}>
              Total: ${getTotalPrice().toFixed(2)}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, color: 'green' }}>
              Your order has been placed successfully!
            </Typography>
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 3, backgroundColor: '#26a69a' }}
              onClick={handleConfirmOrder}
            >
              Back to Portal
            </Button>
          </>
        ) : (
          <Typography variant="body1" color="error">
            No items in cart. Order may have already been processed.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Checkout;