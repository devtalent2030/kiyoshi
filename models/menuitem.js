'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MenuItem extends Model {
    static associate(models) {
      MenuItem.hasMany(models.OrderItem, { foreignKey: 'MenuItemID' });
    }
  }
  MenuItem.init({
    itemName: { type: DataTypes.STRING, field: 'ItemName' }, // Map to ItemName
    description: { type: DataTypes.TEXT, field: 'ItemDescription' }, // Map to ItemDescription
    price: { type: DataTypes.DECIMAL, field: 'Price' }, // Map to Price
    imageURL: { type: DataTypes.STRING, field: 'imageURL' }, // Map to imageURL
    isPreMadeSet: { type: DataTypes.BOOLEAN, field: 'IsPreMadeSet' } // Map to IsPreMadeSet
  }, {
    sequelize,
    modelName: 'MenuItem',
  });
  return MenuItem;
};
