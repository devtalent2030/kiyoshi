'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate(models) {
      // A Customer can have many Orders
      Customer.hasMany(models.Order, {
        foreignKey: 'CustomerID',
        as: 'Orders', // Alias for orders
      });
    }
  }

  Customer.init(
    {
      FirstName: DataTypes.STRING,
      LastName: DataTypes.STRING,
      PhoneNumber: DataTypes.STRING,
      EmailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      PaymentInfo: DataTypes.TEXT,
      Password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Role: {
        type: DataTypes.ENUM('admin', 'customer', 'guest'), // Match the database enum
        allowNull: false,
        defaultValue: 'customer', // Default role for users
      },
      DateCreated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      ProfileImageURL: {
        type: DataTypes.STRING,
        allowNull: true, // Optional field for profile image
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: 'Customer',
    }
  );

  return Customer;
};
