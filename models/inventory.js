'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Inventory extends Model {
    static associate(models) {
      // Inventory belongs to a Fish
      Inventory.belongsTo(models.Fish, { foreignKey: 'FishID' });
    }
  }

  Inventory.init(
    {
      FishID: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      tableName: 'Inventories', // Match the database table name
      timestamps: true, // Enable createdAt and updatedAt
    }
  );

  return Inventory;
};
