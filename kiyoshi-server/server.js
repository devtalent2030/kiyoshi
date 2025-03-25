require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./db'); // Import Sequelize instance

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Replaces body-parser.json()
app.use(express.urlencoded({ extended: true })); // Replaces body-parser.urlencoded()

// Serve static files
app.use('/menu-items', express.static(path.join(__dirname, 'public/menu-items')));

// Debugging middleware (optional)
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

// Public route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', authorize(['customer', 'admin']), ordersRoutes);
app.use('/api/inventory', authorize(['admin']), inventoryRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/customers', customersRouter);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/sms-webhook', smsWebhookRoutes);

// Catch-all route
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack || err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server after Sequelize sync
const PORT = process.env.PORT || 5000;
sequelize.sync({ force: false }) // Sync models with DB (force: false preserves data)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
  });