'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderItems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      OrderID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Orders', // Name of the target table
          key: 'id',       // Key in the target table
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      MenuItemID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'MenuItems', // Name of the target table
          key: 'id',          // Key in the target table
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      Quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      LineTotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
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
    await queryInterface.dropTable('OrderItems');
  },
};
