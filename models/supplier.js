'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Supplier extends Model {
    static associate(models) {
      // Add associations if needed, e.g., Supplier might supply MenuItems
      // Supplier.hasMany(models.MenuItem, { foreignKey: 'SupplierID' });
    }
  }

  Supplier.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      SupplierName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ContactName: {
        type: DataTypes.STRING,
      },
      ContactPhone: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Supplier',
      tableName: 'Suppliers',
      timestamps: false, // Set to true if your table has createdAt/updatedAt
    }
  );

  return Supplier;
};