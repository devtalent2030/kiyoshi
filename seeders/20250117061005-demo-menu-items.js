'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const existingMenuItems = await queryInterface.sequelize.query(
      'SELECT id FROM MenuItems',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingMenuItems.length === 0) {
      return queryInterface.bulkInsert('MenuItems', Array.from({ length: 10 }, (_, i) => ({
        ItemName: `MenuItem${i + 11}`,
        ItemDescription: `Description for MenuItem${i + 11}`,
        Price: (i + 11) * 5.0,
        IsPreMadeSet: i % 2 === 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })));
    }

    return null;
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('MenuItems', null, {});
  },
};
