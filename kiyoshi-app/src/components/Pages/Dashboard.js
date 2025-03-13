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
import { motion } from 'framer-motion';
import axiosInstance from '../../axiosInstance';
import SushiIcon from '@mui/icons-material/LocalDining';

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover: { scale: 1.05, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)' },
};

const Dashboard = () => {
  const [ordersInProgress, setOrdersInProgress] = useState(0);
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [topCustomers, setTopCustomers] = useState([]);
  const [dailySalesData, setDailySalesData] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchDashboardData = async () => {
    try {
      const res = await axiosInstance.get('/api/dashboard', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log('📊 Dashboard API Response:', res.data);
      setOrdersInProgress(res.data.ordersInProgress);
      setDailyRevenue(res.data.dailyRevenue);
      setLowStockCount(res.data.lowStockCount);
      setTopCustomers(res.data.topCustomers);
      setDailySalesData(res.data.dailySalesData);
    } catch (err) {
      console.error('❌ Error fetching dashboard data:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 100);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (time) => {
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%)', // Sushi gradient
        minHeight: '100vh',
        maxWidth: '1400px',
        mx: 'auto',
        color: '#fff',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <Typography
            variant="h4"
            sx={{ fontFamily: "'Sawarabi Mincho', serif", fontWeight: 'bold', color: '#ff5722' }}
          >
            Sushi Dashboard
          </Typography>
        </motion.div>
        <Typography variant="h5" sx={{ fontFamily: "'Sawarabi Mincho', serif", color: '#ffeb3b' }}>
          {formatTime(currentTime)}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Orders in Progress */}
        <Grid item xs={12} sm={6} md={3}>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
            <Paper
              sx={{
                p: 2,
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderLeft: '5px solid #ff5722', // Salmon orange
              }}
            >
              <Typography variant="h6" sx={{ fontFamily: "'Sawarabi Mincho', serif'" }}>
                Orders in Progress
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold', color: '#ff5722' }}>
                {ordersInProgress}
              </Typography>
            </Paper>
          </motion.div>
        </Grid>

        {/* Daily Revenue */}
        <Grid item xs={12} sm={6} md={3}>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
            <Paper
              sx={{
                p: 2,
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderLeft: '5px solid #388e3c', // Seaweed green
              }}
            >
              <Typography variant="h6" sx={{ fontFamily: "'Sawarabi Mincho', serif'" }}>
                Daily Revenue
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold', color: '#388e3c' }}>
                ${dailyRevenue.toFixed(2)}
              </Typography>
            </Paper>
          </motion.div>
        </Grid>

        {/* Low Stock */}
        <Grid item xs={12} sm={6} md={3}>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
            <Paper
              sx={{
                p: 2,
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderLeft: '5px solid #ffa726', // Wasabi yellow
              }}
            >
              <Typography variant="h6" sx={{ fontFamily: "'Sawarabi Mincho', serif'" }}>
                Low Stock Items
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold', color: '#ffa726' }}>
                {lowStockCount}
              </Typography>
            </Paper>
          </motion.div>
        </Grid>

        {/* Top Customers */}
        <Grid item xs={12} sm={6} md={3}>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
            <Paper
              sx={{
                p: 2,
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderLeft: '5px solid #8d5524', // Soy brown
              }}
            >
              <Typography variant="h6" sx={{ fontFamily: "'Sawarabi Mincho', serif'" }}>
                Top Customers
              </Typography>
              {topCustomers.length > 0 ? (
                topCustomers.map((cust, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                    <SushiIcon sx={{ mr: 1, color: '#8d5524' }} />
                    <Typography variant="body1" sx={{ color: '#ffeb3b' }}>
                      {cust.name} (${cust.totalSpent.toFixed(2)})
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body1" sx={{ color: '#b0bec5', mt: 1 }}>
                  No sushi lovers yet
                </Typography>
              )}
            </Paper>
          </motion.div>
        </Grid>

        {/* Daily Sales Chart */}
        <Grid item xs={12}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <Paper
              sx={{
                p: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '15px',
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: '#fff', textAlign: 'center', mb: 2, fontFamily: "'Sawarabi Mincho', serif'" }}
              >
                Daily Sushi Sales (Last 7 Days)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailySalesData}>
                  <XAxis dataKey="day" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} contentStyle={{ backgroundColor: '#2c3e50', color: '#fff' }} />
                  <Legend />
                  <Bar dataKey="sales" fill="#ff5722" /> {/* Salmon orange */}
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;