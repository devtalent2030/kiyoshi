'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      FirstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      LastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      PhoneNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      EmailAddress: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      PaymentInfo: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      Password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Role: {
        type: Sequelize.ENUM('admin', 'customer', 'guest'), // Match the database enum
        allowNull: false,
        defaultValue: 'customer', // Default role for users
      },
      DateCreated: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      ProfileImageURL: {
        type: Sequelize.STRING,
        allowNull: true, // Optional field for profile image
        defaultValue: null,
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
    await queryInterface.dropTable('Customers');
  },
};
