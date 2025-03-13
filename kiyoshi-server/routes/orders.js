// orders.js
require('dotenv').config();
const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authMiddleware'); // Updated import
const { Order, OrderItem, Customer, MenuItem, Inventory } = require(`${process.env.MODELS_PATH}`);
const { Op } = require('sequelize');

// GET /api/orders – Retrieve all orders
router.get('/', authorize(['customer', 'admin']), async (req, res) => {
  try {
    const { status, date } = req.query;
    const whereClause = {};
    if (req.user.role !== 'admin') {
      whereClause.CustomerID = req.user.id; // Restrict to customer's own orders
    }
    if (status) whereClause.OrderStatus = status;
    if (date) whereClause.OrderDate = { [Op.gte]: new Date(date) };

    const orders = await Order.findAll({
      where: whereClause,
      include: [
        {
          model: Customer,
          as: 'Customer',
          attributes: ['FirstName', 'LastName'],
        },
        {
          model: OrderItem,
          as: 'OrderItems',
          include: [
            {
              model: MenuItem,
              as: 'MenuItem',
              attributes: ['itemName'],
            },
          ],
        },
      ],
      order: [['OrderDate', 'DESC']],
    });

    console.log('Raw Orders:', JSON.stringify(orders, null, 2));

    const formattedOrders = orders.map(order => ({
      id: order.id,
      customerName: `${order.Customer?.FirstName || 'Unknown'} ${order.Customer?.LastName || ''}`,
      status: order.OrderStatus,
      totalPrice: parseFloat(order.TotalPrice) || 0,
      orderDate: order.OrderDate,
      items: order.OrderItems.map(item => ({
        name: item.MenuItem?.itemName || 'Unknown Item',
        quantity: item.Quantity,
        lineTotal: parseFloat(item.LineTotal) || 0,
      })),
    }));

    console.log('Formatted Orders:', JSON.stringify(formattedOrders, null, 2));
    res.json(formattedOrders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/orders – Create an order, deduct inventory, simulate payment
router.post('/', async (req, res) => {
  try {
    const { customerId, orderDate, pickupTime, orderStatus, totalPrice, orderItems } = req.body;

    console.log('Received order request:', req.body); // Debug incoming data

    // Check if customerId is provided; if not, treat as guest order
    let customer;
    if (customerId) {
      customer = await Customer.findByPk(customerId);
      if (!customer) {
        return res.status(404).json({ success: false, error: 'Customer not found' });
      }
    } else {
      console.log('Processing guest order...');
    }

    const newOrder = await Order.create({
      CustomerID: customerId || null, // Allow null for guests
      OrderDate: orderDate || new Date(),
      PickupTime: pickupTime,
      OrderStatus: orderStatus || 'Completed',
      TotalPrice: parseFloat(totalPrice) || 0,
    });

    if (!orderItems || !Array.isArray(orderItems)) {
      return res.status(400).json({ error: 'Invalid orderItems format' });
    }

    const itemsToCreate = [];

    for (const item of orderItems) {
      const lineTotal = parseFloat(item.LineTotal) || 0;
      itemsToCreate.push({
        OrderID: newOrder.id,
        MenuItemID: item.MenuItemID,
        Quantity: item.Quantity,
        LineTotal: lineTotal,
      });

      const inventoryItem = await Inventory.findOne({ where: { MenuItemID: item.MenuItemID } });
      if (inventoryItem) {
        if (inventoryItem.CurrentStock < item.Quantity) {
          return res.status(400).json({
            error: `Not enough stock for item ID ${item.MenuItemID}. Available: ${inventoryItem.CurrentStock}, Ordered: ${item.Quantity}`,
          });
        }
        inventoryItem.CurrentStock -= item.Quantity;
        await inventoryItem.save();
      } else {
        console.warn(`No inventory record found for MenuItemID=${item.MenuItemID}`);
      }
    }

    await OrderItem.bulkCreate(itemsToCreate);

    console.log('Order created successfully:', { orderId: newOrder.id }); // Debug success

    return res.json({
      success: true,
      orderId: newOrder.id,
      message: 'Order placed successfully!',
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;