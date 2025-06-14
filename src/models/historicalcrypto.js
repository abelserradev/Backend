'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HistoricalCrypto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  HistoricalCrypto.init({
    name: DataTypes.STRING,
    symbol: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'HistoricalCrypto',
  });
  return HistoricalCrypto;
};