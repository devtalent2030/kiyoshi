import React, { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import axios from 'axios';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Badge,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SushiIcon from '@mui/icons-material/LocalDining'; // Sushi-like icon
import { useNavigate } from 'react-router-dom';

// Animation variants for cards
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover: { scale: 1.05, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)' },
};

const Menu = () => {
  const [items, setItems] = useState([]);
  const { cart, addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:4000/api/menu')
      .then((res) => {
        console.log('Menu API Response:', res.data);
        setItems(res.data);
      })
      .catch((err) => console.error('Error fetching menu:', err));
  }, []);

  useEffect(() => {
    console.log('Cart state in Menu:', cart);
  }, [cart]);

  const handleAddToCart = (item) => {
    console.log('Adding to cart:', item);
    addToCart(item);
  };

  return (
    <Box
      sx={{
        p: 4,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%)', // Dark sushi-inspired gradient
        color: '#fff',
        position: 'relative',
      }}
    >
      {/* Header with Cart Icon */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h3"
            sx={{
              fontFamily: "'Sawarabi Mincho', serif",
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
            }}
          >
            Explore Our Sushi Menu
          </Typography>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <IconButton
            color="inherit"
            onClick={() => navigate('/cart')}
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%' }}
          >
            <Badge badgeContent={cart.length} color="secondary">
              <ShoppingCartIcon fontSize="large" />
            </Badge>
          </IconButton>
        </motion.div>
      </Box>

      {/* Menu Grid */}
      <Grid container spacing={3}>
        {items.length > 0 ? (
          items.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <Card
                  sx={{
                    borderRadius: '15px',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Glassmorphism
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: '200px',
                      backgroundImage: `url(${
                        item.imageURL
                          ? `http://localhost:4000${item.imageURL}`
                          : '/menu-items/placeholder.jpg'
                      })`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderBottom: '2px solid #388e3c', // Seaweed green accent
                    }}
                  />
                  <CardContent sx={{ textAlign: 'center', color: '#fff' }}>
                    <Typography
                      variant="h6"
                      sx={{ fontFamily: "'Sawarabi Mincho', serif", fontWeight: 'bold' }}
                    >
                      {item.itemName}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#ffeb3b' }}>
                      ${Number(item.price).toFixed(2)}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <motion.div whileTap={{ scale: 0.95 }} transition={{ type: 'spring' }}>
                      <Button
                        variant="contained"
                        onClick={() => handleAddToCart(item)}
                        startIcon={<SushiIcon />}
                        sx={{
                          backgroundColor: '#ff5722', // Salmon orange
                          '&:hover': { backgroundColor: '#e64a19' },
                          borderRadius: '20px',
                          padding: '0.5rem 1.5rem',
                          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        Add to Cart
                      </Button>
                    </motion.div>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))
        ) : (
          <Box sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <Typography
                variant="h6"
                sx={{ fontFamily: "'Sawarabi Mincho', serif", color: '#fff' }}
              >
                Loading Sushi Delights...
              </Typography>
            </motion.div>
          </Box>
        )}
      </Grid>
    </Box>
  );
};

export default Menu;