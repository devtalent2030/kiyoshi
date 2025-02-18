// In migrations/xxxxxx-add-password-to-customers.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Customers', 'Password', {
      type: Sequelize.STRING,
      allowNull: true // or false, depending on your rules
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Customers', 'Password');
  }
};
