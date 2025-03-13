'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fetch all Menu Items from the database
    const menuItems = await queryInterface.sequelize.query(
      'SELECT id FROM MenuItems',  // ✅ Fetch from MenuItems instead of Fishes
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (menuItems.length > 0) {
      return queryInterface.bulkInsert(
        'Inventories',
        menuItems.map((menuItem, i) => ({
          MenuItemID: menuItem.id, // ✅ Use MenuItemID instead of FishID
          CurrentStock: (i + 11) * 20, // Assign stock values dynamically
          LastUpdated: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      );
    }

    return null;
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Inventories', null, {});
  },
};