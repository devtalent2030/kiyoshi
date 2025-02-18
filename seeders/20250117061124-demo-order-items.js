'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fetch all Orders and MenuItems
    const orders = await queryInterface.sequelize.query(
      'SELECT id FROM Orders',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const menuItems = await queryInterface.sequelize.query(
      'SELECT id, Price FROM MenuItems',
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Ensure we have data to link
    if (orders.length > 0 && menuItems.length > 0) {
      // Generate bulk insert data dynamically
      const orderItems = orders.flatMap((order, i) => {
        const menuItem = menuItems[i % menuItems.length];
        const quantity = (i % 3) + 1;
        return {
          OrderID: order.id,
          MenuItemID: menuItem.id,
          Quantity: quantity,
          LineTotal: menuItem.Price * quantity, // Correct LineTotal calculation
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });

      return queryInterface.bulkInsert('OrderItems', orderItems);
    }

    return null; // If no data, no seeding
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('OrderItems', null, {});
  },
};
