import React from 'react';
import { Box, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import SushiAnimation from '../../components/UI/SushiAnimation';
import '../../assets/animations.css';

const Home = () => {
  return (
    <Box sx={{ overflowX: 'hidden', width: '100%' }}>
      {/* Sushi Animation Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '40vh', sm: '50vh', md: '60vh' },
          overflow: 'hidden',
        }}
      >
        <SushiAnimation />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            px: { xs: 1, sm: 2 },
            color: '#fff',
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
              fontSize: { xs: '1.5rem', sm: '2.5rem', md: '4rem' },
              lineHeight: 1.2,
            }}
          >
            <span className="shake-once shake-orange">Quality</span>{' '}
            <span className="shake-once shake-orange">Sushi</span>{' '}
            <span className="shake-once shake-orange">,</span>{' '}
            <span className="shake-once shake-orange">Quick</span>{' '}
            <span
              className="shake-once shake-orange"
              style={{
                display: 'inline-block',
                fontFamily: "'Kaushan Script', cursive",
              }}
            >
              Take-Out
            </span>
          </Typography>

          <Button
            variant="contained"
            component={Link}
            to="/login"
            sx={{
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.2rem' },
              padding: { xs: '0.5rem 1rem', md: '0.75rem 1.5rem' },
              backgroundColor: '#ef5350',
              '&:hover': {
                backgroundColor: '#d32f2f',
              },
            }}
          >
            Start Your Order
          </Button>
        </Box>
      </Box>

      {/* Key Highlights Section */}
      <Box
        sx={{
          py: { xs: 3, sm: 4 },
          px: { xs: 2, sm: 4 },
          textAlign: 'center',
          backgroundColor: '#f9f9f9',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '1.5rem', sm: '2rem' },
            color: '#fff',
            backgroundColor: '#d97706', // Dark orange
            padding: '0.5rem',
            borderRadius: '8px',
          }}
        >
          Why Choose Sushi Bai Kiyoshi?
        </Typography>

        <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
          {/* Highlight 1 */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              raised
              sx={{
                borderRadius: '16px',
                textAlign: 'center',
                backgroundColor: '#f97316', // Darker orange
                color: '#fff', // White text for better contrast
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '1rem', sm: '1.2rem' },
                  }}
                >
                  Authentic Ingredients
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  }}
                >
                  We source only the freshest fish from top suppliers.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Highlight 2 */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              raised
              sx={{
                borderRadius: '16px',
                textAlign: 'center',
                backgroundColor: '#f97316', // Darker orange
                color: '#fff', // White text for better contrast
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '1rem', sm: '1.2rem' },
                  }}
                >
                  Fast Take-Out
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  }}
                >
                  Experience minimal wait times—even during lunch rush!
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Highlight 3 */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              raised
              sx={{
                borderRadius: '16px',
                textAlign: 'center',
                backgroundColor: '#f97316', // Darker orange
                color: '#fff', // White text for better contrast
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '1rem', sm: '1.2rem' },
                  }}
                >
                  Order Online
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  }}
                >
                  Quickly place orders on the go with your phone or browser.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
