require('dotenv').config();
const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authMiddleware');
const { Inventory, MenuItem } = require(`${process.env.MODELS_PATH}`);

// GET /api/inventory - Get all inventory items (linked to MenuItems)
router.get('/', authorize(['admin']), async (req, res) => {
  try {
    console.log('Request made by user:', req.user);

    const inventoryRecords = await Inventory.findAll({
      include: [
        {
          model: MenuItem,
          attributes: ['id', 'itemName', 'price'], // Use model attribute names
        },
      ],
    });

    console.log('Raw Inventory Records:', JSON.stringify(inventoryRecords, null, 2)); // Debug raw data

    const response = inventoryRecords.map((item) => ({
      id: item.MenuItemID, // Use MenuItemID instead of item.id for consistency
      itemName: item.MenuItem?.itemName || 'Unknown Item', // Use itemName
      currentStock: item.CurrentStock ?? 0,
      currentPrice: parseFloat(item.MenuItem?.price) || 0, // Use price
    }));

    console.log('Inventory Response:', JSON.stringify(response, null, 2));
    res.json(response);
  } catch (err) {
    console.error('Error fetching inventory:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT /api/inventory/:menuItemId - Update stock or menu item price
router.put('/:menuItemId', authorize(['admin']), async (req, res) => {
  try {
    const { menuItemId } = req.params;
    const { currentStock, currentPrice } = req.body;

    const inventoryRow = await Inventory.findOne({ where: { MenuItemID: menuItemId } });
    if (!inventoryRow) {
      return res.status(404).json({ error: 'Inventory record not found for that MenuItemID' });
    }

    if (currentStock !== undefined) {
      inventoryRow.CurrentStock = currentStock;
      inventoryRow.LastUpdated = new Date();
      await inventoryRow.save();
    }

    if (currentPrice !== undefined) {
      const menuItem = await MenuItem.findByPk(menuItemId);
      if (!menuItem) {
        return res.status(404).json({ error: 'Menu item not found' });
      }
      menuItem.price = currentPrice; // Use model attribute name
      await menuItem.save();
    }

    res.json({ message: 'Inventory updated successfully' });
  } catch (err) {
    console.error('Error updating inventory:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;