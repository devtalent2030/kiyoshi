import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link as MuiLink,
  CircularProgress,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();

    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      setError('All fields are required.');
      return;
    }

    // Additional validation (optional)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const response = await axiosInstance.post('/api/auth/signup', { // Fixed endpoint
        firstName,
        lastName,
        email,
        password,
      });

      if (response.status === 201) {
        // Successful signup, redirect to login
        navigate('/login', { state: { signupSuccess: true } }); // Optional: pass success state
      } else {
        setError(response.data.message || 'Signup failed.');
      }
    } catch (err) {
      // Improved error handling
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // e.g., "Email already exists"
      } else {
        setError('Failed to sign up. Please try again.');
      }
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Box
        sx={{
          width: 400,
          p: 4,
          borderRadius: 2,
          backgroundColor: '#fff',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#ef5350',
          }}
        >
          Create an Account
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSignup}>
          <TextField
            label="First Name"
            variant="outlined"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Last Name"
            variant="outlined"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            required
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{
              backgroundColor: '#26a69a',
              '&:hover': { backgroundColor: '#1f8b7b' },
              mb: 2,
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
          </Button>
        </form>

        <Typography variant="body2" sx={{ textAlign: 'center', mt: 3 }}>
          Already have an account?{' '}
          <MuiLink
            component={RouterLink}
            to="/login"
            sx={{ color: '#26a69a', fontWeight: 'bold' }}
          >
            Log in
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
};

export default Signup;