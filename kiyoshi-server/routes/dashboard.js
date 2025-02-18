require('dotenv').config();
const express = require('express');
const router = express.Router();
const { sequelize, Order, Customer, Inventory } = require(`${process.env.MODELS_PATH}`); 
const Sequelize = require('sequelize');

router.get('/', async (req, res) => {
  try {
    // 1. Orders in progress
    const ordersInProgress = await Order.count({
      where: { OrderStatus: { [Sequelize.Op.ne]: 'Completed' } },
    });

    // 2. Daily revenue
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to midnight

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Midnight today

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // End of today

   const dailyRevenue = await Order.sum('TotalPrice', {
     where: {
      OrderStatus: 'Completed',
      OrderDate: {
        [Sequelize.Op.between]: [startOfDay, endOfDay], // Between midnight and 23:59:59
      },
    },
  });


    // 3. Low stock count
    const lowStockCount = await Inventory.count({
      where: { CurrentStock: { [Sequelize.Op.lt]: 10 } },
    });

    // 4. Top customers
    const topCustomersData = await Customer.findAll({
        subQuery: false, // <--- ADD THIS
        attributes: [
          'id',
          'FirstName',
          'LastName',
          [Sequelize.fn('SUM', Sequelize.col('Orders.TotalPrice')), 'totalSpent'],
        ],
        include: [
          {
            model: Order,
            as: 'Orders', // Must match the alias in Customer.hasMany(...)
            attributes: [],
          },
        ],
        group: ['Customer.id'],
        order: [[Sequelize.literal('totalSpent'), 'DESC']],
        limit: 5,
      });
      
      

    const topCustomers = topCustomersData.map((cust) => ({
      name: `${cust.FirstName} ${cust.LastName}`.trim(),
      totalSpent: parseFloat(cust.get('totalSpent')) || 0,
    }));

    // 5. Daily sales data
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Go back 6 days
    sevenDaysAgo.setHours(0, 0, 0, 0); // Reset to midnight

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
        sales: parseFloat(item.sales),
      };
    });

    // Send response
    res.json({
      ordersInProgress,
      dailyRevenue: dailyRevenue || 0,
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
