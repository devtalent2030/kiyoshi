'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MenuItem extends Model {
    static associate(models) {
      MenuItem.hasMany(models.OrderItem, { foreignKey: 'MenuItemID', as: 'OrderItems' });
      MenuItem.hasMany(models.Favorite, { foreignKey: 'MenuItemID', as: 'Favorites' });
      MenuItem.hasOne(models.Inventory, { foreignKey: 'MenuItemID', as: 'Inventory' });
    }
  }
  MenuItem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      itemName: { 
        type: DataTypes.STRING, 
        field: 'ItemName', 
        allowNull: false 
      },
      description: { 
        type: DataTypes.TEXT, 
        field: 'ItemDescription' 
      },
      price: { 
        type: DataTypes.DECIMAL(10, 2), 
        field: 'Price', 
        allowNull: false 
      },
      imageURL: { 
        type: DataTypes.STRING, 
        field: 'imageURL' 
      },
      isPreMadeSet: { 
        type: DataTypes.BOOLEAN, 
        field: 'IsPreMadeSet', 
        defaultValue: false 
      },
      // ADD THIS:
      category: {
        type: DataTypes.STRING,
        field: 'Category', // matches your actual DB column name
      },
    },
    {
      sequelize,
      modelName: 'MenuItem',
      tableName: 'MenuItems', // Adjust if your table name is different
      timestamps: false, // Set to true if your table has createdAt/updatedAt
    }
  );
  return MenuItem;
};
