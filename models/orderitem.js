'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      OrderItem.belongsTo(models.Order, { foreignKey: 'OrderID', as: 'Order' });
      OrderItem.belongsTo(models.MenuItem, { foreignKey: 'MenuItemID', as: 'MenuItem' });
    }
  }

  OrderItem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      OrderID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Orders',
          key: 'id',
        },
      },
      MenuItemID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'MenuItems',
          key: 'id',
        },
      },
      Quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      LineTotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'OrderItem',
      tableName: 'OrderItems',
      timestamps: false, // Set to true if your table has createdAt/updatedAt
    }
  );

  return OrderItem;
};