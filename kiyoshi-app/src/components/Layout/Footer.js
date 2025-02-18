import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 2,
        px: { xs: 1, sm: 2 },
        textAlign: 'center',
        backgroundColor: '#ef5350',
        color: '#fff',
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontSize: { xs: '0.8rem', sm: '1rem' },
          lineHeight: 1.5,
        }}
      >
        © {new Date().getFullYear()} Sushi Bai Kiyoshi. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
