require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Customer, Favorite, MenuItem, Order, OrderItem } = require(`${process.env.MODELS_PATH}`);
const { Op } = require('sequelize');
const authorize = require('../middleware/authMiddleware');

console.log('customers.js file loaded');

// POST /api/customers – Create a new customer (sign-up)
router.post('/', async (req, res) => {
  try {
    const { FirstName, LastName, PhoneNumber, EmailAddress, PaymentInfo, password, Role } = req.body;

    const existing = await Customer.findOne({ where: { EmailAddress } });
    if (existing) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const assignedRole = Role || 'customer';

    const newCustomer = await Customer.create({
      FirstName,
      LastName,
      PhoneNumber,
      EmailAddress,
      PaymentInfo,
      Password: hashedPassword,
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

// PUT /api/customers/:id/update-payment – Update payment info
router.put('/:id/update-payment', authorize(['customer', 'admin']), async (req, res) => {
  try {
    const customerId = parseInt(req.params.id, 10);
    const { paymentInfo } = req.body;

    if (req.user.role !== 'admin' && req.user.id !== customerId) {
      return res.status(403).json({ error: 'Forbidden: Access denied' });
    }

    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    customer.PaymentInfo = paymentInfo;
    await customer.save();

    res.json({ success: true, message: 'Payment information updated' });
  } catch (err) {
    console.error('Error updating payment info:', err);
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
          attributes: ['id', 'itemName', 'price'], // Use model attribute names
        },
      ],
    });

    if (!favorites.length) {
      return res.status(200).json([]); // Empty array instead of 404
    }

    const formattedFavorites = favorites.map((fav) => ({
      id: fav.MenuItem.id,
      itemName: fav.MenuItem.itemName,
      price: parseFloat(fav.MenuItem.price) || 0,
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

    if (req.user.role !== 'admin' && req.user.id !== customerId) {
      return res.status(403).json({ error: 'Forbidden: Access denied' });
    }

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
              attributes: ['id', 'itemName', 'price'], // Use model attribute names
            },
          ],
        },
      ],
      order: [['OrderDate', 'DESC']],
    });

    if (!orders.length) {
      return res.status(200).json([]);
    }

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderDate: order.OrderDate,
      status: order.OrderStatus,
      totalPrice: parseFloat(order.TotalPrice) || 0,
      items: order.OrderItems.map((item) => ({
        id: item.id,
        name: item.MenuItem?.itemName || 'Unknown Item',
        quantity: item.Quantity,
        lineTotal: parseFloat(item.LineTotal) || 0,
      })),
    }));

    res.json(formattedOrders);
  } catch (err) {
    console.error('Error fetching customer orders:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;