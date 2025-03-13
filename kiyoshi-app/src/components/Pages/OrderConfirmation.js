import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ textAlign: "center", p: 5 }}>
      <Typography variant="h4" color="primary">Order Confirmed! ✅</Typography>
      <Typography>Your order has been successfully placed.</Typography>
      <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate("/")}>
        Return to Home
      </Button>
    </Box>
  );
};

export default OrderConfirmation;