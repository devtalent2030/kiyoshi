'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Supplier extends Model {
    static associate(models) {
      // A Supplier can have many Fishes
      Supplier.hasMany(models.Fish, { foreignKey: 'SupplierID' });
    }
  }
  Supplier.init({
    SupplierName: DataTypes.STRING,
    ContactName: DataTypes.STRING,
    ContactPhone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Supplier',
  });
  return Supplier;
};
