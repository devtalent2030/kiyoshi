require('dotenv').config();
const express = require('express');
const router = express.Router();
const { sequelize, Order, Customer, Inventory } = require(`${process.env.MODELS_PATH}`);
const Sequelize = require('sequelize');
const authorize = require('../middleware/authMiddleware'); // Add auth for admin access

router.get('/', authorize(['admin']), async (req, res) => {
  try {
    // 1. Orders in Progress
    const ordersInProgress = await Order.count({
      where: { OrderStatus: { [Sequelize.Op.ne]: 'Completed' } },
    });

    // 2. Daily Revenue
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const dailyRevenue = await Order.sum('TotalPrice', {
      where: {
        OrderStatus: 'Completed',
        OrderDate: {
          [Sequelize.Op.between]: [startOfDay, endOfDay],
        },
      },
    }) || 0;

    // 3. Low Stock Count
    const lowStockCount = await Inventory.count({
      where: { CurrentStock: { [Sequelize.Op.lt]: 10 } },
    });

    // 4. Top Customers
    const topCustomersData = await Customer.findAll({
      subQuery: false,
      attributes: [
        'id',
        'FirstName',
        'LastName',
        [Sequelize.fn('SUM', Sequelize.col('Orders.TotalPrice')), 'totalSpent'],
      ],
      include: [
        {
          model: Order,
          as: 'Orders',
          attributes: [],
          where: { OrderStatus: 'Completed' }, // Only completed orders
        },
      ],
      group: ['Customer.id', 'Customer.FirstName', 'Customer.LastName'], // Include all grouped fields
      order: [[Sequelize.literal('totalSpent'), 'DESC']],
      limit: 5,
    });

    const topCustomers = topCustomersData.map((cust) => ({
      name: `${cust.FirstName} ${cust.LastName}`.trim(),
      totalSpent: parseFloat(cust.get('totalSpent')) || 0,
    }));

    // 5. Daily Sales Data (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailySalesRaw = await Order.findAll({
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('OrderDate')), 'day'],
        [Sequelize.fn('SUM', Sequelize.col('TotalPrice')), 'sales'],
      ],
      where: {
        OrderDate: { [Sequelize.Op.gte]: sevenDaysAgo },
        OrderStatus: 'Completed',
      },
      group: [Sequelize.fn('DATE', Sequelize.col('OrderDate'))],
      order: [[Sequelize.fn('DATE', Sequelize.col('OrderDate')), 'ASC']],
      raw: true,
    });

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dailySalesData = dailySalesRaw.map((item) => {
      const dateObj = new Date(item.day);
      return {
        day: dayNames[dateObj.getDay()],
        sales: parseFloat(item.sales) || 0,
      };
    });

    // Debug Logging
    console.log('Dashboard Data:', {
      ordersInProgress,
      dailyRevenue,
      lowStockCount,
      topCustomers,
      dailySalesData,
    });

    // Send Response
    res.json({
      ordersInProgress,
      dailyRevenue,
      lowStockCount,
      topCustomers,
      dailySalesData,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
});

module.exports = router;