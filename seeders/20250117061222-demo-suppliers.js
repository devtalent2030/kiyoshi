'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const existingSuppliers = await queryInterface.sequelize.query(
      'SELECT id FROM Suppliers',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingSuppliers.length === 0) {
      return queryInterface.bulkInsert('Suppliers', Array.from({ length: 10 }, (_, i) => ({
        SupplierName: `Supplier${i + 11}`,
        ContactName: `Contact${i + 11}`,
        ContactPhone: `555-123-45${i}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      })));
    }

    return null;
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Suppliers', null, {});
  },
};
