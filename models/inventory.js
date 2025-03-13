'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Inventory extends Model {
    static associate(models) {
      // Inventory now belongs to a MenuItem instead of Fish
      Inventory.belongsTo(models.MenuItem, { foreignKey: 'MenuItemID' });
    }
  }

  Inventory.init(
    {
      MenuItemID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'MenuItems', // Correct table reference
          key: 'id',
        },
      },
      CurrentStock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      LastUpdated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Inventory',
      tableName: 'Inventories', // Ensure it matches your MySQL table
      timestamps: true, // Enable createdAt and updatedAt
    }
  );

  return Inventory;
};