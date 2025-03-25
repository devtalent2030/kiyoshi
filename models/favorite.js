'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Inventory extends Model {
    static associate(models) {
      // Inventory belongs to a MenuItem
      Inventory.belongsTo(models.MenuItem, { 
        foreignKey: 'MenuItemID',
        as: 'MenuItem' // Add alias for consistency
      });
    }
  }

  Inventory.init(
    {
      MenuItemID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'MenuItems',
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
      tableName: 'Inventories',
      timestamps: true,
    }
  );

  return Inventory;
};