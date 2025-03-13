import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link as MuiLink,
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';
import SushiAnimation from '../../components/UI/SushiAnimation';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post('/api/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('Logged in with token:', response.data.token);

        if (response.data.user.role === 'admin') {
          navigate('/dashboard');
        } else {
          const redirectTo = location.state?.from || '/';
          navigate(redirectTo);
        }
      } else {
        setError(response.data.message || 'Login failed.');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to login. Please try again.';
      setError(errorMsg);
      console.error('Login error:', err.response?.data || err.message);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <SushiAnimation />
      <Box
        sx={{
          position: 'absolute',
          width: '90%',
          maxWidth: 400,
          p: 4,
          borderRadius: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          boxShadow: 4,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: 'center', fontWeight: 'bold', color: '#ef5350' }}
        >
          Welcome Back!
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <TextField
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: '#ef5350',
            '&:hover': { backgroundColor: '#d84343' },
            mb: 2,
          }}
          onClick={handleLogin}
        >
          Login
        </Button>

        <Typography variant="body2" sx={{ textAlign: 'center', mt: 3 }}>
          Don't have an account?{' '}
          <MuiLink
            component={RouterLink}
            to="/signup"
            sx={{ color: '#26a69a', fontWeight: 'bold' }}
          >
            Sign up
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;