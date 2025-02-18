require('dotenv').config(); // Load .env variables
const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authMiddleware');
const { Order, OrderItem, Customer, MenuItem } = require(`${process.env.MODELS_PATH}`);
const { Op } = require('sequelize');

// GET /api/orders – Retrieve all orders (optionally filter by status, date)
// Accessible by customers and admins
router.get('/', authorize(['customer', 'admin']), async (req, res) => {
  try {
    const { status, date } = req.query;

    const whereClause = {};
    if (status) whereClause.OrderStatus = status;
    if (date) whereClause.OrderDate = { [Op.gte]: new Date(date) };

    const orders = await Order.findAll({
      where: whereClause,
      include: [
        {
          model: Customer,
          as: 'Customer', // Use the alias defined in Order model
          attributes: ['FirstName', 'LastName'], // Include only required fields
        },
        {
          model: OrderItem,
          as: 'OrderItems', // Use the alias defined in Order model
          include: [
            {
              model: MenuItem,
              as: 'MenuItem', // Use the alias defined in OrderItem model
              attributes: ['ItemName'], // Include only required fields
            },
          ],
        },
      ],
      order: [['OrderDate', 'DESC']],
    });

    // Format the response to be frontend-friendly
    const formattedOrders = orders.map(order => ({
      id: order.id,
      customerName: `${order.Customer?.FirstName || 'Unknown'} ${order.Customer?.LastName || ''}`,
      status: order.OrderStatus,
      totalPrice: parseFloat(order.TotalPrice) || 0, // Convert TotalPrice to number
      orderDate: order.OrderDate,
      items: order.OrderItems.map(item => ({
        name: item.MenuItem?.ItemName || 'Unknown Item',
        quantity: item.Quantity,
        lineTotal: parseFloat(item.LineTotal) || 0, // Convert LineTotal to number
      })),
    }));

    res.json(formattedOrders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/orders – Create a new order
// Accessible by customers only
router.post('/', authorize(['customer']), async (req, res) => {
  try {
    const { customerId, orderDate, pickupTime, orderStatus, totalPrice, orderItems } = req.body;

    const newOrder = await Order.create({
      CustomerID: customerId,
      OrderDate: orderDate,
      PickupTime: pickupTime,
      OrderStatus: orderStatus,
      TotalPrice: parseFloat(totalPrice) || 0, // Ensure TotalPrice is stored as a number
    });

    if (orderItems && Array.isArray(orderItems)) {
      const itemsToCreate = orderItems.map(item => ({
        OrderID: newOrder.id,
        MenuItemID: item.MenuItemID,
        Quantity: item.Quantity,
        LineTotal: parseFloat(item.LineTotal) || 0, // Ensure LineTotal is stored as a number
      }));

      await OrderItem.bulkCreate(itemsToCreate);
    }

    res.json({ success: true, orderId: newOrder.id });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
