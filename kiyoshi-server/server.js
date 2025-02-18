require('dotenv').config(); // Load environment variables FIRST

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Import path for serving static files

const app = express(); // Initialize the Express app

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON requests
app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Serve static files from the 'public/menu-items' directory
app.use('/menu-items', express.static(path.join(__dirname, 'public/menu-items')));

// Debugging: Log all incoming requests (Optional)
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
const authorize = require('./middleware/authMiddleware');

// Public route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Routes with middleware
app.use('/api/auth', authRoutes); // Public
app.use('/api/orders', authorize(['customer', 'admin']), ordersRoutes); // Protected
app.use('/api/inventory', authorize(['admin']), inventoryRoutes); // Admin-only
app.use('/api/menu', menuRoutes); // Public
app.use('/api/customers', customersRouter); // Protected inside routes/customers.js
app.use('/api/dashboard', dashboardRoutes); // Assume appropriate middleware inside routes

// Catch-all route for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack || err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
