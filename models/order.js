'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.Customer, { foreignKey: 'CustomerID', as: 'Customer' });
      Order.hasMany(models.OrderItem, { foreignKey: 'OrderID', as: 'OrderItems' });
    }
  }

  Order.init(
    {
      CustomerID: { type: DataTypes.INTEGER, allowNull: false },
      OrderDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      OrderStatus: { type: DataTypes.STRING, defaultValue: 'Pending' },
      TotalPrice: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
    },
    {
      sequelize,
      modelName: 'Order',
    }
  );

  return Order;
};
