require('dotenv').config();
const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const { Op } = require('sequelize');
const { Order, OrderItem, Customer, MenuItem, Inventory } = require(`${process.env.MODELS_PATH}`);

const twilioClient = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

router.post('/', async (req, res) => {
  try {
    console.log('📩 Incoming SMS Order:', req.body);

    const fromNumber = req.body.From;
    const messageBody = (req.body.Body || '').trim();

    if (!messageBody) {
      return res.send('<Response><Message>Invalid format. Example: "1 Sushi Roll, 2 Bento Boxes"</Message></Response>');
    }

    const customer = await Customer.findOne({ where: { PhoneNumber: fromNumber } });
    if (!customer) {
      return res.send('<Response><Message>Phone number not registered. Please sign up online.</Message></Response>');
    }

    // Use model attribute names (itemName, price) instead of column names (ItemName, Price)
    const menuItems = await MenuItem.findAll({ attributes: ['id', 'itemName', 'price'] });
    if (!menuItems.length) {
      console.error("❌ ERROR: No menu items found in the database.");
      return res.send('<Response><Message>Our menu is currently unavailable. Please try again later.</Message></Response>');
    }

    // Access fields using model attribute names
    console.log('📜 Available Menu Items:', menuItems.map(m => ({ id: m.id, name: m.itemName, price: m.price })));

    const items = messageBody.split(',').map(part => {
      const match = part.trim().match(/^(\d+)\s+(.+)$/);
      if (!match) return null;
      return { quantity: parseInt(match[1]), name: match[2].trim() };
    }).filter(Boolean);

    if (!items.length) {
      return res.send('<Response><Message>Could not parse your order. Example: "1 Sushi Roll, 2 Bento Boxes"</Message></Response>');
    }

    let orderTotal = 0;
    let unavailableItems = [];
    let newOrder = null;

    for (const item of items) {
      let menuItem = await MenuItem.findOne({
        where: { itemName: { [Op.like]: `%${item.name}%` } } // Use itemName, not ItemName
      });

      if (!menuItem) {
        const singular = item.name.replace(/s$/, '');
        const plural = item.name + (item.name.endsWith('s') ? '' : 's');
        menuItem = await MenuItem.findOne({
          where: { itemName: { [Op.like]: `%${singular}%` } }
        }) || await MenuItem.findOne({
          where: { itemName: { [Op.like]: `%${plural}%` } }
        });
      }

      if (!menuItem) {
        console.log(`❌ Not found: '${item.name}'`);
        unavailableItems.push(item.name);
        continue;
      }

      console.log(`🛒 Ordering: ${menuItem.itemName}, Price=${menuItem.price}, Qty=${item.quantity}`);

      const inventoryItem = await Inventory.findOne({ where: { MenuItemID: menuItem.id } });
      if (!inventoryItem || inventoryItem.CurrentStock < item.quantity) {
        return res.send(`<Response><Message>Sorry, not enough stock for ${menuItem.itemName}.</Message></Response>`);
      }

      if (!newOrder) {
        newOrder = await Order.create({
          CustomerID: customer.id,
          OrderDate: new Date(),
          OrderStatus: 'Completed', // Changed from 'Pending' to 'Completed'
          TotalPrice: 0,
        });
      }

      const itemPrice = parseFloat(menuItem.price) || 0;
      orderTotal += itemPrice * item.quantity;

      await OrderItem.create({
        OrderID: newOrder.id,
        MenuItemID: menuItem.id,
        Quantity: item.quantity,
        LineTotal: itemPrice * item.quantity,
      });

      inventoryItem.CurrentStock -= item.quantity;
      await inventoryItem.save();
    }

    if (!newOrder) {
      return res.send('<Response><Message>No valid items in your order. Please check our menu.</Message></Response>');
    }

    newOrder.TotalPrice = orderTotal;
    newOrder.OrderStatus = 'Completed'; // Ensure status is set to "Completed" before saving
    await newOrder.save();

    console.log(`✅ Order Placed: $${orderTotal.toFixed(2)}`);

    let responseMessage = `Order received! Your total is $${orderTotal.toFixed(2)}.`;
    if (unavailableItems.length) {
      responseMessage += `\nUnavailable items: ${unavailableItems.join(', ')}`;
    }

    await twilioClient.messages.create({
      body: responseMessage,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: fromNumber
    });

    return res.send(`<Response><Message>${responseMessage}</Message></Response>`);
  } catch (error) {
    console.error('📌 SMS Order Error:', error.message, error.stack);
    return res.send('<Response><Message>Order failed. Try again later.</Message></Response>');
  }
});

module.exports = router;