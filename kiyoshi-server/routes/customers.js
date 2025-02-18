require('dotenv').config(); // Load .env variables
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Customer, Favorite, MenuItem, Order, OrderItem } = require(`${process.env.MODELS_PATH}`);
const { Op } = require('sequelize');
const authorize = require('../middleware/authMiddleware'); // Ensure proper middleware usage

console.log('customers.js file loaded');

// POST /api/customers – Create a new customer (sign-up)
router.post('/', async (req, res) => {
  try {
    const { FirstName, LastName, PhoneNumber, EmailAddress, PaymentInfo, password, Role } = req.body;

    // Check if the email already exists
    const existing = await Customer.findOne({ where: { EmailAddress } });
    if (existing) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash the incoming plain-text password
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    // Assign default role if none is provided
    const assignedRole = Role || 'customer'; // Default role is 'customer'

    // Create the new customer record
    const newCustomer = await Customer.create({
      FirstName,
      LastName,
      PhoneNumber,
      EmailAddress,
      PaymentInfo,
      Password: hashedPassword, // Store hashed password, not plain text
      Role: assignedRole,
      DateCreated: new Date(),
    });

    res.status(201).json({ success: true, customerId: newCustomer.id });
  } catch (err) {
    console.error('Error creating customer:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/customers/:id – Retrieve customer details
router.get('/:id', authorize(['customer', 'admin']), async (req, res) => {
  try {
    const customerId = parseInt(req.params.id, 10);

    if (req.user.role !== 'admin' && req.user.id !== customerId) {
      return res.status(403).json({ error: 'Forbidden: Access denied' });
    }

    const customer = await Customer.findOne({
      where: { id: customerId },
      attributes: ['id', 'FirstName', 'LastName', 'EmailAddress', 'PhoneNumber', 'PaymentInfo', 'ProfileImageURL'],
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(customer);
  } catch (err) {
    console.error('Error fetching customer details:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// GET /api/customers/:id/favorites – Retrieve favorite items for a customer
router.get('/:id/favorites', authorize(['customer', 'admin']), async (req, res) => {
  try {
    const customerId = parseInt(req.params.id, 10);

    if (req.user.role !== 'admin' && req.user.id !== customerId) {
      return res.status(403).json({ error: 'Forbidden: Access denied' });
    }

    const favorites = await Favorite.findAll({
      where: { CustomerID: customerId },
      include: [
        {
          model: MenuItem,
          as: 'MenuItem',
          attributes: [
            ['id', 'id'], // Map DB `id` -> `id`
            ['ItemName', 'itemName'], // Map DB `ItemName` -> `itemName`
            ['Price', 'price'], // Map DB `Price` -> `price`
          ],
        },
      ],
    });

    if (!favorites.length) {
      return res.status(404).json({ error: 'No favorites found for this customer' });
    }

    const formattedFavorites = favorites.map((fav) => ({
      id: fav.MenuItem.id,
      itemName: fav.MenuItem.itemName, // Correct key
      price: parseFloat(fav.MenuItem.price) || 0, // Ensure numeric price
    }));

    res.json(formattedFavorites);
  } catch (err) {
    console.error('Error fetching favorites:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// GET /api/customers/:id/orders – Retrieve orders for a specific customer
router.get('/:id/orders', authorize(['customer', 'admin']), async (req, res) => {
  try {
    const customerId = parseInt(req.params.id, 10);

    // Ensure the user is allowed to access this route
    if (req.user.role !== 'admin' && req.user.id !== customerId) {
      return res.status(403).json({ error: 'Forbidden: Access denied' });
    }

    // Fetch orders for the customer
    const orders = await Order.findAll({
      where: { CustomerID: customerId },
      include: [
        {
          model: OrderItem,
          as: 'OrderItems',
          include: [
            {
              model: MenuItem,
              as: 'MenuItem',
              attributes: ['id', 'ItemName', 'Price'],
            },
          ],
        },
      ],
      order: [['OrderDate', 'DESC']],
    });

    if (!orders.length) {
      return res.status(200).json([]); // Return empty array if no orders
    }

    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderDate: order.OrderDate,
      status: order.OrderStatus,
      totalPrice: parseFloat(order.TotalPrice) || 0, // Ensure numeric totalPrice
      items: order.OrderItems.map(item => ({
        id: item.id,
        name: item.MenuItem?.ItemName || 'Unknown Item',
        quantity: item.Quantity,
        lineTotal: parseFloat(item.LineTotal) || 0, // Ensure numeric lineTotal
      })),
    }));

    res.json(formattedOrders);
  } catch (err) {
    console.error('Error fetching customer orders:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
