'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add the ProfileImageURL column to the Customers table
    await queryInterface.addColumn('Customers', 'ProfileImageURL', {
      type: Sequelize.STRING, // Define the column type
      allowNull: true,       // Allow null values
      defaultValue: null,    // Default value for existing records
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the ProfileImageURL column if the migration is undone
    await queryInterface.removeColumn('Customers', 'ProfileImageURL');
  },
};
