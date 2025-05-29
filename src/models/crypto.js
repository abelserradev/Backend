'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Crypto extends Model {
    static associate(models) {
      // define association here
    }
  }
  Crypto.init({
    name: DataTypes.STRING,
    symbol: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Crypto',
  });
  return Crypto;
};