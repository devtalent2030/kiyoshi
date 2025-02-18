import React, { useEffect, useState } from 'react';
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
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Menu = () => {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }

    axios
      .get('http://localhost:4000/api/menu')
      .then((res) => {
        setItems(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const addToCart = (item) => {
    if (!isLoggedIn) {
      alert('Please log in to add items to your cart.');
      return;
    }
    setCart((prevCart) => [...prevCart, item]);
    alert(`${item.itemName} added to cart!`);
  };

  return (
    <Box
      sx={{
        p: 2,
        background: 'linear-gradient(to bottom, #fff, #f5f5f5)',
        minHeight: '100vh',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Explore Our Menu
        </Typography>
        <IconButton color="primary">
          <Badge badgeContent={cart.length} color="secondary">
            <ShoppingCartIcon fontSize="large" />
          </Badge>
        </IconButton>
      </Box>

      <Grid container spacing={2}>
        {items.length > 0 ? (
          items.map((item) => (
            <Grid item xs={6} sm={6} md={4} lg={3} key={item.id}>
              <Card
                sx={{
                  borderRadius: 1,
                  boxShadow: 2,
                  transition: 'transform 0.3s ease, boxShadow 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 4,
                  },
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '180px',
                    backgroundImage: `url(${
                      item.imageURL
                        ? `http://localhost:4000${item.imageURL}`
                        : '/menu-items/placeholder.jpg'
                    })`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <CardContent
                  sx={{
                    textAlign: 'center',
                    padding: '16px 8px',
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    {item.itemName}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    ${Number(item.price).toFixed(2)}
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    pb: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => addToCart(item)}
                    sx={{
                      backgroundColor: '#ef5350',
                      '&:hover': { backgroundColor: '#d32f2f' },
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              width: '100%',
              mt: 3,
            }}
          >
            No items available at the moment. Please check back later.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default Menu;
