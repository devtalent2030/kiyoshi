'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const suppliers = await queryInterface.sequelize.query(
      'SELECT id FROM Suppliers',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (suppliers.length > 0) {
      return queryInterface.bulkInsert('Fishes', suppliers.map((supplier, i) => ({
        FishName: `Fish${i + 11}`,
        CurrentPrice: (i + 11) * 15.0,
        SupplierID: supplier.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })));
    }

    return null;
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Fishes', null, {});
  },
};
