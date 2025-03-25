require('dotenv').config(); // Load environment variables FIRST

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/menu-items', express.static(path.join(__dirname, 'public/menu-items')));

// Debugging: Log incoming requests
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`, {
    headers: req.headers,
    body: req.body,
  });
  next();
});

// Import routes
const customersRouter = require('./routes/customers');
const dashboardRoutes = require('./routes/dashboard');
const authRoutes = require('./routes/auth');
const ordersRoutes = require('./routes/orders');
const inventoryRoutes = require('./routes/inventory');
const menuRoutes = require('./routes/menu');
const smsWebhookRoutes = require('./routes/smsWebhook');
const authorize = require('./middleware/authMiddleware');

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Kiyoshi API' });
});
app.use('/api/auth', authRoutes);
app.use('/api/orders', authorize(['customer', 'admin']), ordersRoutes);
app.use('/api/inventory', authorize(['admin']), inventoryRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/customers', customersRouter);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/sms-webhook', smsWebhookRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack || err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server with dynamic PORT
const PORT = process.env.PORT || 4000; // Changed from 5000 to match your local setup
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});