'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Fish extends Model {
    static associate(models) {
      // A Fish belongs to a Supplier
      Fish.belongsTo(models.Supplier, { foreignKey: 'SupplierID' });

      // A Fish can have many Inventory records
      Fish.hasMany(models.Inventory, { foreignKey: 'FishID' });
    }
  }

  Fish.init(
    {
      FishName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      CurrentPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      SupplierID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Fish',
      tableName: 'Fishes', // Match the database table name
      timestamps: true, // Enable createdAt and updatedAt
    }
  );

  return Fish;
};
