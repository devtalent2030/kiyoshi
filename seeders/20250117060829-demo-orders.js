'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const customers = await queryInterface.sequelize.query(
      'SELECT id FROM Customers WHERE id > 20', // Only new customers
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (customers.length > 0) {
      return queryInterface.bulkInsert('Orders', customers.map((customer, i) => ({
        CustomerID: customer.id,
        OrderDate: new Date(),
        PickupTime: new Date(),
        OrderStatus: i % 2 === 0 ? 'Completed' : 'Pending',
        TotalPrice: (i + 1) * 10.5,
        createdAt: new Date(),
        updatedAt: new Date(),
      })));
    }

    return null;
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Orders', null, {});
  },
};
