// favorite.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    static associate(models) {
      // e.g., each Favorite belongs to a MenuItem:
      Favorite.belongsTo(models.MenuItem, {
        foreignKey: 'MenuItemID',
        as: 'MenuItem'
      });
      // or any other relationships you need
    }
  }

  Favorite.init(
    {
      // define columns for "favorites" table
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      MenuItemID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // etc.
    },
    {
      sequelize,
      modelName: 'Favorite',
      tableName: 'Favorites', // If your table is actually "Favorites"
      timestamps: true, // or false, depending on your schema
    }
  );

  return Favorite;
};
