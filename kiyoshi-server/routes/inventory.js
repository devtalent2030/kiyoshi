require('dotenv').config();
const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authMiddleware');
const { Inventory, Fish, Supplier } = require(`${process.env.MODELS_PATH}`);

// GET /api/inventory - Get all fish stock items
router.get('/', authorize(['admin']), async (req, res) => {
    try {
      console.log('Request made by user:', req.user); // Log the user making the request
  
      const inventoryRecords = await Inventory.findAll({
        include: [
          {
            model: Fish,
            attributes: ['FishName', 'CurrentPrice'],
            include: {
              model: Supplier,
              attributes: ['SupplierName'],
            },
          },
        ],
      });
  
      const response = inventoryRecords.map((item) => ({
        id: item.id,
        fishName: item.Fish?.FishName || 'Unknown Fish', // Default to 'Unknown Fish'
        currentStock: item.CurrentStock ?? 0, // Default to 0
        currentPrice: parseFloat(item.Fish?.CurrentPrice) || 0, // Default to 0
        supplier: item.Fish?.Supplier?.SupplierName || 'Unknown Supplier', // Default to 'Unknown Supplier'
      }));
  
      console.log('Inventory Response:', JSON.stringify(response, null, 2)); // Log the response
      res.json(response);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
// PUT /api/inventory/:fishId - Update fish stock or price
router.put('/:fishId', authorize(['admin']), async (req, res) => {
  try {
    const { fishId } = req.params;
    const { currentStock, currentPrice } = req.body;

    const inventoryRow = await Inventory.findOne({ where: { FishID: fishId } });
    if (!inventoryRow) {
      return res.status(404).json({ error: 'Inventory record not found for that FishID' });
    }

    if (currentStock !== undefined) {
      inventoryRow.CurrentStock = currentStock;
      inventoryRow.LastUpdated = new Date();
      await inventoryRow.save();
    }

    if (currentPrice !== undefined) {
      const fish = await Fish.findByPk(fishId);
      if (!fish) {
        return res.status(404).json({ error: 'Fish not found' });
      }
      fish.CurrentPrice = currentPrice;
      await fish.save();
    }

    res.json({ message: 'Inventory updated successfully' });
  } catch (err) {
    console.error('Error updating inventory:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
