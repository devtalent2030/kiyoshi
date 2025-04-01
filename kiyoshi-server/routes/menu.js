const express = require('express');
const router = express.Router();
const { MenuItem } = require(`${process.env.MODELS_PATH}`);

// GET /api/menu - Retrieve all menu items
router.get('/', async (req, res) => {
  try {
    const menuItems = await MenuItem.findAll({
      attributes: [
        'id',
        'itemName',
        'description',
        'price',
        'imageURL',
        'category',
      ],
    });

    // Transform the response to ensure lowercase 'category'
    const transformedItems = menuItems.map(item => ({
      id: item.id,
      itemName: item.itemName,
      description: item.description,
      price: item.price,
      imageURL: item.imageURL,
      category: item.category, // Should already match DB 'Category' column
    }));

    console.log('Menu Items:', JSON.stringify(transformedItems, null, 2)); 
    res.json(transformedItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;