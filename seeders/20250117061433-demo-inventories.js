'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const fishes = await queryInterface.sequelize.query(
      'SELECT id FROM Fishes',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (fishes.length > 0) {
      return queryInterface.bulkInsert('Inventories', fishes.map((fish, i) => ({
        FishID: fish.id,
        CurrentStock: (i + 11) * 20,
        LastUpdated: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })));
    }

    return null;
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Inventories', null, {});
  },
};
