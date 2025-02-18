'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    static associate(models) {
      // A Favorite belongs to one Customer
      Favorite.belongsTo(models.Customer, { 
        foreignKey: 'CustomerID', 
        as: 'Customer' 
      });

      // A Favorite belongs to one MenuItem
      Favorite.belongsTo(models.MenuItem, { 
        foreignKey: 'MenuItemID', 
        as: 'MenuItem' 
      });
    }
  }

  Favorite.init(
    {
      CustomerID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      MenuItemID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Favorite',
      tableName: 'Favorites', // Ensure it matches your actual table name
    }
  );

  return Favorite;
};
