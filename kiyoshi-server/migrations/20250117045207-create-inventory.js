'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Inventories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      MenuItemID: {  // ✅ Changed from FishID to MenuItemID
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'MenuItems', // ✅ Now links to MenuItems table
          key: 'id',         
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      CurrentStock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      LastUpdated: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Inventories');
  },
};