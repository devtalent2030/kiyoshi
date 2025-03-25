'use strict';

module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    EmailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensures no duplicate emails
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'customer', // Default role for new users
    },
    DateCreated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Auto-sets timestamp at row creation
    },
  }, {
    tableName: 'Customers',
    timestamps: false,
  });

  // Example association (if Orders exist):
  Customer.associate = (models) => {
    Customer.hasMany(models.Order, { foreignKey: 'CustomerID' });
  };

  return Customer;
};
