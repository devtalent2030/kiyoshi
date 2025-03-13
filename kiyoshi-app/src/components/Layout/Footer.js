import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <Box
        component="footer"
        sx={{
          mt: 'auto',
          py: 2,
          px: { xs: 1, sm: 2 },
          textAlign: 'center',
          background: 'linear-gradient(90deg, #ff5722 0%, #ef5350 100%)', // Sushi orange gradient
          color: '#fff',
          borderTop: '2px solid #388e3c', // Seaweed green accent
          backgroundColor: 'rgba(255, 255, 255, 0.1)', // Glassy overlay
          backdropFilter: 'blur(5px)',
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontFamily: "'Sawarabi Mincho', serif",
            fontSize: { xs: '0.9rem', sm: '1rem' },
            lineHeight: 1.5,
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
          }}
        >
          © {new Date().getFullYear()} Sushi Bai Kiyoshi. All rights reserved.
        </Typography>
      </Box>
    </motion.div>
  );
};

export default Footer;