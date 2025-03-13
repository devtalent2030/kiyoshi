const express = require('express');
const router = express.Router();
const { MenuItem } = require(`${process.env.MODELS_PATH}`);

// GET /api/menu - Retrieve all menu items
router.get('/', async (req, res) => {
  try {
    const menuItems = await MenuItem.findAll({
      attributes: ['id', 'itemName', 'description', 'price', 'imageURL'], // Use model attribute names
    });

    console.log('Menu Items:', JSON.stringify(menuItems, null, 2)); // Add debug log
    res.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;