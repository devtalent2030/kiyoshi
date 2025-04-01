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
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SushiIcon from '@mui/icons-material/LocalDining';
import CakeIcon from '@mui/icons-material/Cake';
import AppetizerIcon from '@mui/icons-material/RestaurantMenu';
import SetMealIcon from '@mui/icons-material/SetMeal';
import CelebrationIcon from '@mui/icons-material/Celebration'; // Added for promo
import { useNavigate } from 'react-router-dom';

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  hover: { scale: 1.05, boxShadow: '0 12px 24px rgba(0, 0, 0, 0.4)' },
};

const categoryVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const promoCardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } },
  hover: { scale: 1.02, boxShadow: '0 15px 30px rgba(0, 0, 0, 0.5)' },
};

const Menu = () => {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { cart, addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:4000/api/menu')
      .then((res) => {
        console.log('Raw API Response:', JSON.stringify(res.data, null, 2));
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

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || item.Category || 'Uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    console.log(`Item: ${item.itemName}, Assigned Category: ${category}`);
    return acc;
  }, {});

  console.log('Grouped Items:', JSON.stringify(groupedItems, null, 2));

  // Define category styles based on your database
  const categoryStyles = {
    'Desserts': { color: '#4caf50', icon: <CakeIcon /> },
    'Nigiri': { color: '#ff5722', icon: <SushiIcon /> },
    'Rolls': { color: '#ffeb3b', icon: <AppetizerIcon /> },
    'Sashimi': { color: '#2196f3', icon: <SushiIcon /> },
    'Sets': { color: '#9c27b0', icon: <SetMealIcon /> },
    'Sides': { color: '#ff9800', icon: <AppetizerIcon /> },
    'Uncategorized': { color: '#fff', icon: null },
  };

  // Get sorted categories and filterable list
  const allCategories = Object.keys(groupedItems).sort();
  const categories = ['All', ...allCategories.filter(cat => cat !== 'Uncategorized')];

  // Filter items based on selected category
  const filteredItems = selectedCategory === 'All'
    ? groupedItems
    : { [selectedCategory]: groupedItems[selectedCategory] };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%)',
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
          px: 2,
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
              textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8)',
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

      {/* Category Filter */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? 'contained' : 'outlined'}
            onClick={() => setSelectedCategory(cat)}
            sx={{
              color: '#fff',
              borderColor: '#ffeb3b',
              backgroundColor: selectedCategory === cat ? '#ff5722' : 'transparent',
              '&:hover': { borderColor: '#ffeb3b', backgroundColor: '#e64a19' },
            }}
          >
            {cat}
          </Button>
        ))}
      </Box>

      {/* Categories and Menu Items */}
      {Object.keys(filteredItems).length > 0 ? (
        Object.entries(filteredItems).map(([category, categoryItems]) => (
          categoryItems && categoryItems.length > 0 ? (
            <Box key={category} sx={{ mb: 6 }}>
              <motion.div variants={categoryVariants} initial="hidden" animate="visible">
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: "'Sawarabi Mincho', serif",
                    fontWeight: 'bold',
                    color: categoryStyles[category]?.color || '#ffeb3b',
                    textShadow: '1px 1px 4px rgba(0, 0, 0, 0.6)',
                    mb: 2,
                    pl: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  {categoryStyles[category]?.icon}
                  {category}
                </Typography>
                <Divider
                  sx={{
                    borderColor: 'rgba(255, 235, 59, 0.5)',
                    mb: 3,
                    mx: 2,
                    borderWidth: '1px',
                  }}
                />
              </motion.div>
              <Grid container spacing={3} sx={{ px: 2 }}>
                {/* Promo Card for Desserts Category */}
                {category === 'Desserts' && (
                  <Grid item xs={12}>
                    <motion.div
                      variants={promoCardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                    >
                      <Card
                        sx={{
                          borderRadius: '25px',
                          background: 'linear-gradient(45deg, #ffeb3b 0%, #4caf50 100%)',
                          backdropFilter: 'blur(12px)',
                          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                          border: '2px solid #fff',
                          overflow: 'hidden',
                          p: 3,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          color: '#1a1a1a',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <CelebrationIcon sx={{ fontSize: 60, color: '#fff' }} />
                          <Box>
                            <Typography
                              variant="h5"
                              sx={{
                                fontFamily: "'Sawarabi Mincho', serif",
                                fontWeight: 'bold',
                                textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)',
                              }}
                            >
                              Birthday Special!
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ fontSize: '1.2rem', color: '#fff', fontWeight: 'medium' }}
                            >
                              Celebrate Birthdays with Us! Free Dessert on Orders Over $50.
                            </Typography>
                          </Box>
                        </Box>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: '#ff5722',
                            '&:hover': { backgroundColor: '#e64a19' },
                            borderRadius: '20px',
                            padding: '0.75rem 2rem',
                            boxShadow: '0 3px 10px rgba(0, 0, 0, 0.3)',
                            textTransform: 'none',
                            fontSize: '1.1rem',
                          }}
                          onClick={() => navigate('/cart')} // Example action
                        >
                          Claim Now
                        </Button>
                      </Card>
                    </motion.div>
                  </Grid>
                )}
                {/* Regular Menu Items */}
                {categoryItems.map((item) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                    >
                      <Card
                        sx={{
                          borderRadius: '20px',
                          backgroundColor: 'rgba(255, 255, 255, 0.15)',
                          backdropFilter: 'blur(12px)',
                          boxShadow: '0 6px 18px rgba(0, 0, 0, 0.3)',
                          overflow: 'hidden',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
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
                            borderBottom: '2px solid #388e3c',
                          }}
                        />
                        <CardContent sx={{ textAlign: 'center', color: '#fff' }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontFamily: "'Sawarabi Mincho', serif",
                              fontWeight: 'bold',
                              letterSpacing: '0.5px',
                            }}
                          >
                            {item.itemName}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#ddd', mb: 1 }}>
                            {item.description || 'A delightful sushi creation'}
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
                                backgroundColor: '#ff5722',
                                '&:hover': { backgroundColor: '#e64a19' },
                                borderRadius: '20px',
                                padding: '0.5rem 1.5rem',
                                boxShadow: '0 3px 10px rgba(0, 0, 0, 0.3)',
                                textTransform: 'none',
                              }}
                            >
                              Add to Cart
                            </Button>
                          </motion.div>
                        </CardActions>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : null
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
    </Box>
  );
};

export default Menu;