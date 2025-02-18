import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import axiosInstance from '../../axiosInstance';

const Dashboard = () => {
  const [ordersInProgress, setOrdersInProgress] = useState(0);
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [topCustomers, setTopCustomers] = useState([]);
  const [dailySalesData, setDailySalesData] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [coordinates, setCoordinates] = useState({ lat: null, lon: null });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axiosInstance.get('/dashboard');
        setOrdersInProgress(res.data.ordersInProgress);
        setDailyRevenue(res.data.dailyRevenue);
        setLowStockCount(res.data.lowStockCount);
        setTopCustomers(res.data.topCustomers);
        setDailySalesData(res.data.dailySalesData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchDashboardData();
  }, []);

  // Update the clock every 100ms
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 100); // Updates every 100 milliseconds

    return () => clearInterval(interval);
  }, []);

  // Fetch user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude.toFixed(5),
            lon: position.coords.longitude.toFixed(5),
          });
        },
        (error) => {
          console.error('Error fetching location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  // Format time to include milliseconds
  const formatTime = (time) => {
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');
    const milliseconds = String(time.getMilliseconds()).padStart(3, '0');

    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
  };

  // Format current day and date
  const formatDate = (time) => {
    return time.toLocaleDateString('en-US', {
      weekday: 'short', // e.g., "Mon"
      day: '2-digit',
      month: 'short', // e.g., "Jan"
      year: 'numeric',
    });
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f7f7f7', minHeight: '100vh' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: '#ef5350', fontWeight: 'bold' }}
        >
          Sushi Dashboard
        </Typography>
        <Box sx={{ textAlign: 'right' }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: '#000',
              fontSize: '2.5rem',
            }}
          >
            {formatTime(currentTime)}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#555',
              fontSize: '1rem',
              mt: 0.5,
            }}
          >
            {formatDate(currentTime)}
          </Typography>
          {coordinates.lat && coordinates.lon && (
            <Typography
              variant="body2"
              sx={{
                color: '#777',
                fontSize: '0.9rem',
                mt: 0.5,
              }}
            >
              Coordinates: {coordinates.lat}, {coordinates.lon}
            </Typography>
          )}
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        {/* Orders in Progress */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              textAlign: 'center',
              borderLeft: '5px solid #ef5350',
              backgroundColor: '#fff5f5',
            }}
          >
            <Typography variant="h6" sx={{ color: '#333' }}>
              Orders in Progress
            </Typography>
            <Typography
              variant="h4"
              sx={{ mt: 1, color: '#ef5350', fontWeight: 'bold' }}
            >
              {ordersInProgress}
            </Typography>
          </Paper>
        </Grid>

        {/* Daily Revenue */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              textAlign: 'center',
              borderLeft: '5px solid #26a69a',
              backgroundColor: '#f5fff5',
            }}
          >
            <Typography variant="h6" sx={{ color: '#333' }}>
              Daily Revenue
            </Typography>
            <Typography
              variant="h4"
              sx={{ mt: 1, color: '#26a69a', fontWeight: 'bold' }}
            >
              ${dailyRevenue.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>

        {/* Low Stock */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              textAlign: 'center',
              borderLeft: '5px solid #ffa726',
              backgroundColor: '#fffaf5',
            }}
          >
            <Typography variant="h6" sx={{ color: '#333' }}>
              Low Stock Items
            </Typography>
            <Typography
              variant="h4"
              sx={{ mt: 1, color: '#ffa726', fontWeight: 'bold' }}
            >
              {lowStockCount}
            </Typography>
          </Paper>
        </Grid>

        {/* Top Customers */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              textAlign: 'center',
              borderLeft: '5px solid #42a5f5',
              backgroundColor: '#f5faff',
            }}
          >
            <Typography variant="h6" sx={{ color: '#333' }}>
              Top Customers
            </Typography>
            {topCustomers.map((cust, idx) => (
              <Typography
                key={idx}
                variant="body1"
                sx={{ color: '#42a5f5', mt: 1 }}
              >
                {cust.name} (${cust.totalSpent.toFixed(2)})
              </Typography>
            ))}
          </Paper>
        </Grid>

        {/* Daily Sales Chart */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, backgroundColor: '#fff' }}>
            <Typography
              variant="h6"
              sx={{
                color: '#333',
                textAlign: 'center',
                mb: 2,
              }}
            >
              Daily Sales
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailySalesData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#ef5350" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
