'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      // An OrderItem belongs to an Order
      OrderItem.belongsTo(models.Order, { foreignKey: 'OrderID', as: 'Order' });
      // An OrderItem belongs to a MenuItem
      OrderItem.belongsTo(models.MenuItem, { foreignKey: 'MenuItemID', as: 'MenuItem' });
    }
  }
  OrderItem.init({
    OrderID: DataTypes.INTEGER,
    MenuItemID: DataTypes.INTEGER,
    Quantity: DataTypes.INTEGER,
    LineTotal: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'OrderItem',
  });
  return OrderItem;
};
